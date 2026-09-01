"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    success: "bg-success hover:bg-success/90 text-white",
    danger: "bg-danger hover:bg-danger/90 text-white",
    outline:
        "border border-border hover:bg-slate-50 text-foreground",
    ghost: "text-primary hover:bg-primary/10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = "primary", loading = false, disabled, className = "", children, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}
            {children}
        </button>
    );
});
