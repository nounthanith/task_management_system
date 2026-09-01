// app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // ១. ពិនិត្យមើលលក្ខខណ្ឌទិន្នន័យចូល
        if (!name || !email || !password) {
            return NextResponse.json({ message: "សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password ត្រូវតែមានយ៉ាងតិច ៦ ខ្ទង់" }, { status: 400 });
        }

        // ២. ភ្ជាប់ទៅកាន់ Database
        await connectDB();

        // ៣. ពិនិត្យមើលថាតើមាន Email នេះរួចហើយឬនៅ
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: "Email នេះត្រូវបានប្រើប្រាស់រួចហើយ" }, { status: 400 });
        }

        // ៤. ធ្វើការ Hash password ដើម្បីសុវត្ថិភាព
        const hashedPassword = await bcrypt.hash(password, 10);

        // ៥. បង្កើត User ថ្មីក្នុង Database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "ចុះឈ្មោះបានជោគជ័យ!", user: { id: newUser._id, name: newUser.name, email: newUser.email } }, { status: 201 });

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: "មានបញ្ហាបច្ចេកទេសក្នុងប្រព័ន្ធ" }, { status: 500 });
    }
}
