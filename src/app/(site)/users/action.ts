export interface PublicUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function getUsers(): Promise<PublicUser[]> {
    const baseUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/users`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch users.");
    const data = (await res.json()) as PublicUser[];
    return data;
}