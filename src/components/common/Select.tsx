import type { SelectHTMLAttributes } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    registration: UseFormRegisterReturn;
    error?: FieldError;
    options: Option[];
}

function Select({ registration, error, options, className, ...props }: SelectProps) {
    return (
        <div className={"w-full"}>
            <select
                className={twMerge(
                    ["w-full", "p-4"],
                    ["border", "border-gray-300", "text-sm"],
                    ["focus:outline-none", "focus:border-black"],
                    ["transition-all", "placeholder:text-gray-400"],
                    error ? "border-red-500" : "",
                    className,
                )}
                {...registration}
                {...props}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className={twMerge(["text-red-600", "text-xs", "mt-1"])}>{error.message}</p>
            )}
        </div>
    );
}

export default Select;
