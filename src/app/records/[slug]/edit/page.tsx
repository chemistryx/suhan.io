import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditRecordPageComponent from "./EditRecordPageComponent";
import { NavigationGuardProvider } from "next-navigation-guard";
import { Tag } from "@/types/tag";
import { cache } from "react";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = cache(async (slug: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(name))")
        .eq("slug", slug)
        .single();

    if (!data || error) return notFound();

    const record = { ...data, tags: data.tags.map((t: { tag: Tag }) => t.tag.name) };

    return record;
});

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return {
        title: record.title,
        openGraph: {
            title: record.title
        }
    };
}

export default async function EditRecordPage({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return (
        <NavigationGuardProvider>
            <EditRecordPageComponent record={record} />
        </NavigationGuardProvider>
    );
}
