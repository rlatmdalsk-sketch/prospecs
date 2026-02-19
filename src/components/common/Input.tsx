import { twMerge } from "tailwind-merge";
import type { InputHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string; // [추가] 라벨 텍스트
    fullWidth?: boolean;
    registration: UseFormRegisterReturn;
    error?: FieldError;
}

const Input = ({
    label,
    fullWidth,
    className,
    registration,
    error,
    id, // 외부에서 id를 넘겨줄 수도 있음
    ...props
}: InputProps) => {
    // id가 없으면 hook-form의 name(registration.name)을 id로 사용
    // 이렇게 하면 label 클릭 시 input에 포커스가 자동으로 잡힙니다.
    const inputId = id || registration.name;

    return (
        <div className={twMerge(fullWidth ? "w-full" : "w-full")}>
            {/* 라벨이 있을 경우에만 렌더링 */}
            {label && (
                <label htmlFor={inputId} className="block text-xs font-bold text-gray-500 mb-1">
                    {label}
                </label>
            )}

            <input
                id={inputId}
                className={twMerge(
                    "w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-400",
                    error ? "border-red-500 focus:border-red-500" : "",
                    className,
                )}
                autoComplete="off"
                {...registration}
                {...props}
            />

            {error && <p className="text-red-600 text-xs mt-1 pl-1">{error.message}</p>}
        </div>
    );
};

export default Input;
