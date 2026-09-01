"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiPlus, FiMapPin, FiClock } from "react-icons/fi";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import { useCalendarNav } from "@/components/dashboard/useCalendarNav";
import { toDateKey, dateKeyToDate, parseMonthKey, serializeEvent, type CalendarEvent } from "@/lib/calendar";

type ViewMode = "month" | "week" | "day";

const colorBar: Record<string, string> = {
    yellow: "border-l-amber-400",
    green: "border-l-emerald-400",
    blue: "border-l-sky-400",
    pink: "border-l-pink-400",
    red: "border-l-red-400",
    purple: "border-l-violet-400",
};

const colorDot: Record<string, string> = {
    yellow: "bg-amber-400",
    green: "bg-emerald-400",
    blue: "bg-sky-400",
    pink: "bg-pink-400",
    red: "bg-red-400",
    purple: "bg-violet-400",
};

const viewOptions: { key: ViewMode; label: string }[] = [
    { key: "month", label: "Month" },
    { key: "week", label: "Week" },
    { key: "day", label: "Day" },
];

export default function CalendarPage() {
    const searchParams = useSearchParams();
    const view = (searchParams.get("view") as ViewMode) || "month";
    const { currentMonth, setView, shiftMonth, goToDate } = useCalendarNav();

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        fetch(`/api/events?month=${currentMonth}`)
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data.events)) {
                    setEvents(data.events.map((e: Record<string, unknown>) => serializeEvent(e)));
                }
            })
            .catch(() => {});
    }, [currentMonth]);

    const { year, month } = parseMonthKey(currentMonth);
    const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const today = new Date();
    const todayKey = toDateKey(today);

    const range: Date[] = [];
    if (view === "day") {
        range.push(today);
    } else if (view === "week") {
        const dow = (today.getDay() + 6) % 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - dow);
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            range.push(d);
        }
    }

    const byDate: Record<string, CalendarEvent[]> = {};
    for (const ev of events) (byDate[ev.date] ??= []).push(ev);

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{monthLabel}</h1>
                    <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => shiftMonth(-1)}
                            aria-label="Previous month"
                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                            <FiChevronLeft />
                        </button>
                        <span className="px-1 text-xs text-neutral-300">·</span>
                        <button
                            onClick={() => shiftMonth(1)}
                            aria-label="Next month"
                            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-neutral-200/70 rounded-xl p-1">
                        {viewOptions.map((opt) => (
                            <button
                                key={opt.key}
                                onClick={() => setView(opt.key)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    view === opt.key
                                        ? "bg-white text-neutral-900 shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-800"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <Link
                        href="/dashboard/calendar/new"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-5 py-2 rounded-xl text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 shadow-md shadow-neutral-900/15 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                    >
                        <FiPlus /> Add event
                    </Link>
                </div>
            </div>

            {view === "month" && <TaskCalendar initialMonth={currentMonth} />}

            {view === "week" && (
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm">
                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                        {range.map((d) => {
                            const key = toDateKey(d);
                            const dayEvents = byDate[key] ?? [];
                            const isToday = key === todayKey;
                            return (
                                <div
                                    key={key}
                                    className={`rounded-xl p-2 sm:p-3 ${
                                        isToday ? "bg-orange-50/70 ring-1 ring-orange-200" : "bg-neutral-50"
                                    }`}
                                >
                                    <button
                                        onClick={() => goToDate(key)}
                                        className={`w-full text-center mb-2 ${
                                            isToday ? "text-orange-600" : "text-neutral-500"
                                        }`}
                                    >
                                        <span className="block text-[10px] font-semibold uppercase tracking-wide opacity-70">
                                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                                        </span>
                                        <span
                                            className={`inline-flex mt-0.5 w-8 h-8 items-center justify-center rounded-full text-sm font-bold ${
                                                isToday ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "text-neutral-700"
                                            }`}
                                        >
                                            {d.getDate()}
                                        </span>
                                    </button>
                                    <div className="space-y-1.5 mt-1">
                                        {dayEvents.length === 0 && (
                                            <div className="h-9 rounded-lg bg-white/70 border border-dashed border-neutral-200"></div>
                                        )}
                                        {dayEvents.slice(0, 3).map((ev) => (
                                            <Link
                                                key={ev.id}
                                                href={`/dashboard/calendar/${key}`}
                                                className={`block bg-white border border-neutral-200 border-l-4 rounded-lg px-2 py-1.5 shadow-sm hover:shadow hover:border-neutral-300 transition-all duration-200 ${
                                                    colorBar[ev.color ?? "yellow"] ?? "border-l-amber-400"
                                                }`}
                                            >
                                                <p className="text-[11px] font-bold text-neutral-800 truncate">
                                                    {ev.title}
                                                </p>
                                                <p className="text-[10px] text-neutral-400 font-medium">
                                                    {ev.isAllDay ? "All day" : ev.time}
                                                </p>
                                            </Link>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <Link
                                                href={`/dashboard/calendar/${key}`}
                                                className="block text-center text-[10px] font-semibold text-orange-500 hover:text-orange-700 py-0.5 rounded transition-colors"
                                            >
                                                +{dayEvents.length - 3} more
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === "day" && (
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/60 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                        <h2 className="font-semibold text-neutral-900 text-lg">
                            {dateKeyToDate(todayKey).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </h2>
                        <Link
                            href={`/dashboard/calendar/new?date=${encodeURIComponent(todayKey)}`}
                            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                        >
                            <FiPlus /> Add event
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {(byDate[todayKey] ?? []).length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                                    <FiClock className="text-orange-500 text-xl" />
                                </div>
                                <p className="text-neutral-600 font-medium">No events today</p>
                                <p className="text-sm text-neutral-400 mt-1">
                                    You're all clear for today.
                                </p>
                            </div>
                        ) : (
                            (byDate[todayKey] ?? [])
                                .slice()
                                .sort(
                                    (a, b) =>
                                        (a.isAllDay ? -1 : 0) - (b.isAllDay ? -1 : 0) ||
                                        (a.time || "").localeCompare(b.time || "")
                                )
                                .map((ev) => (
                                    <Link
                                        key={ev.id}
                                        href={`/dashboard/calendar/${todayKey}`}
                                        className={`flex items-start gap-4 p-4 border bg-white border-neutral-200 border-l-4 rounded-xl hover:shadow-md transition-all duration-200 ${
                                            colorBar[ev.color ?? "yellow"] ?? "border-l-amber-400"
                                        }`}
                                    >
                                        <span className="text-sm font-semibold text-neutral-700 w-20 shrink-0 pt-0.5">
                                            {ev.isAllDay ? "All day" : ev.time || "--"}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"}`} />
                                                {ev.title}
                                            </p>
                                            {ev.location && (
                                                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                                                    <FiMapPin className="text-neutral-300" /> {ev.location}
                                                </p>
                                            )}
                                            {ev.description && (
                                                <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">
                                                    {ev.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
