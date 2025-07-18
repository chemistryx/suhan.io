import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import RecordPageComponent from "./RecordPageComponent";
import { RECORDS_TABLE_NAME } from "@/constants";

interface Props {
    params: { slug: string };
}

export default async function RecordPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: record, error } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("*")
        .eq("slug", slug)
        .single();

    if (!record || error) return notFound();

    return <RecordPageComponent record={record} />
}
