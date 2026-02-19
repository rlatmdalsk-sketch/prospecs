import useModalStore from "../../store/useModalStore";
import Modal from "../common/Modal";
import Button from "../common/Button";

const ConfirmModal = () => {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { title, message, onConfirm, isDanger = false } = modalProps;

    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm(); // 전달받은 비동기 함수 실행
        }
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={title || "확인"}>
            <div className="py-2">
                <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
            </div>
            <div className="flex gap-2 justify-end mt-6">
                <Button variant="secondary" size="sm" onClick={closeModal}>
                    취소
                </Button>
                <Button
                    variant={isDanger ? "danger" : "primary"}
                    size="sm"
                    onClick={handleConfirm}
                >
                    확인
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;