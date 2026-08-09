import { Modal, ModalContent, ModalHeader, ModalTitle, ModalWrapper } from "@/components/Modal";
import styles from "@/styles/components/modals/NavigationGuardModal.module.scss";
import Button, { ButtonStyle } from "@/components/Button";

interface Props {
    showModal: boolean;
    setModal: (open: boolean) => void;
    onConfirm: () => void;
}

const NavigationGuardModal = ({ showModal, setModal, onConfirm }: Props) => {
    return (
        <Modal open={showModal} onOpenChange={setModal}>
            <ModalWrapper>
                <ModalHeader>
                    <ModalTitle>페이지 나가기</ModalTitle>
                </ModalHeader>
                <ModalContent>
                    <div className={styles.base}>
                        <p>작성 중인 내용이 있습니다. 지금 나가면 저장되지 않습니다.</p>
                        <div className={styles.actions}>
                            <Button style={ButtonStyle.outline} onClick={() => setModal(false)}>취소</Button>
                            <Button onClick={onConfirm}>나가기</Button>
                        </div>
                    </div>
                </ModalContent>
            </ModalWrapper>
        </Modal>
    );
};

export default NavigationGuardModal;
