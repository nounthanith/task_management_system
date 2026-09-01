"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Hook providing programmatic navigation helpers for calendar views.
 * Uses URL query params (?view=month, ?month=2026-09) as the source of truth.
 */
export function useCalendarNav() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = searchParams.get("month") ?? currentMonthKey();

    const goToMonth = useCallback(
        (monthKey: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("month", monthKey);
            router.push(`/dashboard/calendar?${params.toString()}`);
        },
        [router, searchParams]
    );

    const goToDate = useCallback(
        (dateKey: string) => {
            router.push(`/dashboard/calendar/${dateKey}`);
        },
        [router]
    );

    const setView = useCallback(
        (view: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", view);
            router.push(`/dashboard/calendar?${params.toString()}`);
        },
        [router, searchParams]
    );

    const shiftMonth = useCallback(
        (dir: 1 | -1) => {
            const [y, m] = currentMonth.split("-").map(Number);
            const d = new Date(y, m - 1 + dir, 1);
            goToMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
        },
        [currentMonth, goToMonth]
    );

    return { currentMonth, goToMonth, goToDate, setView, shiftMonth };
}

function currentMonthKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
