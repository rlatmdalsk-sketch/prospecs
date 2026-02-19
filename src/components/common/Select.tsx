import { twMerge } from "tailwind-merge";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { SelectHTMLAttributes } from "react";

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: Option[];
    registration: UseFormRegisterReturn;
    error?: FieldError;
}

const Select = ({ className, options, registration, error, ...props }: SelectProps) => {
    return (
        <div className="w-full">
            <select
                className={twMerge(
                    "w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-black transition-colors appearance-none bg-white",
                    error ? "border-red-500 focus:border-red-500" : "",
                    className,
                )}
                {...registration}
                {...props}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-600 text-xs mt-1 pl-1">{error.message}</p>}
        </div>
    );
};

export default Select;
