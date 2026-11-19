import { notFound } from "next/navigation";
import NewRecordPageComponent from "./NewRecordPageComponent";
import { Metadata } from "next";
import { isAuthor } from "@/lib/viewer";
import { fetchTagNames } from "@/lib/records";

export const metadata: Metadata = {
    title: "새 기록",
    description: "새 기록을 작성합니다.",
    openGraph: {
        title: "새 기록",
        description: "새 기록을 작성합니다."
    }
};

export default async function NewRecordPage() {
    if (!(await isAuthor())) notFound(); // fallback; the proxy already turns visitors away

    return <NewRecordPageComponent tagOptions={await fetchTagNames()} />;
}
