import { TAGS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import TagsPageComponent from "./TagsPageComponent";

export default async function TagsPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from(TAGS_TABLE_NAME)
        .select("id, name, slug, records:record_tags(record:records(id, draft))")
        .order("created_at");

    const tags = data?.map((d) => {
        const records = d.records?.flatMap((r) => r.record).filter((record) => record.draft === false);

        return {
            id: d.id,
            name: d.name,
            slug: d.slug,
            count: records.length ?? 0,
        };
    }).filter((tag) => tag.count > 0);


    return <TagsPageComponent tags={tags ?? []} />
}
