"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiOutlineXMark, HiOutlineExclamationTriangle } from "react-icons/hi2";

export type DialogVariant = "danger" | "info";

type DialogProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: DialogVariant;
    loading?: boolean;
    onConfirm?: () => void;
    icon?: ReactNode;
    children?: ReactNode;
};

const variantConfig: Record<DialogVariant, { icon: ReactNode; iconBox: string; confirmClass: string }> = {
    danger: {
        icon: <HiOutlineExclamationTriangle className="text-xl" />,
        iconBox: "bg-red-50 text-red-500",
        confirmClass: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
    },
    info: {
        icon: <HiOutlineExclamationTriangle className="text-xl" />,
        iconBox: "bg-amber-50 text-amber-500",
        confirmClass: "bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/20",
    },
};

export default function Dialog({
    open,
    onClose,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    icon,
    children,
}: DialogProps) {
    const cfg = variantConfig[variant];
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (typeof window === "undefined") return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 ${
                open ? "pointer-events-auto" : "pointer-events-none"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className={`absolute inset-0 bg-primary/40 transition-opacity duration-200 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className={`relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-lift transition-all duration-300 ease-out ${
                    open ? "translate-y-0 opacity-100" : "translate-y-8 sm:translate-y-4 opacity-0"
                }`}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-full text-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
                >
                    <HiOutlineXMark className="text-xl" />
                </button>

                <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                        <span
                            className={`shrink-0 w-12 h-12 rounded-2xl ${cfg.iconBox} flex items-center justify-center`}
                        >
                            {icon ?? cfg.icon}
                        </span>
                        <div className="min-w-0 pt-0.5">
                            <h3 className="text-lg font-semibold text-primary leading-snug">{title}</h3>
                            {description && (
                                <div className="text-sm text-primary/70 mt-1.5 leading-relaxed">{description}</div>
                            )}
                        </div>
                    </div>

                    {children && <div className="mt-5">{children}</div>}

                    <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-medium shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${cfg.confirmClass}`}
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                            )}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}