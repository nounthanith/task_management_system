"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineEnvelope, HiOutlineIdentification, HiOutlineArrowLeft } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading" && !session) {
            router.replace("/login");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) return null;

    const initial = session.user?.name?.charAt(0).toUpperCase() || "?";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
            <div className="w-full max-w-md">
                <div className="absolute top-20 left-8 w-20 h-20 rounded-full bg-accent-blue/40 blur-2xl pointer-events-none" />
                <div className="absolute bottom-16 right-8 w-24 h-24 rounded-full bg-accent-pink/40 blur-2xl pointer-events-none" />

                <div className="card-aesthetic p-8 sm:p-10 relative text-center">
                    {/* Avatar */}
                    <div className="relative mx-auto mb-5 w-24 h-24 rounded-full bg-accent-yellow flex items-center justify-center shadow-soft">
                        <span className="text-4xl font-bold text-primary">{initial}</span>
                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center border-2 border-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-primary">{session.user?.name}</h1>
                    <p className="text-muted text-sm mt-1">{session.user?.email}</p>

                    {/* Info card */}
                    <div className="mt-7 p-5 bg-white border border-primary/10 rounded-3xl text-left space-y-4 shadow-soft">
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-accent-blue flex items-center justify-center shrink-0">
                                <HiOutlineEnvelope className="text-primary" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs text-muted">Email</p>
                                <p className="text-sm font-medium text-primary truncate">{session.user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-accent-green flex items-center justify-center shrink-0">
                                <HiOutlineIdentification className="text-primary" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs text-muted">User ID</p>
                                <p className="text-sm font-medium text-primary truncate">
                                    {(session.user as { id?: string })?.id || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="pink"
                        block
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="mt-6"
                    >
                        Sign Out
                    </Button>

                    <Link
                        href="/"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
                    >
                        <HiOutlineArrowLeft />
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
