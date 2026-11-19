import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import styles from "@/styles/components/modals/RecordDeleteModal.module.scss";
import { toast } from "sonner";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { deleteRecord } from "@/app/records/actions";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    slug: string;
}

const RecordDeleteModal = ({ showModal, setModal, slug }: Props) => {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteRecord(slug);

        if (!result.ok) {
            toast.error(result.error);
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
