import { COMMENTS_TABLE_NAME } from "@/constants";
import { createClient } from "@/utils/supabase/client";

export const fetchComments = async (recordId: number) => {
    const supabase = createClient();

    return await supabase
        .from(COMMENTS_TABLE_NAME)
        .select("id, record_id, author_name, author_id, content, created_at, updated_at")
        .eq("record_id", recordId)
        .order("created_at", { ascending: true });
};
