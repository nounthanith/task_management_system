// Script: promote a user to admin (or demote back to user).
// Loads MONGODB_URI from .env (local). For production, pass --prod.
// Usage:
//   node scripts/set-admin.mjs you@email.com [admin|user] [--prod]
import { readFileSync } from "fs";
import mongoose from "mongoose";

const email = process.argv[2];
const role =
    process.argv.find((a) => a === "admin" || a === "user") || "admin";
const useProd = process.argv.includes("--prod");

if (!email) {
    console.error("Usage: node scripts/set-admin.mjs <email> [admin|user] [--prod]");
    process.exit(1);
}

// Load the appropriate env file without a dotenv dependency.
const file = useProd ? ".env.production" : ".env";
const uriLine = readFileSync(file, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("MONGODB_URI="));

if (!uriLine) {
    console.error(`No MONGODB_URI found in ${file}`);
    process.exit(1);
}
const MONGODB_URI = uriLine.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");

const run = async () => {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.connection.db.collection("users");
    const result = await User.updateOne({ email }, { $set: { role } });
    if (result.matchedCount === 0) {
        console.log(`No user found with email "${email}".`);
    } else {
        console.log(`Set role "${role}" for ${email} (${result.modifiedCount} modified).`);
    }
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});