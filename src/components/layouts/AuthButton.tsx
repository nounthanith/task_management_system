"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthButton() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    if (isLoading) {
        return <span className="inline-block w-20 h-8 bg-gray-200 rounded-md animate-pulse"></span>;
    }

    if (session) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/profile"
                    className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold hover:bg-primary-dark transition-colors"
                    title={session.user?.name || "Profile"}
                >
                    {session.user?.name?.charAt(0).toUpperCase()}
                </Link>
                <Button size="sm" variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <Link href="/login">
                <Button size="sm" variant="ghost">
                    Login
                </Button>
            </Link>
            <Link href="/register">
                <Button size="sm" variant="primary">
                    Register
                </Button>
            </Link>
        </div>
    );
}
