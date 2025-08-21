import RecordsPageComponent from "./RecordsPageComponent";
import { Metadata } from "next";
import { fetchRecords } from "@/lib/records";

export const metadata: Metadata = {
    title: "기록",
    description: "기록하는 공간입니다.",
    openGraph: {
        title: "기록",
        description: "기록하는 공간입니다."
    }
};

export default async function RecordsPage() {
    const { data } = await fetchRecords();

    const records = data?.map((d) => ({
        ...d,
        tags: d.tags.flatMap((t) => t.tag)
    }));

    return <RecordsPageComponent records={records ?? []} />
}
