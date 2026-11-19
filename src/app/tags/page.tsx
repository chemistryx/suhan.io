import TagsPageComponent from "./TagsPageComponent";
import { Metadata } from "next";
import { fetchTags } from "@/lib/records";

export const metadata: Metadata = {
    title: "태그",
    description: "태그를 저장하는 공간입니다.",
    openGraph: {
        title: "태그",
        description: "태그를 저장하는 공간입니다."
    }
};

export default async function TagsPage() {
    return <TagsPageComponent tags={await fetchTags()} />
}
