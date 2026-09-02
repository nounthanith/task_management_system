"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    FiBell,
    FiCalendar,
    FiCheck,
    FiChevronRight,
    FiLogOut,
    FiUser,
} from "react-icons/fi";
import Alert from "@/components/ui/Alert";

const weekStarts = ["Monday", "Sunday"];
const densities = ["Comfortable", "Compact"];

type Settings = {
    weekStarts: string;
    showWeekends: boolean;
    density: string;
    emailReminders: boolean;
    notifyDayBefore: boolean;
    notifyOnChange: boolean;
};

const defaults: Settings = {
    weekStarts: "Monday",
    showWeekends: true,
    density: "Comfortable",
    emailReminders: true,
    notifyDayBefore: true,
    notifyOnChange: false,
};

function load(): Settings {
    if (typeof window === "undefined") return defaults;
    try {
        const raw = localStorage.getItem("task-calendar-settings");
        if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch {}
    return defaults;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!on)}
            className={`relative w-12 h-7 rounded-full p-1 transition-colors duration-300 ${
                on ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-neutral-300"
            }`}
            aria-pressed={on}
        >
            <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    on ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}

function Segment({
    options,
    value,
    onChange,
}: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex bg-neutral-100 rounded-xl p-1">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                        value === opt
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-500 hover:text-neutral-800"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}

function Section({
    icon,
    title,
    subtitle,
    accent,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    accent: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl bg-white border border-neutral-200/60 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-6">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${accent}`}>
                    {icon}
                </span>
                <div>
                    <h2 className="font-semibold text-neutral-900">{title}</h2>
                    <p className="text-sm text-neutral-500">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function Row({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-4 border-b border-neutral-100 last:border-0">
            <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800">{label}</p>
                {hint && <p className="text-xs text-neutral-400 mt-0.5">{hint}</p>}
            </div>
            <div className="flex items-center">{children}</div>
        </div>
    );
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<Settings>(() => load());
    const [saved, setSaved] = useState(false);

    const initial = session?.user?.name?.charAt(0).toUpperCase() || "U";

    useEffect(() => {
        if (saved) {
            const t = setTimeout(() => setSaved(false), 2500);
            return () => clearTimeout(t);
        }
    }, [saved]);

    const update = (patch: Partial<Settings>) => {
        setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    };

    const save = () => {
        localStorage.setItem("task-calendar-settings", JSON.stringify(settings));
        setSaved(true);
    };

    const isDefault = JSON.stringify(settings) === JSON.stringify(defaults);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Settings</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Manage your calendar preferences and notifications.
                    </p>
                </div>
                {!isDefault && (
                    <button
                        onClick={() => setSettings(defaults)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                        Reset to defaults
                    </button>
                )}
            </div>

            {saved && (
                <Alert variant="success" title="Settings saved" dismissible onDismiss={() => setSaved(false)}>
                    Your preferences have been updated.
                </Alert>
            )}

            <Section icon={<FiCalendar className="text-lg" />} title="Calendar" subtitle="How your calendar is displayed" accent="from-sky-400 to-blue-500">
                <Row label="Week starts on" hint="Choose the first day of your week">
                    <Segment
                        options={weekStarts}
                        value={settings.weekStarts}
                        onChange={(v) => update({ weekStarts: v })}
                    />
                </Row>
                <Row label="Show weekends" hint="Display Saturday and Sunday in the week view">
                    <Toggle on={settings.showWeekends} onChange={(v) => update({ showWeekends: v })} />
                </Row>
                <Row label="Layout density" hint="How much content fits on screen">
                    <Segment
                        options={densities}
                        value={settings.density}
                        onChange={(v) => update({ density: v })}
                    />
                </Row>
            </Section>

            <Section icon={<FiBell className="text-lg" />} title="Notifications" subtitle="Choose what you want to be reminded about" accent="from-orange-400 to-orange-500">
                <Row label="Email reminders" hint="Get email notifications about your events">
                    <Toggle on={settings.emailReminders} onChange={(v) => update({ emailReminders: v })} />
                </Row>
                <Row label="Day-before reminders" hint="Receive a summary of tomorrow's events">
                    <Toggle on={settings.notifyDayBefore} onChange={(v) => update({ notifyDayBefore: v })} />
                </Row>
                <Row label="Notify on changes" hint="Get notified when events are updated or rescheduled">
                    <Toggle on={settings.notifyOnChange} onChange={(v) => update({ notifyOnChange: v })} />
                </Row>
            </Section>

            <Section icon={<FiUser className="text-lg" />} title="Account" subtitle="Manage your profile and session" accent="from-emerald-400 to-teal-500">
                <Link
                    href="/profile"
                    className="flex items-center justify-between gap-4 py-4 border-b border-neutral-100 hover:bg-neutral-50/60 rounded-lg -mx-2 px-2 transition-colors"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                            {initial}
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-800 truncate">
                                {session?.user?.name || "Account"}
                            </p>
                            <p className="text-xs text-neutral-400 truncate">
                                {session?.user?.email || "user@email.com"}
                            </p>
                        </div>
                    </div>
                    <FiChevronRight className="text-neutral-300 shrink-0" />
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left hover:bg-red-50/60 rounded-lg -mx-2 px-2 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                            <FiLogOut className="text-lg" />
                        </span>
                        <div>
                            <p className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                                Log out
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">End your current session</p>
                        </div>
                    </div>
                    <FiChevronRight className="text-neutral-300 shrink-0 group-hover:text-red-400 transition-colors" />
                </button>
            </Section>

            {/* Save bar */}
            <div className="sticky bottom-24 lg:bottom-6 rounded-2xl bg-white/90 backdrop-blur border border-neutral-200/70 shadow-lg p-3 sm:p-4 flex items-center justify-center">
                <button
                    onClick={save}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-8 sm:px-10 py-3 rounded-xl text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 shadow-md shadow-neutral-900/15 transition-all duration-200 hover:shadow-lg active:scale-[0.98] w-full sm:w-auto"
                >
                    <FiCheck className="text-base" />
                    Save
                </button>
            </div>

            {/* Bottom note */}
            <p className="text-center text-xs text-neutral-400 px-4">
                Changes are saved to this browser.
            </p>
        </div>
    );
}
