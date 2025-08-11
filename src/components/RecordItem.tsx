import { Record } from "@/types/record";
import Link from "next/link";
import Badge from "./Badge";
import { toDateDistanceString } from "@/utils/strings";
import styles from "@/styles/components/RecordItem.module.scss";
import { Tag } from "@/types/tag";

interface Props {
    record: Pick<Record, "id" | "title" | "description" | "slug" | "created_at" | "published"> & {
        tags: Pick<Tag, "id" | "name" | "slug">[];
    };
}

const RecordItem = ({ record }: Props) => {
    return (
        <div key={record.id} className={[styles.base, !record.published ? styles.dimmed : ""].join(" ")}>
            <Link className={styles.title} href={`/records/${decodeURIComponent(record.slug)}`}>{record.title}</Link>
            <p className={styles.description}>{record.description}</p>
            <div className={styles.tags}>
                {record.tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <Badge key={tag.id}>{tag.name}</Badge>
                    </Link>
                ))}
            </div>
            <div className={styles.meta}>
                <time dateTime={record.created_at} className={styles.item}>{toDateDistanceString(record.created_at)}</time>
                {!record.published && <span className={styles.item}>Unpublished</span>}
            </div>
        </div>
    );
};

export default RecordItem;
