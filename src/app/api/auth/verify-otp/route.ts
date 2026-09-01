// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Otp } from "@/models/Otp";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ message: "សូមបញ្ចូលលេខកូដផ្ទៀងផ្ទាត់" }, { status: 400 });
        }

        await connectDB();

        const record = await Otp.findOne({ email });
        if (!record) {
            return NextResponse.json({ message: "លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ ឬផុតកំណត់" }, { status: 400 });
        }

        if (record.expiresAt < new Date()) {
            await Otp.deleteOne({ email });
            return NextResponse.json({ message: "លេខកូដផ្ទៀងផ្ទាត់បានផុតកំណត់" }, { status: 400 });
        }

        if (record.otp !== otp) {
            return NextResponse.json({ message: "លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវ" }, { status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            await Otp.deleteOne({ email });
            return NextResponse.json({ message: "Email នេះត្រូវបានប្រើប្រាស់រួចហើយ" }, { status: 400 });
        }

        const newUser = await User.create({
            name: record.name,
            email: record.email,
            password: record.passwordHash,
        });

        await Otp.deleteOne({ email });

        return NextResponse.json(
            { message: "ចុះឈ្មោះបានជោគជ័យ!", user: { id: newUser._id, name: newUser.name, email: newUser.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Verify OTP Error:", error);
        return NextResponse.json({ message: "មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ" }, { status: 500 });
    }
}
