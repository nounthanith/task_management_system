import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { getUserId } from "@/lib/auth";
import { isValidObjectId } from "mongoose";

async function findOwnEvent(id: string, userId: string) {
    if (!isValidObjectId(id)) return null;
    const event = await Event.findOne({ _id: id, userId });
    return event;
}

/** PATCH /api/events/[id]  -> update an event */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const event = await findOwnEvent(id, userId);
        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        const body = await req.json();
        const allowed = ["title", "date", "time", "endTime", "description", "isAllDay", "color", "location"];
        const updates: Record<string, unknown> = {};
        for (const key of allowed) {
            if (key in body) updates[key] = body[key];
        }

        const updated = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();
        return NextResponse.json({ event: updated }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/events error:", error);
        return NextResponse.json({ message: "Failed to update event" }, { status: 500 });
    }
}

/** DELETE /api/events/[id]  -> delete an event */
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const event = await findOwnEvent(id, userId);
        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        await Event.findByIdAndDelete(id);
        return NextResponse.json({ message: "Event deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/events error:", error);
        return NextResponse.json({ message: "Failed to delete event" }, { status: 500 });
    }
}
