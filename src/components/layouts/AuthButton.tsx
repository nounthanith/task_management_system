"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

export default function AuthButton() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === "loading";

    if (isLoading) {
        return <span className="inline-block w-24 h-9 bg-primary/5 rounded-full animate-pulse"></span>;
    }

    if (session) {
        return (
            <div className="flex items-center gap-1.5">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push("/profile")}
                >
                    {session.user?.name?.charAt(0).toUpperCase()}
                </Button>
                <Button
                    size="sm"
                    variant="soft"
                    icon={<HiOutlineArrowRightOnRectangle />}
                    iconPosition="left"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
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
