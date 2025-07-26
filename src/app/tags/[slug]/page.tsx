import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TagPageComponent from "./TagPageComponent";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();
    const decodedSlug = decodeURIComponent(slug);

    const { data } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, slug, draft, created_at, tags:record_tags(tag:tags(id, name, slug))")
        .order("created_at", { ascending: false });

    const records = data?.map((d) => ({
        ...d,
        tags: d.tags.flatMap((t) => t.tag)
    })).filter((record) => record.tags.some((t) => t.slug === decodedSlug));

    if (!records?.length) return notFound();

    return <TagPageComponent slug={decodedSlug} records={records} />
}
