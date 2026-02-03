import useModalStore from "../../stores/useModalStore.ts";
import PostcodeModal from "./PostcodeModal.tsx";
import PaymentModal from "./PaymentModal.tsx";
import ReviewModal from "./ReviewModal.tsx";

const MODAL_COMPONENT = {
    POSTCODE: PostcodeModal,
    PAYMENT: PaymentModal,
    REVIEW_FORM: ReviewModal,
}

function GlobalModal() {
    const { modalType, isOpen } = useModalStore();

    if (!isOpen || !modalType) return null

    const SpecificModal = MODAL_COMPONENT[modalType];

    return <SpecificModal />;
}

export default GlobalModal;
