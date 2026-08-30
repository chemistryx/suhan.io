import RecordsPageComponent from "./RecordsPageComponent";
import { Metadata } from "next";
import { fetchCategoryCounts, fetchRecords, isRecordCategory } from "@/lib/records";
import { RECORD_CATEGORIES } from "@/constants";

interface Props {
    searchParams: Promise<{ category?: string }>;
}

const categoryName = (slug?: string) => RECORD_CATEGORIES.find((c) => c.slug === slug)?.name;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { category } = await searchParams;
    const name = categoryName(category);

    const title = name ? `기록 · ${name}` : "기록";
    const description = name ? `${name}에 대한 기록을 보여줍니다.` : "기록하는 공간입니다.";

    return { title, description, openGraph: { title, description } };
}

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
            selectedName={categoryName(selected ?? undefined)}
        />
    );
}
