"use client";

type Option<T extends string> = { key: T; label: string };

type SegmentedControlProps<T extends string> = {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    flex?: boolean;
    bg?: string;
};

export default function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    className = "",
    flex = false,
    bg = "bg-neutral-100",
}: SegmentedControlProps<T>) {
    return (
        <div className={`flex ${bg} rounded-xl p-1 ${flex ? "flex-1 sm:flex-none" : ""} ${className}`}>
            {options.map((opt) => (
                <button
                    key={opt.key}
                    onClick={() => onChange(opt.key)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        value === opt.key
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-500 hover:text-neutral-800"
                    } ${flex ? "flex-1 sm:flex-none px-4 py-1.5 text-sm" : ""}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}