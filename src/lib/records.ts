import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "../utils/supabase/server";
import { toStoredSlug } from "@/utils/strings";
import { cache } from "react";
import { CATEGORIES_TABLE_NAME } from "@/constants";

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
        .select("id, title, description, slug, category_id, published, created_at, updated_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("created_at", { ascending: false });
});

/**
 * Names come from the categories table and counts from the records the viewer
 * can actually see: the select policy on records is
 * "published = true OR author_id = auth.uid()", so drafts are counted for their
 * author and for nobody else. Order follows created_at, as the tag list does.
 */
export const fetchCategoryCounts = cache(async () => {
    const supabase = await createClient();

    const [{ data: categories }, { data: records }] = await Promise.all([
        supabase.from(CATEGORIES_TABLE_NAME).select("id, name, slug").order("created_at"),
        supabase.from(RECORDS_TABLE_NAME).select("category_id")
    ]);

    const counts = new Map<number, number>();
    for (const { category_id } of records ?? []) {
        if (category_id) counts.set(category_id, (counts.get(category_id) ?? 0) + 1);
    }

    return {
        total: records?.length ?? 0,
        categories: (categories ?? []).map((c) => ({ ...c, count: counts.get(c.id) ?? 0 }))
    };
});
