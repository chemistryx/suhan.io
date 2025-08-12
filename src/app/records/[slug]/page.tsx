import { notFound } from "next/navigation";
import RecordPageComponent from "./RecordPageComponent";
import { Tag } from "@/types/tag";
import { fetchRecord } from "@/utils/records";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = async (slug: string) => {
    const { data, error } = await fetchRecord(slug);

    if (!data || error) return notFound();

    const record = { ...data, tags: data.tags.flatMap((t: { tag: Tag }) => t.tag) };

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

    return <RecordPageComponent record={record} />
}
