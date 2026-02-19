import { type ReactNode, useState } from "react";
import {FiChevronDown} from "react-icons/fi";

interface AccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

const Accordion = ({ title, children, defaultOpen = false, className = "" }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`border-t border-gray-300 ${className}`}>
            {/* 헤더 (클릭 영역) */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full justify-between items-center py-5 text-left hover:opacity-70 transition-opacity"
            >
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>

                {/* 화살표 아이콘 */}
                <FiChevronDown
                    className={`w-6 h-6 transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* 본문 (애니메이션) */}
            <div
                className={`overflow-hidden transition-all duration-800 ${
                    isOpen ? "max-h-250" : "max-h-0"
                }`}
            >
                <div className="overflow-hidden">
                    {/* 내용물 패딩 */}
                    <div className="pb-10 pt-2 text-sm text-gray-600">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;