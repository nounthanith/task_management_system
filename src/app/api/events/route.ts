import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getUserId } from "@/lib/auth";
import { parseMonthKey, toDateKey, monthKeyOf } from "@/lib/calendar";

/**
 * GET /api/events?month=2026-09  -> events for a full month
 * GET /api/events?start=2026-01-01&end=2026-01-31  -> events in a range (inclusive)
 * GET /api/events  -> all events
 */
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = req.nextUrl;
        const month = searchParams.get("month");
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        const filter: Record<string, unknown> = { userId };

        if (month && /^\d{4}-\d{2}$/.test(month)) {
            const { year, month: mIdx } = parseMonthKey(month);
            const first = toDateKey(new Date(year, mIdx, 1));
            const last = toDateKey(new Date(year, mIdx + 1, 0));
            filter.date = { $gte: first, $lte: last };
        } else if (start && end) {
            filter.date = { $gte: start, $lte: end };
        }

        const events = await Event.find(filter).sort({ date: 1, time: 1 }).lean();
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json({ message: "Failed to load events" }, { status: 500 });
    }
}

/** POST /api/events  -> create a new event */
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, date, time, endTime, description, isAllDay, color, location } = body;

        if (!title || !date) {
            return NextResponse.json({ message: "Title and date are required" }, { status: 400 });
        }

        await connectDB();

        const event = await Event.create({
            userId,
            title,
            date,
            time: time || "",
            endTime: endTime || "",
            description: description || "",
            isAllDay: Boolean(isAllDay),
            color: color || "yellow",
            location: location || "",
        });

        return NextResponse.json(
            { event, month: monthKeyOf(new Date(date + "T00:00:00")) },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/events error:", error);
        return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
    }
}
