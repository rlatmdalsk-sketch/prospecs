import DaumPostcodeEmbed from "react-daum-postcode";
import useModalStore from "../../store/useModalStore";
import Modal from "../common/Modal"; // [New] 공통 모달 래퍼 import

const PostcodeModal = () => {
    // 1. 모달 제어에 필요한 state와 props 가져오기
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { onComplete } = modalProps;

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = "";

        // 주소 정제 로직
        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        // 2. 부모에게 데이터 전달
        if (onComplete) {
            onComplete({
                zipCode: data.zonecode,
                address1: fullAddress, // 범용성을 위해 address로 전달 (받는 쪽에서 address1에 넣음)
            });
        }

        // 3. 모달 닫기
        closeModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="우편번호 검색" // 모달 타이틀 설정
        >
            {/* 다음 우편번호 컴포넌트 영역 */}
            {/* h-[400px]: 모달 내부 높이를 잡아줘야 리스트가 길어질 때 내부 스크롤이 생깁니다 */}
            <div className="h-100 w-full">
                <DaumPostcodeEmbed
                    onComplete={handleComplete}
                    style={{ width: "100%", height: "100%" }}
                    autoClose={false}
                />
            </div>
        </Modal>
    );
};

export default PostcodeModal;
