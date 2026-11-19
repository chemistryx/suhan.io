"use client"
import styles from "@/styles/pages/tags/TagPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { RecordSummary } from "@/types/record";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { ChevronLeft } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import RecordItem from "@/components/RecordItem";
import { toStaggerDelay } from "@/utils/animations";

interface Props {
    slug: string;
    records: RecordSummary[];
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
                        <Button className={styles.list} size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/tags")}><ChevronLeft size={16} />목록</Button>
                    </div>
                </HeadingDescription>
            </Heading>
            <div className={styles.records}>
                {records.map((record, idx) => (
                    <RecordItem key={record.slug} record={record} style={{ animationDelay: toStaggerDelay(idx) }} />
                ))}
            </div>
        </div>
    );
};

export default TagPageComponent;
