import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import Button from "@/components/Button";
import styles from "@/styles/components/modals/CommentDeleteModal.module.scss";
import { toast } from "sonner";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    commentId?: number;
    password: string;
    onSuccess: () => void;
}

const CommentDeleteModal = ({ showModal, setModal, commentId, password, onSuccess }: Props) => {
    const handleDelete = async () => {
        if (!commentId) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: password || undefined })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error);

            toast.success("성공적으로 댓글을 삭제했습니다.");

            onSuccess();
        } catch (e) {
            toast.error((e as Error).message || "댓글 삭제 중 오류가 발생했습니다.");
        } finally {
            setModal(false);
        }
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
                        <Button onClick={handleDelete}>삭제</Button>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default CommentDeleteModal;
