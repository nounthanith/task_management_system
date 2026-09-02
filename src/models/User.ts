// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Remove "required: true" so Google users can be created without a password
    password: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
