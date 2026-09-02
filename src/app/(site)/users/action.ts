import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export interface PublicUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function getUsers(): Promise<PublicUser[]> {
    await connectDB();
    const data = await User.find().select("-password -__v").lean();
    return data as unknown as PublicUser[];
}