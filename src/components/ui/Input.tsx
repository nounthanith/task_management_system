"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, className = "", id, ...props },
    ref
) {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={`w-full px-4 py-2.5 bg-background/5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition ${
                    error
                        ? "border-danger focus:ring-danger focus:border-danger"
                        : "border-border"
                } ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
});
