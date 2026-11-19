import "server-only";
import { cache } from "react";
import { CATEGORIES } from "@/constants";
import { AdjacentRecords, Record, RecordDoc, RecordSummary } from "@/types/record";
import { normalize, toSlug } from "@/utils/strings";
import { loadRecords } from "./content/store";
import { isAuthor } from "./viewer";

const byNewest = (a: { created_at: string }, b: { created_at: string }) => b.created_at.localeCompare(a.created_at);

const toRecord = (doc: RecordDoc): Record => ({
    ...doc,
    category: CATEGORIES.find((c) => c.slug === doc.category) ?? null,
    tags: doc.tags.map((name) => ({ name, slug: normalize(name) }))
});

const toSummary = (record: Record): RecordSummary => {
    const { content, ...summary } = record;
    void content;
    return summary;
};

/** Every record, newest first, drafts included. */
const allDocs = cache(async () => [...(await loadRecords())].sort(byNewest));

/** Drafts are visible to the author only. */
const visibleDocs = cache(async () => {
    const [docs, author] = await Promise.all([allDocs(), isAuthor()]);

    return author ? docs : docs.filter((d) => d.published);
});

export const fetchRecords = cache(async (): Promise<RecordSummary[]> =>
    (await visibleDocs()).map((d) => toSummary(toRecord(d)))
);

export const fetchRecord = cache(async (slug: string): Promise<Record | null> => {
    const doc = (await visibleDocs()).find((d) => d.slug === toSlug(slug));

    return doc ? toRecord(doc) : null;
});

/** The record with this id, if this viewer can see it. */
export const findVisibleRecord = async (id: number) => (await visibleDocs()).find((d) => d.id === id) ?? null;

/** Stored form, for the editor. */
export const fetchRecordDoc = cache(async (slug: string): Promise<RecordDoc | null> =>
    (await allDocs()).find((d) => d.slug === toSlug(slug)) ?? null
);

// Published records only, whoever is viewing.
export const fetchAdjacentRecords = cache(async (createdAt: string): Promise<AdjacentRecords> => {
    const published = (await allDocs()).filter((d) => d.published);
    const pick = (d?: RecordDoc) => (d ? { title: d.title, slug: d.slug } : null);

    return {
        previous: pick(published.find((d) => d.created_at < createdAt)),
        next: pick([...published].reverse().find((d) => d.created_at > createdAt))
    };
});

export const fetchCategoryCounts = cache(async () => {
    const docs = await visibleDocs();

    return {
        total: docs.length,
        categories: CATEGORIES.map((c) => ({ ...c, count: docs.filter((d) => d.category === c.slug).length })),
        // record slug -> category slug
        categoryOf: Object.fromEntries(docs.filter((d) => d.category).map((d) => [d.slug, d.category as string]))
    };
});

/** Tags on published records, in order of first use. */
export const fetchTags = cache(async () => {
    const published = (await allDocs()).filter((d) => d.published).reverse();
    const tags = new Map<string, { name: string; slug: string; count: number }>();

    for (const doc of published) {
        for (const name of doc.tags) {
            const slug = normalize(name);
            const tag = tags.get(slug) ?? { name, slug, count: 0 };
            tag.count += 1;
            tags.set(slug, tag);
        }
    }

    return [...tags.values()];
});

/** All tag names, for editor suggestions. */
export const fetchTagNames = cache(async () => {
    const names = new Map<string, string>();
    for (const doc of await allDocs()) for (const name of doc.tags) if (!names.has(normalize(name))) names.set(normalize(name), name);

    return [...names.values()];
});

export const fetchPublishedRecords = cache(async () =>
    (await allDocs()).filter((d) => d.published).map((d) => toSummary(toRecord(d)))
);
