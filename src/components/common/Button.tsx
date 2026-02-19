import type {ButtonHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    isLoading?: boolean;
}

const Button = ({
    children,
    className,
    variant = "primary",
    size = "md",
    fullWidth = false,
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    // 기본 스타일
    const baseStyles =
        "inline-flex items-center justify-center font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    // 변형(색상) 스타일
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 border border-transparent",
        secondary: "bg-white text-black border border-gray-300 hover:bg-gray-50",
        outline: "bg-transparent text-black border border-black hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
        ghost: "bg-transparent text-gray-500 hover:text-black border-none",
    };

    // 크기 스타일 (Input 컴포넌트 높이와 맞추기 위해 md 기준 h-[54px] 설정)
    const sizes = {
        sm: "h-10 px-4 text-sm",
        md: "h-[54px] px-6 text-base",
        lg: "h-16 px-8 text-lg",
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth ? "w-full" : "",
                className,
            )}
            disabled={disabled || isLoading}
            {...props}>
            {/* 로딩 스피너 */}
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
