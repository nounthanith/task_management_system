"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FiArrowLeft,
    FiEdit3,
    FiTrash2,
    FiClock,
    FiMapPin,
    FiPlus,
} from "react-icons/fi";
import Alert from "@/components/ui/Alert";
import { dateKeyToDate, type CalendarEvent } from "@/lib/calendar";

const colorDot: Record<string, string> = {
    yellow: "bg-amber-400",
    green: "bg-emerald-400",
    blue: "bg-sky-400",
    pink: "bg-pink-400",
    red: "bg-red-400",
    purple: "bg-violet-400",
};

const colorBar: Record<string, string> = {
    yellow: "border-l-amber-400",
    green: "border-l-emerald-400",
    blue: "border-l-sky-400",
    pink: "border-l-pink-400",
    red: "border-l-red-400",
    purple: "border-l-violet-400",
};

export default function CalendarDateView({ date }: { date: string }) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/events?start=${date}&end=${date}`);
                const data = await res.json();
                if (!cancelled) {
                    setEvents(
                        Array.isArray(data.events)
                            ? data.events
                                  .slice()
                                  .sort(
                                      (a: { isAllDay?: boolean; time?: string }, b: { isAllDay?: boolean; time?: string }) =>
                                          (a.isAllDay ? -1 : 0) - (b.isAllDay ? -1 : 0) ||
                                          (a.time || "").localeCompare(b.time || "")
                                  )
                                  .map((e: Record<string, unknown>) => ({
                                      id: String(e._id ?? e.id),
                                      title: String(e.title ?? ""),
                                      date: String(e.date ?? ""),
                                      time: String(e.time ?? ""),
                                      endTime: String(e.endTime ?? ""),
                                      description: String(e.description ?? ""),
                                      isAllDay: Boolean(e.isAllDay),
                                      color: String(e.color ?? "yellow"),
                                      location: String(e.location ?? ""),
                                  }))
                            : []
                    );
                }
            } catch {
                if (!cancelled) setError("Failed to load events for this day.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [date]);

    const handleDelete = async (eventId: string) => {
        if (!confirm("Delete this event?")) return;
        setError("");
        const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
        if (res.ok) {
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
        } else {
            setError("Failed to delete the event.");
        }
    };

    const dayLabel = date
        ? dateKeyToDate(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
          })
        : "";

    const dayNumber = date ? dateKeyToDate(date).getDate() : "";
    const dayOfWeek = date
        ? dateKeyToDate(date).toLocaleDateString("en-US", { weekday: "short" })
        : "";

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link
                href={`/dashboard/calendar?month=${date.slice(0, 7)}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                    <FiArrowLeft className="text-neutral-500" />
                </span>
                Calendar
            </Link>

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5 sm:p-7">
                <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full bg-orange-500/25 blur-3xl pointer-events-none" />
                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xl sm:text-2xl font-bold leading-none">{dayNumber}</span>
                        <span className="text-[10px] sm:text-[11px] font-medium text-white/60 uppercase mt-0.5">
                            {dayOfWeek}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                            {dayLabel || "Loading..."}
                        </h1>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                            {events.length} event{events.length !== 1 ? "s" : ""} scheduled
                        </p>
                    </div>
                    <Link
                        href={`/dashboard/calendar/new?date=${encodeURIComponent(date)}`}
                        className="inline-flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-[0.98] shrink-0"
                        aria-label="New event"
                    >
                        <FiPlus /> <span className="hidden sm:inline">New event</span>
                    </Link>
                </div>
            </div>

            {error && (
                <Alert variant="error" title="Something went wrong" dismissible onDismiss={() => setError("")}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="space-y-3 max-w-3xl">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-white border border-neutral-100 animate-pulse"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-sm p-12 text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                        <FiClock className="text-orange-500 text-xl" />
                    </div>
                    <p className="text-neutral-600 font-medium">No events on this day</p>
                    <p className="text-sm text-neutral-400 mt-1 mb-5">
                        You're fully free. Enjoy the day.
                    </p>
                    <Link
                        href={`/dashboard/calendar/new?date=${encodeURIComponent(date)}`}
                        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                    >
                        <FiPlus /> Add an event
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 max-w-3xl">
                    {events.map((ev) => (
                        <div
                            key={ev.id}
                            className={`bg-white rounded-2xl border border-neutral-200/60 border-l-4 shadow-sm p-5 hover:shadow-md transition-all duration-200 ${
                                colorBar[ev.color ?? "yellow"] ?? "border-l-amber-400"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2.5">
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"}`} />
                                        <h3 className="font-semibold text-neutral-900 truncate">{ev.title}</h3>
                                        {ev.isAllDay && (
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                All day
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 space-y-1.5 text-sm text-neutral-500">
                                        {!ev.isAllDay && (
                                            <p className="flex items-center gap-2">
                                                <FiClock className="text-neutral-300" />
                                                {ev.time}
                                                {ev.endTime ? ` – ${ev.endTime}` : ""}
                                            </p>
                                        )}
                                        {ev.location && (
                                            <p className="flex items-center gap-2">
                                                <FiMapPin className="text-neutral-300" /> {ev.location}
                                            </p>
                                        )}
                                        {ev.description && (
                                            <p className="text-neutral-600 leading-relaxed">{ev.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Link
                                        href={`/dashboard/calendar/new?edit=${ev.id}`}
                                        className="p-2.5 rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition-all duration-200"
                                        aria-label={`Edit ${ev.title}`}
                                    >
                                        <FiEdit3 />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ev.id)}
                                        className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all duration-200"
                                        aria-label={`Delete ${ev.title}`}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
