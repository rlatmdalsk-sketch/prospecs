import useModalStore from "../../stores/useModalStore.ts";
import DaumPostcodeEmbed from "react-daum-postcode";
import Modal from "../common/Modal.tsx";

function PostcodeModal() {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { onComplete } = modalProps;

    const handleComplete = data => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        if (onComplete) {
            onComplete({
                zipCode: data.zonecode,
                address1: fullAddress,
            });
        }

        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={"우편번호 검색"}>
            <DaumPostcodeEmbed onComplete={handleComplete} />
        </Modal>
    );
}

export default PostcodeModal;
