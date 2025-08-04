import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import RecordPageComponent from "./RecordPageComponent";
import { RECORDS_TABLE_NAME } from "@/constants";
import { Tag } from "@/types/tag";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function RecordPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(id, name, slug))")
        .eq("slug", slug)
        .single();

    if (!data || error) return notFound();

    const record = { ...data, tags: data.tags.flatMap((t: { tag: Tag }) => t.tag) };

    return <RecordPageComponent record={record} />
}
