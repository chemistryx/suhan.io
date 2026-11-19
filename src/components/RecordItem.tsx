import { RecordSummary } from "@/types/record";
import Link from "next/link";
import Badge from "./Badge";
import { toDateDistanceString } from "@/utils/strings";
import styles from "@/styles/components/RecordItem.module.scss";
import { CSSProperties } from "react";

interface Props {
    record: RecordSummary;
    style?: CSSProperties;
}

const RecordItem = ({ record, style }: Props) => {
    return (
        <div className={[styles.base, !record.published ? styles.dimmed : ""].join(" ")} style={style}>
            <Link className={styles.title} href={`/records/${record.slug}`}>{record.title}</Link>
            {record.description && <p className={styles.description}>{record.description}</p>}
            <div className={styles.tags}>
                {record.tags.map((tag) => (
                    <Link key={tag.slug} href={`/tags/${tag.slug}`}>
                        <Badge>{tag.name}</Badge>
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
