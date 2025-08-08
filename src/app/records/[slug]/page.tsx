import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import RecordPageComponent from "./RecordPageComponent";
import { RECORDS_TABLE_NAME } from "@/constants";
import { Tag } from "@/types/tag";
import { cache } from "react";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = cache(async (slug: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(id, name, slug))")
        .eq("slug", slug)
        .single();

    if (!data || error) return notFound();

    const record = { ...data, tags: data.tags.flatMap((t: { tag: Tag }) => t.tag) };

    return record;
});

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return {
        title: record.title
    };
}

export default async function RecordPage({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return <RecordPageComponent record={record} />
}
