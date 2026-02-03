import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    fullWidth?: boolean;
    registration?: UseFormRegisterReturn; // register(...)의 반환값 타입
    error?: FieldError;
}

function Input({ label, fullWidth = true, registration, error, className, id, ...props }: InputProps) {
    return (
        <div className={twMerge([fullWidth && "w-full"])}>
            {label && (
                <label htmlFor={id} className={twMerge(["block", "text-xs", "font-bold", "text-gray-500", "mb-1"])}>
                    {label}
                </label>
            )}
            {/* input의 autoComplete 속성 : 자동완성을 막아주도록 함 (근데 안될 때 있음) */}
            <input
                id={id}
                className={twMerge(
                    ["w-full", "p-4"],
                    ["border", "border-gray-300", "text-sm"],
                    ["focus:outline-none", "focus:border-black"],
                    ["transition-all", "placeholder:text-gray-400"],
                    error ? "border-red-500" : "",
                    className,
                )}
                {...registration}
                {...props}
                autoComplete={"off"}
            />
            {error && <p className={twMerge([])}>{error.message}</p>}
        </div>
    );
}

export default Input;
