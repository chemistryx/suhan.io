import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "../utils/supabase/server";
import { toStoredSlug } from "@/utils/strings";
import { cache } from "react";

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

export const fetchRecords = cache(async () => {
    const supabase = await createClient();

    return await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, description, slug, published, created_at, updated_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("published", { ascending: false })
        .order("created_at", { ascending: false });
});
