"use client"
import Button, { ButtonColor, ButtonSize } from "@/components/Button";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import RecordItem from "@/components/RecordItem";
import useUser from "@/hooks/useUser";
import styles from "@/styles/pages/records/RecordsPage.module.scss";
import { Record } from "@/types/record";
import { Tag } from "@/types/tag";
import { toStaggerDelay } from "@/utils/animations";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    records: (Pick<Record, "id" | "title" | "description" | "slug" | "created_at" | "published"> & {
        tags: Pick<Tag, "id" | "name" | "slug">[];
    })[];
    categories: { slug: string, name: string, count: number }[];
    total: number;
    selected: string | null;
    selectedName?: string;
}

const RecordsPageComponent = ({ records, categories, total, selected, selectedName }: Props) => {
    const { user } = useUser();
    const router = useRouter();

    const handleNewRecord = () => {
        router.push("/records/new");
    };

    const chips = [{ slug: null, name: "전체", count: total }, ...categories];

    return (
        <div className={styles.base}>
            <Heading>
                <HeadingTitle>기록</HeadingTitle>
                <HeadingDescription>
                    {selectedName ? `${selectedName} · ` : ""}{records.length}개의 기록이 있습니다.
                </HeadingDescription>
            </Heading>
            {/* Below $viewport-lg the navbar is a single row with no space for a
                nested list, so the categories move next to the list they filter. */}
            <div className={styles.categories}>
                {chips.map((chip) => (
                    <Link
                        key={chip.slug ?? "all"}
                        className={[
                            styles.chip,
                            selected === chip.slug ? styles.active : "",
                            chip.count === 0 ? styles.empty : ""
                        ].join(" ")}
                        href={chip.slug ? `/records?category=${chip.slug}` : "/records"}
                    >
                        {chip.name}
                    </Link>
                ))}
            </div>
            {user &&
                <div className={styles.actions}>
                    <Button color={ButtonColor.secondary} size={ButtonSize.small} onClick={handleNewRecord}>새 기록</Button>
                </div>
            }
            <div className={styles.records}>
                {records.map((record, idx) => (
                    <RecordItem key={record.id} record={record} style={{ animationDelay: toStaggerDelay(idx) }} />
                ))}
            </div>
        </div>
    );
};

export default RecordsPageComponent;
