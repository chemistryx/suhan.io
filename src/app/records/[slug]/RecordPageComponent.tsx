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
import ScrollTopButton from "@/components/ScrollTopButton";
import Badge from "@/components/Badge";
import { Tag } from "@/types/tag";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import RecordComments from "@/components/RecordComments";
import rehypeExternalLinks from "rehype-external-links";
import LightboxImage from "@/components/LightboxImage";
import TableOfContents from "@/components/TableOfContents";

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
            <div className={styles.base}>
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
                <MDEditor.Markdown className={styles.content} source={record.content}
                    rehypePlugins={[
                        [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer", "external"] }]
                    ]}
                    components={{
                        img: (props) => <LightboxImage {...props} />
                    }}
                />
                <RecordComments record={record} />
                <TableOfContents contentClassName={styles.content} />
                <ScrollTopButton />
            </div>
        </>
    );
};

export default RecordPageComponent;
