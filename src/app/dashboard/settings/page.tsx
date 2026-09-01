"use client";

import { useEffect, useState } from "react";
import { FiBell, FiCalendar, FiCheck, FiChevronRight, FiSun, FiShield } from "react-icons/fi";
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
        <div className="flex items-center justify-between gap-4 py-4 border-b border-neutral-100 last:border-0">
            <div className="pr-4">
                <p className="text-sm font-medium text-neutral-800">{label}</p>
                {hint && <p className="text-xs text-neutral-400 mt-0.5">{hint}</p>}
            </div>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>(() => load());
    const [saved, setSaved] = useState(false);

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

            {/* Save bar */}
            <div className="sticky bottom-24 lg:bottom-6 rounded-2xl bg-white/90 backdrop-blur border border-neutral-200/70 shadow-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <FiChevronRight className="text-neutral-300" />
                    Changes are saved to this browser
                </div>
                <button
                    onClick={save}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 shadow-md shadow-neutral-900/15 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                >
                    <FiCheck className="text-base" />
                    Save settings
                </button>
            </div>
        </div>
    );
}
