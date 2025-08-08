import { createClient } from "@/utils/supabase/server";
import RecordsPageComponent from "./RecordsPageComponent";
import { RECORDS_TABLE_NAME } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "기록"
};

export default async function RecordsPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, slug, draft, created_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("created_at", { ascending: false });

    const records = data?.map((d) => ({
        ...d,
        tags: d.tags.flatMap((t) => t.tag)
    }));

    return <RecordsPageComponent records={records ?? []} />
}
