// lib/calendar.ts
// Date helpers shared between client and server code.

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO "yyyy-mm-dd"
    time?: string;
    endTime?: string;
    description?: string;
    isAllDay?: boolean;
    color?: string;
    location?: string;
}

/** Format a Date into an ISO date string "yyyy-mm-dd". */
export function toDateKey(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** Parse a "yyyy-mm-dd" key into a local Date at midnight. */
export function dateKeyToDate(key: string): Date {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/** Serialize a raw event object (from API/model) into a plain CalendarEvent. */
export function serializeEvent(raw: Record<string, unknown>): CalendarEvent {
    return {
        id: String(raw._id ?? raw.id ?? ""),
        title: String(raw.title ?? ""),
        date: String(raw.date ?? ""),
        time: String(raw.time ?? ""),
        endTime: String(raw.endTime ?? ""),
        description: String(raw.description ?? ""),
        isAllDay: Boolean(raw.isAllDay),
        color: String(raw.color ?? "yellow"),
        location: String(raw.location ?? ""),
    };
}

export function monthKeyOf(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function parseMonthKey(key: string): { year: number; month: number } {
    const [y, m] = key.split("-").map(Number);
    return { year: y, month: m - 1 };
}
