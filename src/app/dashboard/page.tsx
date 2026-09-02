"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiPlus, FiArrowRight, FiCalendar, FiList, FiClock } from "react-icons/fi";
import TaskCalendar from "@/components/dashboard/TaskCalendar";
import { toDateKey, serializeEvent, type CalendarEvent } from "@/lib/calendar";

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

function StatCard({
    label,
    value,
    icon: Icon,
    from,
    to,
}: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    from: string;
    to: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
            <div
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${from} ${to} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${from} ${to}`}
                    >
                        <Icon className="text-base sm:text-lg" />
                    </span>
                    <div>
                        <p className="text-xs sm:text-sm text-neutral-500">{label}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardOverview() {
    const { data: session } = useSession();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        fetch("/api/events")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data.events)) {
                    setEvents(data.events.map((e: Record<string, unknown>) => serializeEvent(e)));
                }
            })
            .catch(() => {});
    }, []);

    const todayKey = toDateKey(new Date());
    const monthPrefix = todayKey.slice(0, 7);

    const todayEvents = events
        .filter((e) => e.date === todayKey)
        .sort((a, b) => (a.isAllDay ? -1 : 0) - (b.isAllDay ? -1 : 0) || (a.time || "").localeCompare(b.time || ""));

    const upcoming = events
        .filter((e) => e.date >= todayKey)
        .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || ""))
        .slice(0, 5);

    const total = events.length;
    const monthEvents = events.filter((e) => e.date.slice(0, 7) === monthPrefix).length;

    const firstName = session?.user?.name?.split(" ")[0] || "there";
    const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-6">
            {/* Hero header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 sm:p-8">
                <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-orange-500/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full border border-white/5" />
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        <p className="text-sm text-neutral-400 font-medium">{todayDate}</p>
                        <h1 className="text-2xl sm:text-3xl font-bold mt-1.5 tracking-tight">
                            Welcome back, {firstName}
                        </h1>
                        <p className="text-sm text-neutral-400 mt-1.5">
                            You have <span className="text-orange-400 font-semibold">{todayEvents.length}</span> event
                            {todayEvents.length !== 1 ? "s" : ""} today and{" "}
                            <span className="text-white font-semibold">{monthEvents}</span> this month.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <Link
                            href="/dashboard/events"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium border border-white/15 text-white hover:bg-white/10 transition-all duration-200 hover:border-white/25 active:scale-[0.98]"
                        >
                            <FiList />
                            My events
                        </Link>
                        <Link
                            href="/dashboard/calendar/new"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-5 py-3 sm:py-2.5 rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-[0.98]"
                        >
                            <FiPlus />
                            Add event
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 sm:grid-cols-3">
                <StatCard label="Total events" value={total} icon={FiList} from="from-orange-400" to="to-orange-500" />
                <StatCard label="This month" value={monthEvents} icon={FiCalendar} from="from-sky-400" to="to-blue-500" />
                <StatCard label="Today" value={todayEvents.length} icon={FiClock} from="from-emerald-400" to="to-teal-500" />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                {/* Calendar */}
                <div className="xl:col-span-2">
                    <TaskCalendar />
                </div>

                {/* Right column */}
                <div className="space-y-5">
                    {/* Today */}
                    <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400" />
                                <h2 className="font-semibold text-neutral-900">Today's schedule</h2>
                            </div>
                            <span className="text-xs font-medium text-neutral-400">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        {todayEvents.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mx-auto w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                                    <FiCalendar className="text-orange-500 text-xl" />
                                </div>
                                <p className="text-sm text-neutral-500">Nothing scheduled today.</p>
                                <Link
                                    href="/dashboard/calendar/new"
                                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    <FiPlus /> Add an event
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {todayEvents.map((ev) => (
                                    <Link
                                        key={ev.id}
                                        href={`/dashboard/calendar/${ev.date}`}
                                        className={`flex items-center gap-3 p-3 rounded-xl bg-neutral-50/70 border-l-4 hover:bg-neutral-50 transition-all duration-200 hover:shadow-sm ${
                                            colorBar[ev.color ?? "yellow"] ?? "border-l-amber-400"
                                        }`}
                                    >
                                        <span
                                            className={`w-12 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                ev.isAllDay ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 shadow-sm border border-neutral-100"
                                            }`}
                                        >
                                            {ev.isAllDay ? "All day" : (ev.time || "--").slice(0, 5)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-800 truncate flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"}`} />
                                                {ev.title}
                                            </p>
                                            <p className="text-xs text-neutral-400 truncate mt-0.5">{ev.location || "No location"}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming */}
                    <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-sky-400" />
                                <h2 className="font-semibold text-neutral-900">Upcoming</h2>
                            </div>
                            <Link
                                href="/dashboard/events"
                                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                            >
                                View all <FiArrowRight />
                            </Link>
                        </div>
                        {upcoming.length === 0 ? (
                            <p className="text-sm text-neutral-400 py-8 text-center">No upcoming events.</p>
                        ) : (
                            <div className="space-y-2.5">
                                {upcoming.map((ev) => (
                                    <Link
                                        key={ev.id}
                                        href={`/dashboard/calendar/${ev.date}`}
                                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors"
                                    >
                                        <div className="w-10 shrink-0 rounded-lg bg-orange-50 border border-orange-100 text-center py-1.5">
                                            <p className="text-base font-bold text-orange-600 leading-none">
                                                {new Date(ev.date + "T00:00:00").getDate()}
                                            </p>
                                            <p className="text-[10px] font-semibold text-orange-400 uppercase mt-0.5">
                                                {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-neutral-800 truncate flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colorDot[ev.color ?? "yellow"] ?? "bg-amber-400"}`} />
                                                {ev.title}
                                            </p>
                                            <p className="text-xs text-neutral-400 truncate mt-0.5">
                                                {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                                {ev.time ? ` · ${ev.time}` : ev.isAllDay ? " · All day" : ""}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
