import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import styles from "@/styles/components/modals/RecordDeleteModal.module.scss";
import { toast } from "sonner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRecord } from "@/app/records/actions";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    slug: string;
}

const RecordDeleteModal = ({ showModal, setModal, slug }: Props) => {
    const router = useRouter();
    const [isDeleting, setDeleting] = useState(false);

    // Stays busy after success, until the list page replaces this one.
    const handleDelete = async () => {
        if (isDeleting) return;
        setDeleting(true);

        const result = await deleteRecord(slug);

        if (!result.ok) {
            toast.error(result.error);
            setDeleting(false);
            return;
        }

        toast.success("성공적으로 게시물을 삭제했습니다.");
        router.push("/records");
    };

    return (
        <Modal open={showModal} onOpenChange={setModal}>
            <ModalWrapper>
                <ModalHeader>
                    <ModalTitle>삭제 확인</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className={styles.base}>
                        <p>정말 삭제하시겠습니까?</p>
                        <Button onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "삭제 중..." : "삭제"}</Button>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default RecordDeleteModal;
