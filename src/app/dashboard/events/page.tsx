"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight, FiPlus, FiClock, FiMapPin, FiSearch, FiCalendar } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import { dotColor, accentColor } from "@/lib/calendarColors";
import { dateKeyToDate, formatFullDateShort, serializeEvent, type CalendarEvent } from "@/lib/calendar";

export default function EventsPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [dateFilter, setDateFilter] = useState<string>("");

    useEffect(() => {
        fetch("/api/events")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data.events)) {
                    setEvents(data.events.map((e: Record<string, unknown>) => serializeEvent(e)));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = events.filter((ev) => {
        const matchesQuery = !query || ev.title.toLowerCase().includes(query.toLowerCase());
        const matchesDate = !dateFilter || ev.date === dateFilter;
        return matchesQuery && matchesDate;
    });

    const sorted = [...filtered].sort(
        (a, b) => a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || "")
    );
    const grouped: Record<string, CalendarEvent[]> = {};
    for (const ev of sorted) (grouped[ev.date] ??= []).push(ev);

    const total = events.length;
    const past = events.filter((e) => e.date < new Date().toISOString().slice(0, 10)).length;
    const showEmpty = !loading && filtered.length === 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Events</h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        <span className="font-semibold text-neutral-700">{total}</span> total ·{" "}
                        <span className="font-semibold text-neutral-700">{past}</span> in the past
                    </p>
                </div>
                <Link
                    href="/dashboard/calendar/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 shadow-md shadow-neutral-900/15 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                >
                    <FiPlus /> Add event
                </Link>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search events..."
                        className="w-full bg-white border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                    />
                </div>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="sm:w-48 bg-white border border-neutral-200/80 rounded-xl px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all"
                />
                {(query || dateFilter) && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setDateFilter("");
                        }}
                        className="text-sm font-medium text-orange-600 hover:text-orange-700 px-2 py-2.5 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 bg-white border border-neutral-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : showEmpty ? (
                <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-12 text-center">
                    <EmptyState
                        icon={<FiCalendar className="text-2xl" />}
                        title="No events found"
                        subtitle={
                            query || dateFilter
                                ? "Try adjusting your search or filters."
                                : "Create your first event to get started."
                        }
                        action={
                            query || dateFilter ? (
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setDateFilter("");
                                    }}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    Clear filters
                                </button>
                            ) : (
                                <Link
                                    href="/dashboard/calendar/new"
                                    className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                                >
                                    <FiPlus /> Create your first event
                                </Link>
                            )
                        }
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([dateKey, dayEvents]) => (
                        <div key={dateKey}>
                            <Link
                                href={`/dashboard/calendar/${dateKey}`}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 group mb-3"
                            >
                                {formatFullDateShort(dateKeyToDate(dateKey))}
                                <FiArrowRight className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm divide-y divide-neutral-100 overflow-hidden">
                                {dayEvents.map((ev) => (
                                    <Link
                                        key={ev.id}
                                        href={`/dashboard/calendar/${dateKey}`}
                                        className="flex items-start gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                                    >
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                                dotColor(ev.color)
                                            }`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-neutral-900 truncate flex items-center gap-2">
                                                {ev.title}
                                                {ev.isAllDay && (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accentColor(ev.color)}`}>
                                                        All day
                                                    </span>
                                                )}
                                            </p>
                                            {ev.description && (
                                                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{ev.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-medium text-neutral-700 flex items-center justify-end gap-1.5">
                                                {ev.isAllDay ? (
                                                    <span className="text-neutral-400">All day</span>
                                                ) : (
                                                    <>
                                                        <FiClock className="text-neutral-400" />
                                                        {ev.time || "--"}
                                                    </>
                                                )}
                                            </p>
                                            {ev.location && (
                                                <p className="text-xs text-neutral-400 mt-0.5 flex items-center justify-end gap-1">
                                                    <FiMapPin /> {ev.location}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
