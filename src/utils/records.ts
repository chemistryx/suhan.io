import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "./supabase/server";
import { cache } from "react";

export const fetchRecord = cache(async (slug: string) => {
    const supabase = await createClient();

    return await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(id, name, slug))")
        .eq("slug", slug)
        .single();
});

export const fetchRecords = cache(async () => {
    const supabase = await createClient();

    return await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, description, slug, draft, created_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("created_at", { ascending: false });
});
