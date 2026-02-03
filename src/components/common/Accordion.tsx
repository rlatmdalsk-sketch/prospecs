import { type ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FiChevronDown } from "react-icons/fi";

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

function Accordion({ title, children, defaultOpen = false, className = "" }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={twMerge(["w-full", "border-t", "border-gray-300"], className)}>
            <button
                type={"button"}
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    ["w-full", "flex", "justify-between", "items-center", "py-5"],
                    ["hover:opacity-70", "transition-all"],
                )}>
                <h3 className={twMerge(["text-sm", "font-bold", "text-gray-900"])}>{title}</h3>
                <FiChevronDown
                    className={twMerge(
                        ["w-6", "h-6", "transition-transform", "duration-300"],
                        isOpen && "rotate-180",
                    )}
                />
            </button>

            <div
                className={twMerge(
                    ["overflow-hidden", "transition-all", "duration-800"],
                    isOpen ? "max-h-250" : "max-h-0",
                )}>
                <div className={twMerge(["pb-10", "pt-2", "text-sm", "text-gray-600"])}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Accordion;
