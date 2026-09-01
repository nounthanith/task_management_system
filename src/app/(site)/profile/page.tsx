"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineEnvelope,
    HiOutlineIdentification,
    HiOutlineCalendarDays,
    HiOutlineGlobeAlt,
    HiOutlineChevronRight,
    HiOutlineArrowLeft,
} from "react-icons/hi2";
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
    const id = (session.user as { id?: string })?.id;

    return (
        <div className="flex justify-center px-4 sm:px-6 pt-28 pb-14">
            <div className="w-full max-w-4xl">
                {/* Back link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
                >
                    <HiOutlineArrowLeft />
                    Back to dashboard
                </Link>

                {/* Header card */}
                <div className="card-aesthetic relative overflow-hidden p-8 sm:p-10 mb-6">
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent-blue/30 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-accent-pink/30 blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="relative shrink-0 w-24 h-24 rounded-full bg-accent-yellow flex items-center justify-center shadow-soft">
                            <span className="text-4xl font-bold text-primary">{initial}</span>
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center border-2 border-white">
                                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-bold tracking-tight text-primary">
                                {session.user?.name}
                            </h1>
                            <p className="text-muted mt-1">{session.user?.email}</p>
                            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-accent-green/60 text-primary text-xs font-medium">
                                <HiOutlineGlobeAlt />
                                Member
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/settings")}
                            icon={<HiOutlineChevronRight />}
                        >
                            Edit profile
                        </Button>
                    </div>
                </div>

                {/* Info + details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Account info */}
                    <div className="card-aesthetic p-6 sm:p-7 md:col-span-2">
                        <h2 className="text-lg font-semibold text-primary mb-5">Account details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-white border border-primary/10 rounded-2xl shadow-soft">
                                <span className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center shrink-0">
                                    <HiOutlineEnvelope className="text-primary text-lg" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted">Email address</p>
                                    <p className="text-sm font-medium text-primary truncate">
                                        {session.user?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white border border-primary/10 rounded-2xl shadow-soft">
                                <span className="w-10 h-10 rounded-xl bg-accent-green flex items-center justify-center shrink-0">
                                    <HiOutlineIdentification className="text-primary text-lg" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted">User ID</p>
                                    <p className="text-sm font-medium text-primary truncate">
                                        {id ? `#${id}` : "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white border border-primary/10 rounded-2xl shadow-soft">
                                <span className="w-10 h-10 rounded-xl bg-accent-pink flex items-center justify-center shrink-0">
                                    <HiOutlineCalendarDays className="text-primary text-lg" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted">Joined</p>
                                    <p className="text-sm font-medium text-primary">
                                        {new Date().toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="card-aesthetic p-6 sm:p-7 h-fit">
                        <h2 className="text-lg font-semibold text-primary mb-3">Quick actions</h2>
                        <p className="text-sm text-muted mb-5">
                            Manage your calendar and stay on top of your events.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/calendar"
                                className="flex items-center justify-between p-4 bg-accent-blue/50 border border-primary/10 rounded-2xl hover:shadow-soft transition-shadow"
                            >
                                <span className="text-sm font-medium text-primary">My calendar</span>
                                <HiOutlineChevronRight className="text-muted" />
                            </Link>
                            <Link
                                href="/dashboard/events"
                                className="flex items-center justify-between p-4 bg-accent-green/50 border border-primary/10 rounded-2xl hover:shadow-soft transition-shadow"
                            >
                                <span className="text-sm font-medium text-primary">My events</span>
                                <HiOutlineChevronRight className="text-muted" />
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center justify-between p-4 bg-accent-pink/50 border border-primary/10 rounded-2xl hover:shadow-soft transition-shadow"
                            >
                                <span className="text-sm font-medium text-primary">Settings</span>
                                <HiOutlineChevronRight className="text-muted" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sign out */}
                <Button
                    variant="pink"
                    className="mt-6 w-full sm:w-auto"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
