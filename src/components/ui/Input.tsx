"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    icon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, icon, className = "", id, ...props },
    ref
) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-primary/70 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/35 text-lg leading-none">
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`w-full bg-white border rounded-full px-5 py-3 text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40 transition-all duration-200 shadow-soft ${
                        icon ? "pl-11" : ""
                    } ${
                        error
                            ? "border-danger/60 focus:border-danger"
                            : "border-primary/10 focus:border-primary/40"
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
        </div>
    );
});
