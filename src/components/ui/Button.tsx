"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    block?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    success: "bg-success hover:bg-success/90 text-white",
    danger: "bg-danger hover:bg-danger/90 text-white",
    outline: "border border-border hover:bg-slate-50 text-foreground",
    ghost: "text-primary hover:bg-primary/10",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-sm font-medium py-1.5 px-3 rounded-md gap-1.5",
    md: "font-semibold py-2.5 px-4 rounded-lg gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = "primary", size = "md", loading = false, block = false, disabled, className = "", children, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${block ? "w-full" : ""} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {loading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}
            {children}
        </button>
    );
});
