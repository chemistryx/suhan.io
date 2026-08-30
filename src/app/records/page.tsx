import RecordsPageComponent from "./RecordsPageComponent";
import { Metadata } from "next";
import { fetchCategoryCounts, fetchRecords, isRecordCategory } from "@/lib/records";

interface Props {
    searchParams: Promise<{ category?: string }>;
}

// The filter is a view of one page, not a page of its own, so the metadata
// stays the same whichever category is selected.
export const metadata: Metadata = {
    title: "기록",
    description: "기록하는 공간입니다.",
    openGraph: {
        title: "기록",
        description: "기록하는 공간입니다."
    }
};

export default async function RecordsPage({ searchParams }: Props) {
    const { category } = await searchParams;

    // An unknown slug falls back to the unfiltered list rather than an empty one.
    const selected = isRecordCategory(category) ? category : null;

    const [{ data }, { total, categories }] = await Promise.all([fetchRecords(), fetchCategoryCounts()]);

    const records = data
        ?.map((d) => ({ ...d, tags: d.tags.flatMap((t) => t.tag) }))
        .filter((d) => !selected || d.category === selected);

    return (
        <RecordsPageComponent
            records={records ?? []}
            categories={[...categories]}
            total={total}
            selected={selected}
        />
    );
}
