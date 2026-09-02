"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiMoreHorizontal,
    FiClock,
} from "react-icons/fi";
import { CalendarEvent, toDateKey, parseMonthKey, serializeEvent } from "@/lib/calendar";
import { useCalendarNav } from "@/components/dashboard/useCalendarNav";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const colorDot: Record<string, string> = {
    yellow: "bg-amber-400",
    green: "bg-emerald-400",
    blue: "bg-sky-400",
    pink: "bg-pink-400",
    red: "bg-red-400",
    purple: "bg-violet-400",
};

const colorBg: Record<string, string> = {
    yellow: "bg-amber-50 border-amber-200",
    green: "bg-emerald-50 border-emerald-200",
    blue: "bg-sky-50 border-sky-200",
    pink: "bg-pink-50 border-pink-200",
    red: "bg-red-50 border-red-200",
    purple: "bg-violet-50 border-violet-200",
};

export default function TaskCalendar({ initialMonth }: { initialMonth?: string }) {
    const today = new Date();
    const todayKey = toDateKey(today);
    const { currentMonth, shiftMonth } = useCalendarNav();

    const activeMonth = initialMonth ?? currentMonth;
    const { year, month } = parseMonthKey(activeMonth);

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setIsTransitioning(true);
        fetch(`/api/events?month=${activeMonth}`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) {
                    setEvents(
                        Array.isArray(data.events)
                            ? data.events.map((e: Record<string, unknown>) => serializeEvent(e))
                            : []
                    );
                    setLoading(false);
                    setTimeout(() => setIsTransitioning(false), 60);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLoading(false);
                    setIsTransitioning(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [activeMonth]);

    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const firstDay = new Date(year, month, 1);
    const lead = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { date: Date; inCurrentMonth: boolean }[] = [];
    for (let i = lead - 1; i >= 0; i--) {
        cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
    }
    const total = cells.length;
    const remainder = (7 - (total % 7)) % 7;
    for (let r = 1; r <= remainder; r++) {
        cells.push({ date: new Date(year, month + 1, r), inCurrentMonth: false });
    }

    const byDate: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
        (byDate[ev.date] ??= []).push(ev);
    }

    const totalEvents = events.length;

    return (
        <div className="calendar-card rounded-3xl bg-white border border-neutral-200/60 shadow-sm p-3 sm:p-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 sm:mb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            {monthLabel}
                        </h2>
                        {totalEvents > 0 && (
                            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                                {totalEvents} event{totalEvents !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-neutral-400 mt-1">
                        {isCurrentMonth
                            ? "Here are your planned events for this month"
                            : "Browse events for this month"}
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 bg-neutral-100 rounded-xl p-1">
                        <button
                            onClick={() => shiftMonth(-1)}
                            aria-label="Previous month"
                            className="p-2 rounded-lg text-neutral-500 hover:bg-white hover:text-neutral-900 hover:shadow-sm transition-all duration-200"
                        >
                            <FiChevronLeft className="text-sm" />
                        </button>
                        {!isCurrentMonth && (
                            <button
                                onClick={() => {
                                    const mk = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
                                    window.location.href = `/dashboard/calendar?month=${mk}`;
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 hover:bg-white hover:shadow-sm transition-all duration-200"
                            >
                                Today
                            </button>
                        )}
                        <button
                            onClick={() => shiftMonth(1)}
                            aria-label="Next month"
                            className="p-2 rounded-lg text-neutral-500 hover:bg-white hover:text-neutral-900 hover:shadow-sm transition-all duration-200"
                        >
                            <FiChevronRight className="text-sm" />
                        </button>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                        <Link
                            href="/dashboard/calendar"
                            className="p-2.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
                            aria-label="Full calendar"
                        >
                            <FiMoreHorizontal />
                        </Link>
                        <Link
                            href="/dashboard/calendar/new"
                            className="calendar-add-btn relative overflow-hidden bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 flex items-center gap-2 shadow-md shadow-neutral-900/10 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                        >
                            <FiPlus className="text-sm" />
                            <span className="hidden sm:inline">Add event</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
                {weekDays.map((day, i) => {
                    const isTodayCol = i === (today.getDay() + 6) % 7;
                    return (
                        <div
                            key={day}
                            className={`text-center text-[10px] sm:text-[11px] font-bold tracking-wider uppercase py-1.5 sm:py-2 rounded-lg ${
                                isTodayCol
                                    ? "text-orange-600 bg-orange-50"
                                    : "text-neutral-400"
                            }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Calendar body */}
            {loading ? (
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="p-2 animate-pulse">
                            <div className="h-7 w-7 rounded-full bg-neutral-100 mx-auto mb-2"></div>
                            <div className="h-7 rounded-lg bg-neutral-100 mb-1"></div>
                            <div className="h-7 rounded-lg bg-neutral-50"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    className={`grid grid-cols-7 gap-1 sm:gap-2 mt-1 calendar-grid ${
                        isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
                    } transition-all duration-300 ease-out`}
                >
                    {cells.map((cell, idx) => {
                        const dateStr = toDateKey(cell.date);
                        const isToday = dateStr === todayKey;
                        const colIndex = idx % 7;
                        const isTodayCol = colIndex === (today.getDay() + 6) % 7;
                        const dayEvents = byDate[dateStr] ?? [];
                        const visible = dayEvents.slice(0, 2);
                        const extra = dayEvents.length - visible.length;

                        return (
                            <div
                                key={idx}
                                className={`flex flex-col rounded-xl p-1 sm:p-2 transition-all duration-200 ${
                                    isTodayCol ? "bg-stone-100/70" : "hover:bg-stone-50"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <Link
                                        href={`/dashboard/calendar/${dateStr}`}
                                        className={`calendar-date-link inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-sm font-bold transition-all duration-200 ${
                                            !cell.inCurrentMonth
                                                ? "text-neutral-300"
                                                : isToday
                                                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                                : isTodayCol
                                                ? "text-orange-600 hover:bg-orange-100"
                                                : "text-neutral-800 hover:bg-neutral-100"
                                        }`}
                                    >
                                        {cell.date.getDate()}
                                    </Link>
                                    {dayEvents.length > 0 && (
                                        <span className="hidden sm:inline-flex text-[10px] font-semibold text-neutral-500 bg-neutral-100 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                            {dayEvents.length}
                                        </span>
                                    )}
                                </div>

                                {/* Mobile: event dots */}
                                <div className="flex items-center justify-center gap-0.5 sm:hidden mt-1 flex-wrap px-0.5">
                                    {dayEvents.length === 0 ? (
                                        <span />
                                    ) : (
                                        dayEvents.slice(0, 4).map((ev) => (
                                            <span
                                                key={ev.id}
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"
                                                }`}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* Desktop: event chips */}
                                <div className="hidden sm:block space-y-1 mt-0.5">
                                    {visible.map((ev) => (
                                        <Link
                                            key={ev.id}
                                            href={`/dashboard/calendar/${dateStr}`}
                                            className={`calendar-event-cell block rounded-lg px-1.5 py-1 border transition-all duration-200 hover:shadow-sm ${
                                                colorBg[ev.color ?? "yellow"] ?? "bg-amber-50 border-amber-200"
                                            }`}
                                        >
                                            <p className="text-[10px] font-semibold text-neutral-800 truncate flex items-center gap-1">
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                        colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"
                                                    }`}
                                                />
                                                {ev.title}
                                            </p>
                                            <p className="text-[9px] text-neutral-400 font-medium truncate flex items-center gap-1 mt-0.5">
                                                {ev.isAllDay ? (
                                                    "All day"
                                                ) : ev.time ? (
                                                    <>
                                                        <FiClock className="inline w-2.5 h-2.5" />
                                                        {ev.time}
                                                    </>
                                                ) : (
                                                    "Event"
                                                )}
                                            </p>
                                        </Link>
                                    ))}
                                    {extra > 0 && (
                                        <Link
                                            href={`/dashboard/calendar/${dateStr}`}
                                            className="block text-center text-[10px] font-semibold text-orange-500 hover:text-orange-700 py-0.5 rounded transition-colors"
                                        >
                                            +{extra} more
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
