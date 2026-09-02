"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiClock, FiMapPin, FiAlignLeft, FiType } from "react-icons/fi";
import Alert from "@/components/ui/Alert";
import { toDateKey } from "@/lib/calendar";

const colors = ["yellow", "green", "blue", "pink", "red", "purple"];
const colorClass: Record<string, { dot: string; selected: string; ring: string }> = {
    yellow: { dot: "bg-amber-400", selected: "", ring: "ring-amber-400" },
    green: { dot: "bg-emerald-400", selected: "", ring: "ring-emerald-400" },
    blue: { dot: "bg-sky-400", selected: "", ring: "ring-sky-400" },
    pink: { dot: "bg-pink-400", selected: "", ring: "ring-pink-400" },
    red: { dot: "bg-red-400", selected: "", ring: "ring-red-400" },
    purple: { dot: "bg-violet-400", selected: "", ring: "ring-violet-400" },
};

function NewEventForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const prefillDate = searchParams.get("date") ?? toDateKey(new Date());
    const editId = searchParams.get("edit");

    const [isEdit] = useState(Boolean(editId));
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(prefillDate);
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isAllDay, setIsAllDay] = useState(false);
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("yellow");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!editId) return;
        fetch(`/api/events?start=${toDateKey(new Date(0))}&end=${toDateKey(new Date(9999, 0))}`)
            .then((r) => r.json())
            .then((data) => {
                const all: Record<string, unknown>[] = Array.isArray(data.events) ? data.events : [];
                const target = all.find((e) => String(e._id ?? e.id) === editId);
                if (target) {
                    setTitle(String(target.title ?? ""));
                    setDate(String(target.date ?? prefillDate));
                    setTime(String(target.time ?? ""));
                    setEndTime(String(target.endTime ?? ""));
                    setIsAllDay(Boolean(target.isAllDay));
                    setLocation(String(target.location ?? ""));
                    setDescription(String(target.description ?? ""));
                    setColor(String(target.color ?? "yellow"));
                }
            })
            .catch(() => setError("Failed to load event for editing."));
    }, [editId, prefillDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!title.trim() || !date) {
            setError("Please provide a title and a date.");
            return;
        }
        setLoading(true);

        const payload = {
            title: title.trim(),
            date,
            time: isAllDay ? "" : time,
            endTime: isAllDay ? "" : endTime,
            isAllDay,
            location,
            description,
            color,
        };

        try {
            const res = editId
                ? await fetch(`/api/events/${editId}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                  })
                : await fetch("/api/events", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                  });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Something went wrong.");
            }
            router.push(`/dashboard/calendar/${date}?created=1`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all";

    const labelClass = "flex items-center gap-1.5 text-sm font-medium text-neutral-700 mb-1.5";

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link
                href="/dashboard/calendar"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                    <FiArrowLeft className="text-neutral-500" />
                </span>
                Calendar
            </Link>

            <div className="flex items-center justify-between gap-3 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                        {isEdit ? "Edit event" : "New event"}
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        {isEdit
                            ? "Update the details of your event."
                            : "Schedule something new on your calendar."}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        isEdit ? "bg-sky-100 text-sky-700" : "bg-orange-100 text-orange-700"
                    }`}
                >
                    {isEdit ? "Editing" : "New"}
                </span>
            </div>

            {error && (
                <Alert variant="error" title="Something went wrong" dismissible onDismiss={() => setError("")}>
                    {error}
                </Alert>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white border border-neutral-200/60 shadow-sm p-5 sm:p-8 space-y-6"
            >
                {/* Title */}
                <div>
                    <label className={labelClass}>
                        <FiType className="text-neutral-400" /> Title *
                    </label>
                    <input
                        className={inputClass}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Design review"
                        required
                    />
                </div>

                {/* Date + all day */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Date *</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => setIsAllDay(!isAllDay)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                                isAllDay
                                    ? "border-orange-300 bg-orange-50 text-orange-700"
                                    : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                            }`}
                        >
                            <span>All day event</span>
                            <span
                                className={`relative w-9 h-5 rounded-full p-0.5 transition-colors ${
                                    isAllDay ? "bg-orange-500" : "bg-neutral-300"
                                }`}
                            >
                                <span
                                    className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                                        isAllDay ? "translate-x-4" : "translate-x-0"
                                    }`}
                                />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Times */}
                {!isAllDay && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <FiClock className="text-neutral-400" /> Start time
                            </label>
                            <input
                                type="time"
                                className={inputClass}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                <FiClock className="text-neutral-400" /> End time
                            </label>
                            <input
                                type="time"
                                className={inputClass}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Location */}
                <div>
                    <label className={labelClass}>
                        <FiMapPin className="text-neutral-400" /> Location
                    </label>
                    <input
                        className={inputClass}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Meeting room A"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className={labelClass}>
                        <FiAlignLeft className="text-neutral-400" /> Description
                    </label>
                    <textarea
                        className={`${inputClass} min-h-[90px] resize-y`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add more details..."
                    />
                </div>

                {/* Color */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2.5">Color</label>
                    <div className="flex items-center gap-3">
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                aria-label={c}
                                className={`w-9 h-9 rounded-full ${colorClass[c].dot} transition-all duration-200 hover:scale-110 ${
                                    color === c
                                        ? `ring-2 ring-offset-2 ${colorClass[c].ring} scale-110`
                                        : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-neutral-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-6 py-3.5 sm:py-2.5 rounded-xl text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 disabled:opacity-60 shadow-md shadow-neutral-900/10 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                    >
                        {loading
                            ? isEdit
                                ? "Saving..."
                                : "Creating..."
                            : isEdit
                            ? "Save changes"
                            : "Create event"}
                    </button>
                    <Link
                        href="/dashboard/calendar"
                        className="inline-flex items-center justify-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors sm:px-2 py-1 text-center"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function NewEventPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-80 bg-white border border-neutral-200/60 rounded-3xl animate-pulse"></div>
                </div>
            }
        >
            <NewEventForm />
        </Suspense>
    );
}
