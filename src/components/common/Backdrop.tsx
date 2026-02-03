import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BackdropProps {
    children: ReactNode;
    onClose?: () => void;
    isTransparent?: boolean;
}

function Backdrop({ children, onClose, isTransparent = false }: BackdropProps) {
    return (
        <div
            className={twMerge(
                ["fixed", "inset-0", "z-50", "flex", "items-center", "justify-center"],
                ["transition-all"],
                isTransparent ? "bg-transparent" : ["bg-black/50", "backdrop-blur-sm"],
            )}
            onClick={onClose}>
            {children}
        </div>
    );
}

export default Backdrop;
