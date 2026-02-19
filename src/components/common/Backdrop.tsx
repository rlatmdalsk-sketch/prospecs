import type { ReactNode } from "react";

interface BackdropProps {
    children: ReactNode;
    onClose?: () => void; // 배경 클릭 시 닫기 위한 함수
    isTransparent?: boolean; // 투명 배경 필요 시 (옵션)
}

const Backdrop = ({ children, onClose, isTransparent = false }: BackdropProps) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-colors ${
                isTransparent ? "bg-transparent" : "bg-black/50 backdrop-blur-sm"
            }`}
            onClick={onClose}
        >
            {children}
        </div>
    );
};

export default Backdrop;