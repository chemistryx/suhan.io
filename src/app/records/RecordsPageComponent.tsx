"use client"
import Badge from "@/components/Badge";
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import useUser from "@/hooks/useUser";
import styles from "@/styles/pages/records/RecordsPage.module.scss";
import { Record } from "@/types/record";
import { Tag } from "@/types/tag";
import { toDateDistanceString } from "@/utils/strings";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    records: (Pick<Record, "id" | "title" | "slug" | "created_at" | "draft"> & {
        tags: Pick<Tag, "id" | "name" | "slug">[];
    })[];
}

const RecordsPageComponent = ({ records }: Props) => {
    const { user } = useUser();
    const router = useRouter();

    const handleNewRecord = () => {
        router.push("/records/new");
    };

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>기록</HeadingTitle>
                <HeadingDescription>{records.length}개의 기록이 있습니다.</HeadingDescription>
            </Heading>
            {user &&
                <div className={styles.actions}>
                    <Button color={ButtonColor.secondary} size={ButtonSize.small} onClick={handleNewRecord}>새 기록</Button>
                </div>
            }
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
                            <time dateTime={record.created_at} className={styles.item}>{toDateDistanceString(record.created_at)}</time>
                            {record.draft && <span className={styles.item}>Draft</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecordsPageComponent;
