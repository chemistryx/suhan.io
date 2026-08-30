import { notFound } from "next/navigation";
import RecordPageComponent from "./RecordPageComponent";
import { Tag } from "@/types/tag";
import { Category } from "@/types/category";
import { fetchAdjacentRecords, fetchRecord } from "@/lib/records";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = async (slug: string) => {
    const { data, error } = await fetchRecord(slug);

    if (!data || error) return notFound();

    // PostgREST returns the to-one embed as an object; flat() normalises the
    // shape supabase-js infers for it without generated types.
    const category = [data.category].flat()[0] as Pick<Category, "name" | "slug"> | undefined;

    const record = {
        ...data,
        category: category ?? null,
        tags: data.tags.flatMap((t: { tag: Tag }) => t.tag)
    };

    return record;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return {
        title: record.title,
        description: record.description,
        openGraph: {
            title: record.title,
            description: record.description
        }
    };
}

export default async function RecordPage({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);
    const adjacent = await fetchAdjacentRecords(record.created_at);

    return <RecordPageComponent record={record} adjacent={adjacent} />
}
