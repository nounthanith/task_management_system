"use client";

import { useState, type ReactNode } from "react";
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineInformationCircle,
    HiOutlineXMark,
} from "react-icons/hi2";

export type AlertVariant = "success" | "error" | "info" | "warning";

type AlertProps = {
    variant?: AlertVariant;
    title?: string;
    children?: ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
};

const variantConfig: Record<AlertVariant, { icon: ReactNode; box: string; iconBox: string; title: string }> = {
    success: {
        icon: <HiOutlineCheckCircle />,
        box: "bg-accent-green/50 border-primary/10",
        iconBox: "bg-accent-green",
        title: "text-primary",
    },
    error: {
        icon: <HiOutlineExclamationCircle />,
        box: "bg-danger/10 border-danger/30",
        iconBox: "bg-danger/80",
        title: "text-danger",
    },
    info: {
        icon: <HiOutlineInformationCircle />,
        box: "bg-accent-blue/50 border-primary/10",
        iconBox: "bg-accent-blue",
        title: "text-primary",
    },
    warning: {
        icon: <HiOutlineExclamationCircle />,
        box: "bg-accent-yellow/60 border-primary/10",
        iconBox: "bg-accent-yellow",
        title: "text-primary",
    },
};

export default function Alert({ variant = "info", title, children, dismissible, onDismiss, className = "" }: AlertProps) {
    const [hidden, setHidden] = useState(false);
    const cfg = variantConfig[variant];

    if (hidden) return null;

    return (
        <div
            role="alert"
            className={`relative flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-soft ${cfg.box} ${className}`}
        >
            <span
                className={`shrink-0 w-8 h-8 rounded-full ${cfg.iconBox} flex items-center justify-center text-primary`}
            >
                <span className="text-lg leading-none">{cfg.icon}</span>
            </span>
            <div className="min-w-0 flex-1">
                {title && <p className={`text-sm font-semibold ${cfg.title} mb-0.5`}>{title}</p>}
                {children && <div className={`text-sm ${title ? "text-primary/70" : "text-primary"}`}>{children}</div>}
            </div>
            {dismissible && (
                <button
                    type="button"
                    onClick={() => {
                        setHidden(true);
                        onDismiss?.();
                    }}
                    aria-label="Dismiss"
                    className="shrink-0 text-primary/40 hover:text-primary transition-colors"
                >
                    <HiOutlineXMark className="text-lg" />
                </button>
            )}
        </div>
    );
}
