"use client"
import styles from "@/styles/pages/records/RecordPage.module.scss";
import Heading from "@/components/Heading";
import { toDateString } from "@/utils/strings";
import { Record } from "@/types/record";
import Button, { ButtonSize, ButtonStyle } from "@/components/Button";
import RecordDeleteModal from "@/components/modals/RecordDeleteModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import useUser from "@/hooks/useUser";
import MarkdownViewer from "@/components/MarkdownViewer";

interface Props {
    record: Record;
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
                <Heading title={record.title} description={toDateString(record.created_at)} />
                <div className={styles.actions}>
                    {user &&
                        <div className={styles.manage}>
                            <Button size={ButtonSize.small} onClick={handleEdit}>수정</Button>
                            <Button size={ButtonSize.small} onClick={() => setDeleteModal(true)}>삭제</Button>
                        </div>
                    }
                    <Button className={styles.list} size={ButtonSize.small} style={ButtonStyle.outline} onClick={() => router.push("/records")}><ChevronLeft size={16} strokeWidth={1.5} />목록</Button>
                </div>
                <MarkdownViewer content={record.content} />
            </article>
        </>
    );
};

export default RecordPageComponent;
