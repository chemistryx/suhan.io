import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewRecordPageComponent from "./NewRecordPageComponent";

export default async function NewRecordPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) notFound(); // fallback

    return <NewRecordPageComponent user={user} />
}
