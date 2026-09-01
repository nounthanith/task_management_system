// models/Otp.ts
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    otp: { type: String, required: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
