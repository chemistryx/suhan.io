"use client"
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import useUser from "@/hooks/useUser";
import styles from "@/styles/pages/records/RecordsPage.module.scss";
import { Record } from "@/types/record";
import { toDateString } from "@/utils/strings";
import { useRouter } from "next/navigation";

interface Props {
    records: Pick<Record, "id" | "title" | "slug" | "created_at" | "draft" | "tags">[];
}

const RecordsPageComponent = ({ records }: Props) => {
    const { user } = useUser();
    const router = useRouter();

    console.log(records);

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
                    <Button onClick={handleNewRecord}>새 기록</Button>
                </div>
            }
            <div className={styles.recordsWrapper}>
                <ul className={styles.records}>
                    {records.map((record) => (
                        <li key={record.id} className={styles.record}>
                            <a className={styles.link} href={`/records/${decodeURIComponent(record.slug)}`}>
                                <div className={styles.contentWrapper}>
                                    <h4 className={styles.title}>{record.title}</h4>
                                    <div className={styles.tags}>
                                        {record.tags.map((tag) => (
                                            <Badge key={tag}>{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className={styles.meta}>
                                        <time dateTime={record.created_at} className={styles.item}>{toDateString(record.created_at)}</time>
                                        {record.draft && <span className={styles.item}>Draft</span>}
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecordsPageComponent;
