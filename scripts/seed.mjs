// Seed: creates an admin user (and optionally a regular user) directly in the DB.
// Loads MONGODB_URI from .env (local). For production, pass --prod.
// Usage:
//   node scripts/seed.mjs [--prod]
import { readFileSync } from "fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admintaskmanager@gmail.com";
const ADMIN_PASSWORD = "admin123123@";
const ADMIN_NAME = "Admin";

const useProd = process.argv.includes("--prod");
const file = useProd ? ".env.production" : ".env";
const uriLine = readFileSync(file, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("MONGODB_URI="));

if (!uriLine) {
    console.error(`No MONGODB_URI found in ${file}`);
    process.exit(1);
}
const MONGODB_URI = uriLine.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");

async function upsertUser(collection, { name, email, password, role }) {
    const existing = await collection.findOne({ email });
    if (existing) {
        await collection.updateOne(
            { email },
            { $set: { name, password, role } }
        );
        console.log(`Updated existing user: ${email} (role: ${role})`);
    } else {
        await collection.insertOne({ name, email, password, role });
        console.log(`Created user: ${email} (role: ${role})`);
    }
}

const run = async () => {
    await mongoose.connect(MONGODB_URI);
    const users = mongoose.connection.db.collection("users");

    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await upsertUser(users, {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: adminHash,
        role: "admin",
    });

    console.log("\nDone. Sign in with:");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  Role:     admin`);

    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});