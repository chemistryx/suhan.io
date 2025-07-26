import { TAGS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import TagsPageComponent from "./TagsPageComponent";

export default async function TagsPage() {
    const supabase = await createClient();
    const { data } = await supabase
        .from(TAGS_TABLE_NAME)
        .select("id, name, slug, records:record_tags(count)")
        .order("created_at");

    const tags = data?.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        count: d.records[0].count ?? 0,
    })).filter((tag) => tag.count > 0);

    return <TagsPageComponent tags={tags ?? []} />
}
