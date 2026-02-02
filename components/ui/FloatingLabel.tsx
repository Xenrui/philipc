import React from 'react';

interface FloatingLabelInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
    maxLength?: number;
    autoComplete?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    maxLength,
    autoComplete,
}) => {
    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
                maxLength={maxLength}
                autoComplete={autoComplete}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className="peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm transition-colors hover:cursor-text focus:border-blue-600 focus:ring-0 focus:outline-none"
            />
            <label
                htmlFor={id}
                className="absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm text-gray-600 duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-600 hover:cursor-text"
            >
                {label}
            </label>
            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1 text-xs text-red-600"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};
