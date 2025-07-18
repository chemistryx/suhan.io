import { Modal, ModalContent, ModalWrapper } from "@/components/Modal";
import styles from "@/styles/components/modals/SignInModal.module.scss";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "@/components/Button";
import Input from "@/components/Input";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
}

const SignInModal = ({ showModal, setModal }: Props) => {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            toast.error("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("성공적으로 로그인했습니다.");
        setModal(false);
    };

    useEffect(() => {
        if (!showModal) {
            setEmail("");
            setPassword("");
            setLoading(false);
        }
    }, [showModal]);

    return (
        <Modal open={showModal} onOpenChange={setModal}>
            <ModalWrapper>
                <ModalContent>
                    <div className={styles.base}>
                        <h3 className={styles.title}>로그인</h3>
                        <form className={styles.inputWrapper} onSubmit={handleLogin}>
                            <Input type="text" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button type="submit" disabled={isLoading}>로그인</Button>
                        </form>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default SignInModal;
