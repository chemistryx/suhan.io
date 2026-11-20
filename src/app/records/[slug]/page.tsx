import { notFound } from "next/navigation";
import RecordPageComponent from "./RecordPageComponent";
import { fetchAdjacentRecords, fetchRecord } from "@/lib/records";
import Markdown from "@/components/markdown/Markdown";
import styles from "@/styles/pages/records/RecordPage.module.scss";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = async (slug: string) => {
    const record = await fetchRecord(slug);

    return record ?? notFound();
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

    return (
        <RecordPageComponent
            record={record}
            adjacent={adjacent}
            content={<Markdown source={record.content} className={styles.content} />}
        />
    );
}
