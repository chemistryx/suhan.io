import { RECORDS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditRecordPageComponent from "./EditRecordPageComponent";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function EditRecordPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: record, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*")
        .eq("slug", slug)
        .single();

    if (!record || error) return notFound();

    return <EditRecordPageComponent record={record} />
}
