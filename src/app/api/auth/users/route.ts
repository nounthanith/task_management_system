import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json(
            { message: "Forbidden. Admin access required." },
            { status: 403 }
        );
    }

    try {
        await connectDB();
        const data = await User.find()
            .select("-password -__v")
            .lean();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { message: err instanceof Error ? err.message : "Failed to fetch users." },
            { status: 500 }
        );
    }
}