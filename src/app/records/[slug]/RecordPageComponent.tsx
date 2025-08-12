"use client"
import styles from "@/styles/pages/records/RecordPage.module.scss";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/Heading";
import { toDateString } from "@/utils/strings";
import { Record } from "@/types/record";
import Button, { ButtonColor, ButtonSize, ButtonStyle } from "@/components/Button";
import RecordDeleteModal from "@/components/modals/RecordDeleteModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import useUser from "@/hooks/useUser";
import MarkdownViewer from "@/components/MarkdownViewer";
import ScrollTopButton from "@/components/ScrollTopButton";
import Badge from "@/components/Badge";
import { Tag } from "@/types/tag";
import Link from "next/link";
import Giscus from "@giscus/react";

interface Props {
    record: Record & {
        tags: Pick<Tag, "id" | "name" | "slug">[];
    };
}

const RecordPageComponent = ({ record }: Props) => {
    const { user } = useUser();
    const [showDeleteModal, setDeleteModal] = useState(false);
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/records/${decodeURIComponent(record.slug)}/edit`);
    };

    return (
        <>
            <RecordDeleteModal showModal={showDeleteModal} setModal={setDeleteModal} id={record.id} />
            <article className={styles.base}>
                <Heading divider>
                    <HeadingTitle>{record.title}</HeadingTitle>
                    <HeadingDescription>
                        <div className={styles.tags}>
                            {record.tags.map((tag) => (
                                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                                    <Badge key={tag.id}>{tag.name}</Badge>
                                </Link>
                            ))}
                        </div>
                        <span className={styles.date}>{toDateString(record.created_at)}</span>
                        <div className={styles.actions}>
                            {user &&
                                <div className={styles.manage}>
                                    <Button size={ButtonSize.small} color={ButtonColor.secondary} onClick={handleEdit}>수정</Button>
                                    <Button size={ButtonSize.small} color={ButtonColor.secondary} onClick={() => setDeleteModal(true)}>삭제</Button>
                                </div>
                            }
                            <Button className={styles.list} size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/records")}><ChevronLeft size={16} strokeWidth={1.5} />목록</Button>
                        </div>
                    </HeadingDescription>
                </Heading>
                <MarkdownViewer content={record.content} />
            </article>
            <Giscus
                repo="chemistryx/suhan.io"
                repoId="R_kgDOPLS4uQ"
                category="Comments"
                categoryId="DIC_kwDOPLS4uc4CuE-_"
                mapping="pathname"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="bottom"
                theme="https://cdn.jsdelivr.net/gh/chemistryx/suhan.io@main/public/giscus.css"
                lang="ko"
            />
            <ScrollTopButton />
        </>
    );
};

export default RecordPageComponent;
