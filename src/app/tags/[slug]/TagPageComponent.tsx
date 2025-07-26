"use client"
import styles from "@/styles/pages/tags/TagPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { Record } from "@/types/record";
import { Tag } from "@/types/tag";
import Link from "next/link";
import Badge from "@/components/Badge";
import { toDateString } from "@/utils/strings";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    slug: string;
    records: (Pick<Record, "id" | "title" | "slug" | "created_at" | "draft"> & {
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
            <ul className={styles.records}>
                {records.map((record) => (
                    <li key={record.id} className={styles.record}>
                        <Link className={styles.title} href={`/records/${decodeURIComponent(record.slug)}`}>{record.title}</Link>
                        <div className={styles.tags}>
                            {record.tags.map((tag) => (
                                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                                    <Badge key={tag.id}>{tag.name}</Badge>
                                </Link>
                            ))}
                        </div>
                        <div className={styles.meta}>
                            <time dateTime={record.created_at} className={styles.item}>{toDateString(record.created_at)}</time>
                            {record.draft && <span className={styles.item}>Draft</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TagPageComponent;
