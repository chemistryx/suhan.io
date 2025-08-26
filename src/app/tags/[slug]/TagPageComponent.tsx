"use client"
import styles from "@/styles/pages/tags/TagPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { Record } from "@/types/record";
import { Tag } from "@/types/tag";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import RecordItem from "@/components/RecordItem";

interface Props {
    slug: string;
    records: (Pick<Record, "id" | "title" | "description" | "slug" | "created_at" | "published"> & {
        tags: Pick<Tag, "id" | "name" | "slug">[];
    })[];
}
const TagPageComponent = ({ slug, records }: Props) => {
    const router = useRouter();

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>#{slug}</HeadingTitle>
                <HeadingDescription>
                    <span>{records.length}개의 기록이 있습니다.</span>
                    <div className={styles.actions}>
                        <Button className={styles.list} size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/tags")}><ChevronLeft size={16} strokeWidth={1.5} />목록</Button>
                    </div>
                </HeadingDescription>
            </Heading>
            <div className={styles.records}>
                {records.map((record, idx) => (
                    <RecordItem key={record.id} record={record} style={{ animationDelay: `${(idx + 1) * 0.1}s` }} />
                ))}
            </div>
        </div>
    );
};

export default TagPageComponent;
