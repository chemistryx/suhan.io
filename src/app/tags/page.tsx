import { TAGS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import TagsPageComponent from "./TagsPageComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "태그",
    openGraph: {
        title: "태그"
    }
};

export default async function TagsPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from(TAGS_TABLE_NAME)
        .select("id, name, slug, records:record_tags(record:records(id, published))")
        .order("created_at");

    const tags = data?.map((d) => {
        const records = d.records?.flatMap((r) => r.record).filter((record) => record?.published);

        return {
            id: d.id,
            name: d.name,
            slug: d.slug,
            count: records.length ?? 0,
        };
    }).filter((tag) => tag.count > 0);

    return <TagsPageComponent tags={tags ?? []} />
}
