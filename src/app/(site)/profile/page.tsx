"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md p-8 bg-surface rounded-2xl shadow-card border border-border text-center">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                    {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold mb-1">{session.user?.name}</h2>
                <p className="text-muted mb-6">{session.user?.email}</p>

                <div className="mb-6 p-4 bg-background/5 rounded-lg border border-border text-left">
                    <div className="flex justify-between py-1">
                        <span className="text-muted text-sm">User ID</span>
                        <span className="text-sm font-medium">{(session.user as { id?: string })?.id || "—"}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="text-muted text-sm">Status</span>
                        <span className="text-sm font-medium text-success">Active</span>
                    </div>
                </div>

                <Button variant="danger" onClick={() => signOut({ callbackUrl: "/login" })} block>
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
