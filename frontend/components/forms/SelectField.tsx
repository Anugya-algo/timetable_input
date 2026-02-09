import React from 'react';

interface Option {
    id: string | number;
    label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
    isLoading?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    options,
    error,
    isLoading,
    className = "",
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <select
                className={`border p-2 rounded-md focus:ring-2 focus:ring-blue-500 bg-white ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                <option value="">{isLoading ? "Loading..." : "Select an option"}</option>
                {!isLoading && options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};
