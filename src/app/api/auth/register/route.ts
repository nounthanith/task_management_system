// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Otp } from "@/models/Otp";
import bcrypt from "bcryptjs";
import { sendEmail, otpEmailTemplate } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password ត្រូវតែមានយ៉ាងតិច ៦ ខ្ទង់" }, { status: 400 });
        }

        await connectDB();

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "Email នេះត្រូវបានប្រើប្រាស់រួចហើយ" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.findOneAndUpdate(
            { email },
            { email, otp, name, passwordHash: hashedPassword, expiresAt },
            { upsert: true, new: true }
        );

        await sendEmail(email, "Your verification code", otpEmailTemplate(otp));

        return NextResponse.json(
            { message: "សូមពិនិត្យមើលអ៊ីមែលរបស់អ្នកសម្រាប់លេខកូដផ្ទៀងផ្ទាត់" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ" }, { status: 500 });
    }
}
