// models/Event.ts
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        title: { type: String, required: true, trim: true },
        date: { type: String, required: true, trim: true }, // ISO "yyyy-mm-dd"
        time: { type: String, default: "" },
        endTime: { type: String, default: "" },
        description: { type: String, default: "" },
        isAllDay: { type: Boolean, default: false },
        color: { type: String, default: "yellow" },
        location: { type: String, default: "" },
    },
    { timestamps: true }
);

EventSchema.index({ userId: 1, date: 1 });

export const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
