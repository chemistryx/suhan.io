import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import styles from "@/styles/components/modals/PasswordModal.module.scss";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    commentId?: number;
    onSuccess: (password: string) => void;
}

const PasswordModal = ({ showModal, setModal, commentId, onSuccess }: Props) => {
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        try {
            if (!commentId || !password) return;

            const res = await fetch(`/api/comments/${commentId}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error);

            onSuccess(password);
        } catch (e) {
            toast.error((e as Error).message || "비밀번호 확인 중 오류가 발생했습니다.");
        } finally {
            handleOpenChange(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) setPassword("");
        setModal(open);
    };

    return (
        <Modal open={showModal} onOpenChange={handleOpenChange}>
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

export default PasswordModal;
