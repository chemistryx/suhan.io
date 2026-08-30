import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "../utils/supabase/server";
import { toStoredSlug } from "@/utils/strings";
import { cache } from "react";
import { RECORD_CATEGORIES, RecordCategory } from "@/constants";

const fetchRecordByStoredSlug = cache(async (storedSlug: string) => {
    const supabase = await createClient();

    return await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(id, name, slug))")
        .eq("slug", storedSlug)
        .single();
});

// Normalising outside the cache keeps both slug shapes on one cache key.
export const fetchRecord = (slug: string) => fetchRecordByStoredSlug(toStoredSlug(slug));

// Navigation follows created_at alone so its order never diverges from what a
// visitor can actually reach, regardless of who is viewing.
export const fetchAdjacentRecords = cache(async (createdAt: string) => {
    const supabase = await createClient();

    const [previous, next] = await Promise.all([
        supabase
            .from(RECORDS_TABLE_NAME)
            .select("id, title, slug")
            .eq("published", true)
            .lt("created_at", createdAt)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase
            .from(RECORDS_TABLE_NAME)
            .select("id, title, slug")
            .eq("published", true)
            .gt("created_at", createdAt)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle()
    ]);

    return { previous: previous.data, next: next.data };
});

// RLS already hides other people's drafts, so created_at alone is enough: a
// visitor's list is unchanged, and the author's own drafts sit in date order
// instead of pinned below everything — the order fetchAdjacentRecords walks.
export const fetchRecords = cache(async () => {
    const supabase = await createClient();

    return await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, description, slug, category, published, created_at, updated_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("created_at", { ascending: false });
});

/**
 * Counts for the sidebar. The select policy on records is
 * "published = true OR author_id = auth.uid()", so an anonymous visitor is
 * counted published records only and the author sees their drafts included —
 * no branch on the session needed here.
 */
export const fetchCategoryCounts = cache(async () => {
    const supabase = await createClient();

    const { data } = await supabase.from(RECORDS_TABLE_NAME).select("category");

    const counts = new Map<string, number>();
    for (const { category } of data ?? []) {
        if (category) counts.set(category, (counts.get(category) ?? 0) + 1);
    }

    return {
        total: data?.length ?? 0,
        categories: RECORD_CATEGORIES.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }))
    };
});

export function isRecordCategory(value?: string): value is RecordCategory {
    return RECORD_CATEGORIES.some((c) => c.slug === value);
}
