import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import NewRecordPageComponent from "./NewRecordPageComponent";
import { NavigationGuardProvider } from "next-navigation-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "새 기록",
    description: "새 기록을 작성합니다.",
    openGraph: {
        title: "새 기록",
        description: "새 기록을 작성합니다."
    }
};

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
