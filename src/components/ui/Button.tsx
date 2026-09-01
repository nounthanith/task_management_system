"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "soft" | "outline" | "ghost" | "yellow" | "pink" | "mint" | "sky";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    block?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
};

const base =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed font-medium whitespace-nowrap";

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary/90 shadow-soft",
    soft: "bg-primary/5 text-primary hover:bg-primary/10",
    outline: "border border-primary/10 bg-white text-primary hover:border-primary/30 hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
    yellow: "bg-accent-yellow text-primary hover:brightness-[0.97] shadow-soft",
    pink: "bg-accent-pink text-primary hover:brightness-[0.97] shadow-soft",
    mint: "bg-accent-green text-primary hover:brightness-[0.97] shadow-soft",
    sky: "bg-accent-blue text-primary hover:brightness-[0.97] shadow-soft",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-sm py-1.5 px-4 gap-1.5",
    md: "text-base py-2.5 px-6 gap-2",
    lg: "text-lg py-3 px-8 gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = "primary",
        size = "md",
        loading = false,
        block = false,
        icon,
        iconPosition = "right",
        disabled,
        className = "",
        children,
        ...props
    },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${base} ${block ? "w-full" : ""} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {loading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}
            {!loading && iconPosition === "left" && icon}
            {children}
            {!loading && iconPosition === "right" && icon}
        </button>
    );
});
