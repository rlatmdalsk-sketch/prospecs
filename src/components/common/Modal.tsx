import type { ReactNode } from "react";
import Backdrop from "./Backdrop.tsx";
import { twMerge } from "tailwind-merge";
import { IoClose } from "react-icons/io5";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string;
}

function Modal({ isOpen, onClose, title, children, width = "max-w-md" }: ModalProps) {
    if (!isOpen) return null;

    return (
        <Backdrop onClose={onClose}>
            <div
                className={twMerge(["bg-white", "w-full", "p-8"], width)}
                onClick={e => e.stopPropagation()}>
                <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                    {title ? (
                        <h3 className={twMerge(["text-xl", "font-bold"])}>{title}</h3>
                    ) : (
                        <div />
                    )}
                    <button className={twMerge(["text-gray-400", "text-2xl"])} onClick={onClose}>
                        <IoClose />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </Backdrop>
    );
}

export default Modal;
