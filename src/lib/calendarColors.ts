export const EVENT_COLORS = ["yellow", "green", "blue", "pink", "red", "purple"] as const;

export type EventColor = (typeof EVENT_COLORS)[number];

export const colorDot: Record<string, string> = {
    yellow: "bg-amber-400",
    green: "bg-emerald-400",
    blue: "bg-sky-400",
    pink: "bg-pink-400",
    red: "bg-red-400",
    purple: "bg-violet-400",
};

export const colorBar: Record<string, string> = {
    yellow: "border-l-amber-400",
    green: "border-l-emerald-400",
    blue: "border-l-sky-400",
    pink: "border-l-pink-400",
    red: "border-l-red-400",
    purple: "border-l-violet-400",
};

export const colorAccent: Record<string, string> = {
    yellow: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
    pink: "bg-pink-50 text-pink-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-violet-50 text-violet-700",
};

export const colorBg: Record<string, string> = {
    yellow: "bg-amber-50 border-amber-200",
    green: "bg-emerald-50 border-emerald-200",
    blue: "bg-sky-50 border-sky-200",
    pink: "bg-pink-50 border-pink-200",
    red: "bg-red-50 border-red-200",
    purple: "bg-violet-50 border-violet-200",
};

export const colorRing: Record<string, string> = {
    yellow: "ring-amber-400",
    green: "ring-emerald-400",
    blue: "ring-sky-400",
    pink: "ring-pink-400",
    red: "ring-red-400",
    purple: "ring-violet-400",
};

export function dotColor(color?: string): string {
    return colorDot[color ?? "yellow"] ?? "bg-amber-400";
}

export function barColor(color?: string): string {
    return colorBar[color ?? "yellow"] ?? "border-l-amber-400";
}

export function accentColor(color?: string): string {
    return colorAccent[color ?? "yellow"] ?? "bg-amber-50 text-amber-700";
}

export function bgColor(color?: string): string {
    return colorBg[color ?? "yellow"] ?? "bg-amber-50 border-amber-200";
}