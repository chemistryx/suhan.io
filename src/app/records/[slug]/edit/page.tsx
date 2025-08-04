import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditRecordPageComponent from "./EditRecordPageComponent";
import { NavigationGuardProvider } from "next-navigation-guard";
import { Tag } from "@/types/tag";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditRecordPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*, tags:record_tags(tag:tags(name))")
        .eq("slug", slug)
        .single();

    if (!data || error) return notFound();

    const record = { ...data, tags: data.tags.map((t: { tag: Tag }) => t.tag.name) };

    return (
        <NavigationGuardProvider>
            <EditRecordPageComponent record={record} />
        </NavigationGuardProvider>
    );
}
