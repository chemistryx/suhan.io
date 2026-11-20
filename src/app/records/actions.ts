"use server";
import { CATEGORIES } from "@/constants";
import { deleteRecord as removeRecord, loadSnapshot, readSnapshot, saveRecord, StaleSnapshotError } from "@/lib/content/store";
import { isAuthor } from "@/lib/viewer";
import { RecordDoc } from "@/types/record";
import { normalize, toSlug } from "@/utils/strings";

export type RecordInput = Pick<RecordDoc, "title" | "description" | "content" | "category" | "tags" | "published">;

type Result = { ok: true; slug: string } | { ok: false; error: string };

const fail = (error: string) => ({ ok: false as const, error });

type Snapshot = Awaited<ReturnType<typeof readSnapshot>>;

// Writes start from the cached state; if the repo moved since, GitHub rejects
// the commit and the write is retried once against a fresh read.
const withSnapshot = async (write: (snapshot: Snapshot) => Promise<Result>) => {
    try {
        return await write(await loadSnapshot());
    } catch (e) {
        if (!(e instanceof StaleSnapshotError)) throw e;
        return write(await readSnapshot());
    }
};

// Validates input. A tag matching an existing one by slug reuses its spelling.
const prepare = (input: RecordInput, others: RecordDoc[]) => {
    const title = input.title.trim();
    const slug = normalize(title);

    if (!title || !slug) return fail("제목을 입력해주세요.");
    if (others.some((r) => r.slug === slug)) return fail("같은 제목의 기록이 이미 있습니다.");
    if (input.category && !CATEGORIES.some((c) => c.slug === input.category)) return fail("알 수 없는 카테고리입니다.");

    const known = new Map<string, string>();
    for (const r of others) for (const name of r.tags) if (!known.has(normalize(name))) known.set(normalize(name), name);

    const tags: string[] = [];
    for (const raw of input.tags) {
        const name = raw.trim();
        const tagSlug = normalize(name);
        if (!tagSlug || tags.some((t) => normalize(t) === tagSlug)) continue;
        tags.push(known.get(tagSlug) ?? name);
    }

    return { ok: true as const, slug, fields: { ...input, title, tags, description: input.description.trim() } };
};

export async function createRecord(input: RecordInput): Promise<Result> {
    if (!(await isAuthor())) return fail("권한이 없습니다.");

    try {
        return await withSnapshot(async (snapshot) => {
            const prepared = prepare(input, snapshot.records);
            if (!prepared.ok) return prepared;

            const now = new Date().toISOString();
            const record: RecordDoc = {
                ...prepared.fields,
                id: Math.max(0, ...snapshot.records.map((r) => r.id)) + 1,
                slug: prepared.slug,
                created_at: now,
                updated_at: now
            };

            await saveRecord(snapshot, record);
            return { ok: true, slug: record.slug };
        });
    } catch (e) {
        console.error("createRecord", e);
        return fail("게시물 등록 중 오류가 발생했습니다.");
    }
}

export async function updateRecord(slug: string, input: RecordInput): Promise<Result> {
    if (!(await isAuthor())) return fail("권한이 없습니다.");

    try {
        return await withSnapshot(async (snapshot) => {
            const current = snapshot.records.find((r) => r.slug === toSlug(slug));
            if (!current) return fail("기록을 찾을 수 없습니다.");

            const prepared = prepare(input, snapshot.records.filter((r) => r !== current));
            if (!prepared.ok) return prepared;

            const record: RecordDoc = {
                ...current,
                ...prepared.fields,
                slug: prepared.slug,
                updated_at: new Date().toISOString()
            };

            await saveRecord(snapshot, record, current.slug);
            return { ok: true, slug: record.slug };
        });
    } catch (e) {
        console.error("updateRecord", e);
        return fail("게시물 수정 중 오류가 발생했습니다.");
    }
}

export async function deleteRecord(slug: string): Promise<Result> {
    if (!(await isAuthor())) return fail("권한이 없습니다.");

    try {
        return await withSnapshot(async (snapshot) => {
            const current = snapshot.records.find((r) => r.slug === toSlug(slug));
            if (!current) return fail("기록을 찾을 수 없습니다.");

            await removeRecord(snapshot, current);
            return { ok: true, slug: current.slug };
        });
    } catch (e) {
        console.error("deleteRecord", e);
        return fail("게시물 삭제 중 오류가 발생했습니다.");
    }
}
