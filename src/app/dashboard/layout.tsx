"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading" && status !== "authenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status !== "authenticated") return null;

    return (
        <div className="flex min-h-screen bg-neutral-100">
            <Sidebar />
            <main className="flex-1 bg-neutral-100 p-4 pb-24 lg:p-8 lg:pt-8 min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
