import type { ReactNode } from "react";

type EmptyStateProps = {
    icon: ReactNode;
    title: string;
    subtitle?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export default function EmptyState({ icon, title, subtitle, action, className = "" }: EmptyStateProps) {
    return (
        <div className={`text-center ${className}`}>
            <div className="mx-auto w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                <span className="text-orange-500 text-2xl leading-none">{icon}</span>
            </div>
            <p className="text-neutral-600 font-medium">{title}</p>
            {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}