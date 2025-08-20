import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import Button from "@/components/Button";
import styles from "@/styles/components/modals/CommentDeleteModal.module.scss";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    commentId?: number;
    password: string;
    onSuccess: () => void;
}

const CommentDeleteModal = ({ showModal, setModal, commentId, password, onSuccess }: Props) => {
    const supabase = createClient();

    const handleDelete = async () => {
        if (!commentId) return;

        try {
            const { data, error } = await supabase.rpc("delete_comment", {
                p_comment_id: commentId,
                p_password: password || null
            });

            if (!data) {
                toast.error("비밀번호가 일치하지 않습니다."); // should not happen; already verified in PasswordModal
                return;
            }

            if (error) throw error;

            toast.success("성공적으로 댓글을 삭제했습니다.");

            onSuccess();
        } catch (e) {
            toast.error((e as PostgrestError).message || `댓글 삭제 중 오류가 발생했습니다.`);
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
