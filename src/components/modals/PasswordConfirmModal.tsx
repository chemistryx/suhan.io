import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import styles from "@/styles/components/modals/PasswordConfirmModal.module.scss";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    commentId?: number;
    onSuccess?: (commentId: number, password: string) => void;
}

const PasswordConfirmModal = ({ showModal, setModal, commentId, onSuccess }: Props) => {
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        try {
            if (!commentId || !password) return;

            const supabase = createClient();

            const { data, error } = await supabase.rpc("verify_comment", {
                p_comment_id: commentId,
                p_password: password
            });

            if (error) throw error;

            if (!data) {
                toast.error("비밀번호가 일치하지 않습니다.");
                return;
            }

            onSuccess?.(commentId, password);
        } catch (e) {
            toast.error((e as PostgrestError).message || "비밀번호 검증 중 오류가 발생했습니다.");
        } finally {
            setModal(false);
        }
    };

    useEffect(() => {
        if (!showModal) {
            setPassword("");
        }
    }, [showModal]);

    return (
        <Modal open={showModal} onOpenChange={setModal}>
            <ModalWrapper>
                <ModalHeader>
                    <ModalTitle>비밀번호 확인</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className={styles.base}>
                        <p>계속하려면 비밀번호를 입력해주세요.</p>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={handleSubmit} disabled={!password}>확인</Button>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default PasswordConfirmModal;
