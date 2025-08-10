import RecordsPageComponent from "./RecordsPageComponent";
import { Metadata } from "next";
import { fetchRecords } from "@/utils/records";

export const metadata: Metadata = {
    title: "기록",
    openGraph: {
        title: "기록"
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
