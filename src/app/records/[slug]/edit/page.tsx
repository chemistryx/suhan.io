import { notFound } from "next/navigation";
import EditRecordPageComponent from "./EditRecordPageComponent";
import { fetchRecordDoc, fetchTagNames } from "@/lib/records";
import { isAuthor } from "@/lib/viewer";

interface Props {
    params: Promise<{ slug: string }>;
}

const getRecord = async (slug: string) => {
    if (!(await isAuthor())) return notFound();

    return (await fetchRecordDoc(slug)) ?? notFound();
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const record = await getRecord(slug);

    return {
        title: record.title,
        description: "기록을 수정합니다.",
        openGraph: {
            title: record.title,
            description: "기록을 수정합니다."
        }
    };
}

export default async function EditRecordPage({ params }: Props) {
    const { slug } = await params;
    const [record, tagOptions] = await Promise.all([getRecord(slug), fetchTagNames()]);

    return <EditRecordPageComponent record={record} tagOptions={tagOptions} />;
}
