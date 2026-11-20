import "server-only";
import { unstable_cache, updateTag } from "next/cache";
import { parse } from "yaml";
import { RecordDoc } from "@/types/record";

// Records are <slug>.md files in CONTENT_REPO, read and committed via the GitHub API.

export const RECORDS_TAG = "records";

const contentRepo = () => {
    const repo = process.env.CONTENT_REPO;
    const [owner, name] = repo?.split("/") ?? [];
    if (!owner || !name) throw new Error("CONTENT_REPO must be set as owner/name");

    return { repo: repo as string, owner, name };
};

const BRANCH = "main";
const CACHE_WARN_BYTES = 1.5 * 1024 * 1024;

// (de)serialisation

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

const parseRecord = (fileName: string, raw: string): RecordDoc => {
    const match = raw.match(FRONTMATTER_RE);
    if (!match) throw new Error(`${fileName}: missing frontmatter`);

    const meta = parse(match[1]) ?? {};
    const content = raw.slice(match[0].length).replace(/^\n/, "");

    const id = Number(meta.id);
    if (!Number.isInteger(id)) throw new Error(`${fileName}: id must be an integer`);

    return {
        id,
        slug: fileName.replace(/\.md$/, "").normalize("NFC"),
        title: String(meta.title ?? ""),
        description: String(meta.description ?? ""),
        category: meta.category ? String(meta.category) : null,
        tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
        published: meta.published === true,
        created_at: String(meta.created_at),
        updated_at: String(meta.updated_at ?? meta.created_at),
        content
    };
};

// JSON strings are valid YAML scalars.
const q = (value: string) => JSON.stringify(value);

export const serializeRecord = (record: RecordDoc) => [
    "---",
    `id: ${record.id}`,
    `title: ${q(record.title)}`,
    `description: ${q(record.description)}`,
    `category: ${record.category ? q(record.category) : "null"}`,
    `tags: [${record.tags.map(q).join(", ")}]`,
    `published: ${record.published}`,
    `created_at: ${q(record.created_at)}`,
    `updated_at: ${q(record.updated_at)}`,
    "---",
    "",
    record.content.endsWith("\n") ? record.content : record.content + "\n"
].join("\n");

export const fileNameOf = (slug: string) => `${slug.normalize("NFC")}.md`;

// GitHub

const github = async <T>(query: string, variables: object): Promise<T> => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN is not set");

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        cache: "no-store"
    });

    const json = await res.json();
    if (!res.ok || json.errors) throw new Error(`GitHub: ${JSON.stringify(json.errors ?? json)}`);

    return json.data;
};

type TreeEntry = { name: string; type: string; object: { text: string | null; isTruncated: boolean } | null };

type Snapshot = { records: RecordDoc[]; version: string };

// Head commit and tree in one query, so writes commit against what they read.
const readFromGitHub = async (): Promise<Snapshot> => {
    const data = await github<{ repository: { ref: { target: { oid: string; tree: { entries: TreeEntry[] } } } } }>(
        `query($owner: String!, $name: String!, $ref: String!) {
            repository(owner: $owner, name: $name) {
                ref(qualifiedName: $ref) {
                    target {
                        oid
                        ... on Commit { tree { entries { name type object { ... on Blob { text isTruncated } } } } }
                    }
                }
            }
        }`,
        { owner: contentRepo().owner, name: contentRepo().name, ref: `refs/heads/${BRANCH}` }
    );

    const { oid, tree } = data.repository.ref.target;
    const records = tree.entries
        .filter((e) => e.type === "blob" && e.name.endsWith(".md"))
        .map((e) => {
            if (!e.object?.text || e.object.isTruncated) throw new Error(`${e.name}: could not read the whole file`);
            return parseRecord(e.name, e.object.text);
        });

    // Vercel's data cache skips items over 2 MB, which would send every request to GitHub.
    const bytes = Buffer.byteLength(JSON.stringify(records));
    if (bytes > CACHE_WARN_BYTES) console.warn(`records: cached payload is ${Math.round(bytes / 1024)} KB, close to the 2 MB cache limit`);

    return { records, version: oid };
};

// expectedHeadOid rejects the commit if the branch moved since the read.
const commitToGitHub = async (version: string, headline: string, additions: { path: string; contents: string }[], deletions: string[]) => {
    await github(
        `mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }`,
        {
            input: {
                branch: { repositoryNameWithOwner: contentRepo().repo, branchName: BRANCH },
                message: { headline },
                expectedHeadOid: version,
                fileChanges: {
                    additions: additions.map((a) => ({ path: a.path, contents: Buffer.from(a.contents).toString("base64") })),
                    deletions: deletions.map((path) => ({ path }))
                }
            }
        }
    );
};

// public API

const cachedGitHubRead = unstable_cache(readFromGitHub, [RECORDS_TAG], { tags: [RECORDS_TAG], revalidate: 3600 });

const checked = ({ records, version }: Snapshot): Snapshot => {
    const slugs = new Set<string>();
    const ids = new Set<number>();
    for (const r of records) {
        if (slugs.has(r.slug)) throw new Error(`duplicate slug: ${r.slug}`);
        if (ids.has(r.id)) throw new Error(`duplicate id: ${r.id}`);
        slugs.add(r.slug);
        ids.add(r.id);
    }

    return { records, version };
};

/** All records, drafts included. */
export const loadRecords = async (): Promise<RecordDoc[]> => checked(await cachedGitHubRead()).records;

/** Uncached read for writes. */
export const readSnapshot = async (): Promise<Snapshot> => checked(await readFromGitHub());

/** Writes a record, renaming its file if the slug changed. */
export const saveRecord = async (snapshot: Snapshot, record: RecordDoc, previousSlug?: string) => {
    const path = fileNameOf(record.slug);
    const stale = previousSlug && previousSlug !== record.slug ? [fileNameOf(previousSlug)] : [];
    const verb = previousSlug ? "update" : "add";

    await commitToGitHub(snapshot.version, `${verb}: ${record.title}`, [{ path, contents: serializeRecord(record) }], stale);

    updateTag(RECORDS_TAG);
};

export const deleteRecord = async (snapshot: Snapshot, record: RecordDoc) => {
    await commitToGitHub(snapshot.version, `delete: ${record.title}`, [], [fileNameOf(record.slug)]);

    updateTag(RECORDS_TAG);
};
