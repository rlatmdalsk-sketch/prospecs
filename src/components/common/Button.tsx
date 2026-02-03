import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "error" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    isLoading?: boolean;
}

function Button({
    className,
    variant = "primary",
    size = "md",
    fullWidth = false,
    isLoading = false,
    children,
    disabled,
    ...props
}: ButtonProps) {
    // 기본 스타일
    const baseStyle = twMerge(
        ["flex", "justify-center", "items-center"],
        ["font-bold", "border"],
        ["transition-color", "focus:outline-none"],
        ["disabled:opacity-50", "disabled:cursor-not-allowed"],
    );

    // 변형(색상) 스타일
    const variants = {
        primary: twMerge(["bg-black", "text-white", "hover:bg-gray-800", "border-transparent"]),
        secondary: twMerge(["bg-white", "text-black", "border-gray-300", "hover:bg-gray-50"]),
        outline: twMerge(["bg-transparent", "text-black", "border-black", "hover:bg-gray-100"]),
        error: twMerge([
            "bg-red-600",
            "text-white",
            "hover:bg-red-700",
            "border",
            "border-transparent",
        ]),
        ghost: twMerge(["bg-transparent", "text-gray-500", "border-none", "hover:text-black"]),
    };

    // 변형(크기) 스타일
    const sizes = {
        sm: twMerge(["h-10", "px-4", "text-sm"]),
        md: twMerge(["h-[54px]", "px-6", "text-base"]),
        lg: twMerge(["h-16", "px-8", "text-lg"]),
    };

    return (
        <button
            className={twMerge([
                baseStyle,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className,
            ])}
            disabled={disabled || isLoading}
            {...props}
        >
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
}

export default Button;
