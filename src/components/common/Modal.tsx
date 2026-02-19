import { IoClose } from "react-icons/io5";
import Backdrop from "./Backdrop";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string; // 너비 커스텀 (예: 'max-w-lg', 'max-w-2xl')
}

const Modal = ({ isOpen, onClose, title, children, width = "max-w-md" }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <Backdrop onClose={onClose}>
            {/* 모달 컨테이너: 클릭 이벤트 전파 방지(e.stopPropagation) 필수 */}
            <div
                className={twMerge(
                    "bg-white w-full p-8 shadow-2xl relative animate-fadeInUp", // 애니메이션 효과 추가 가능
                    width
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 영역 */}
                <div className="flex justify-between items-center mb-6">
                    {title && <h3 className="text-xl font-bold">{title}</h3>}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-black transition-colors text-2xl"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* 컨텐츠 영역 */}
                <div>{children}</div>
            </div>
        </Backdrop>
    );
};

export default Modal;