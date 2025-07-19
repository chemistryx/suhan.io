import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewRecordPageComponent from "./NewRecordPageComponent";
import { NavigationGuardProvider } from "next-navigation-guard";

export default async function NewRecordPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) notFound(); // fallback

    return (
        <NavigationGuardProvider>
            <NewRecordPageComponent user={user} />
        </NavigationGuardProvider>
    );
}
