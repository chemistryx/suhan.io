"use client"
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import RecordItem from "@/components/RecordItem";
import useUser from "@/hooks/useUser";
import styles from "@/styles/pages/records/RecordsPage.module.scss";
import { Record } from "@/types/record";
import { Tag } from "@/types/tag";
import { useRouter } from "next/navigation";

interface Props {
    records: (Pick<Record, "id" | "title" | "description" | "slug" | "created_at" | "published"> & {
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
            <div className={styles.records}>
                {records.map((record, idx) => (
                    <RecordItem key={record.id} record={record} style={{ animationDelay: `${(idx + 1) * 0.1}s` }} />
                ))}
            </div>
        </div>
    );
};

export default RecordsPageComponent;
