import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import styles from "@/styles/components/modals/RecordDeleteModal.module.scss";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { RECORDS_TABLE_NAME } from "@/constants";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    id: number;
}

const RecordDeleteModal = ({ showModal, setModal, id }: Props) => {
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async () => {
        const { error, count } = await supabase.from(RECORDS_TABLE_NAME).delete({ count: "exact" }).eq("id", id);

        if (error || count === 0) {
            toast.error("게시물 삭제 중 오류가 발생했습니다.");
            console.error(error?.message);
            return;
        }

        setModal(false);
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
                        <Button onClick={handleDelete}>삭제</Button>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default RecordDeleteModal;
