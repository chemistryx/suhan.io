import { notFound } from "next/navigation";
import TagPageComponent from "./TagPageComponent";
import { fetchRecords } from "@/utils/records";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    return {
        title: "#" + decodedSlug,
        openGraph: {
            title: "#" + decodedSlug
        }
    };
}

export default async function TagPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const { data } = await fetchRecords();

    const records = data?.map((d) => ({
        ...d,
        tags: d.tags.flatMap((t) => t.tag)
    })).filter((record) => record.tags.some((t) => t.slug === decodedSlug));

    if (!records?.length) return notFound();

    return <TagPageComponent slug={decodedSlug} records={records} />
}
