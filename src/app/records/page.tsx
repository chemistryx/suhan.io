import { createClient } from "@/utils/supabase/server";
import RecordsPageComponent from "./RecordsPageComponent";
import { RECORDS_TABLE_NAME } from "@/constants";

export default async function RecordsPage() {
    const supabase = await createClient();
    const { data: records } = await supabase
        .from(RECORDS_TABLE_NAME)
        .select("id, title, slug, draft, tags, created_at")
        .order("created_at");

    return <RecordsPageComponent records={records ?? []} />
}
