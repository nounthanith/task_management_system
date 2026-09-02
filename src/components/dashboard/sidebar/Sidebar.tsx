"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    FiCalendar,
    FiList,
    FiSettings,
    FiLogOut,
    FiPlus,
    FiHome,
    FiChevronRight,
    FiGrid,
} from "react-icons/fi";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: FiHome, end: true },
    { href: "/dashboard/calendar", label: "Calendar", icon: FiCalendar, end: false },
    { href: "/dashboard/events", label: "Events", icon: FiList, end: false },
    { href: "/dashboard/settings", label: "Settings", icon: FiSettings, end: false },
];

const mobileTabs = [
    { href: "/dashboard", label: "Home", icon: FiHome, end: true },
    { href: "/dashboard/calendar", label: "Calendar", icon: FiCalendar, end: false },
    { href: "/dashboard/calendar/new", label: "Add", icon: FiPlus, end: false, highlight: true },
    { href: "/dashboard/events", label: "Events", icon: FiList, end: false },
    { href: "/dashboard/settings", label: "More", icon: FiGrid, end: false },
];

function MobileTabBar({ pathname }: { pathname: string }) {
    const isActive = (item: { href: string; end: boolean }) =>
        item.end ? pathname === item.href : pathname.startsWith(item.href);

    return (
        <nav
            className="mobile-tabbar lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200/70 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
            aria-label="Primary"
        >
            <div className="relative flex items-stretch justify-around h-16 px-2">
                {mobileTabs.map((item) => {
                    const active = isActive(item);
                    if (item.highlight) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex-1 flex flex-col items-center justify-center relative"
                                aria-label="Add event"
                            >
                                <span className="tabbar-fab -translate-y-6 w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 ring-[3px] ring-white">
                                    <FiPlus className="text-2xl" />
                                </span>
                                <span className="mt-0.5 text-[10px] font-semibold text-neutral-400">
                                    Add
                                </span>
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                                active ? "text-orange-600" : "text-neutral-400 hover:text-neutral-700"
                            }`}
                        >
                            <span className="relative flex flex-col items-center gap-0.5">
                                <item.icon
                                    className={`text-[22px] transition-transform duration-200 ${active ? "scale-110" : ""}`}
                                />
                                <span
                                    className={`h-1 w-4 rounded-full transition-all duration-200 ${
                                        active ? "bg-orange-500" : "bg-transparent"
                                    }`}
                                />
                            </span>
                            <span
                                className={`text-[10px] font-semibold ${active ? "text-orange-600" : "text-neutral-400"}`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

function DesktopSidebarContent({
    pathname,
    session,
    initial,
}: {
    pathname: string;
    session: ReturnType<typeof useSession>["data"];
    initial: string;
}) {
    const isActive = (item: { href: string; end: boolean }) =>
        item.end ? pathname === item.href : pathname.startsWith(item.href);

    return (
        <>
            {/* Logo / Brand */}
            <div className="px-6 pt-7 pb-2">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-neutral-900 to-neutral-700 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <FiCalendar className="text-lg" />
                    </span>
                    <span className="font-bold text-neutral-900 text-lg tracking-tight">
                        Task Calendar
                    </span>
                </Link>
            </div>

            {/* Add Event CTA */}
            <div className="px-4 mt-5">
                <Link
                    href="/dashboard/calendar/new"
                    className="sidebar-cta relative overflow-hidden flex items-center justify-start gap-2.5 rounded-xl bg-linear-to-r from-neutral-900 to-neutral-800 text-white px-3 py-2.5 text-sm font-medium hover:from-neutral-800 hover:to-neutral-700 shadow-md shadow-neutral-900/10 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                >
                    <FiPlus className="text-base shrink-0" />
                    <span>Add event</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-0.5 px-4 mt-7">
                <span className="px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                    Menu
                </span>
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-nav-item relative flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                active
                                    ? "bg-linear-to-r from-orange-50 to-transparent text-neutral-900"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                            }`}
                        >
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-6 bg-linear-to-b from-orange-500 to-orange-400 rounded-r-full shadow-sm shadow-orange-200" />
                            )}
                            <item.icon
                                className={`text-lg shrink-0 transition-colors duration-200 ${
                                    active ? "text-orange-600" : ""
                                }`}
                            />
                            <span>{item.label}</span>
                            {active && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section */}
            <div className="mt-auto px-4 pb-6 flex flex-col gap-1">
                <div className="mx-3 mb-3 border-t border-neutral-100" />

                {/* User profile */}
                <Link
                    href="/profile"
                    className="sidebar-nav-item relative flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
                >
                    <span className="w-9 h-9 rounded-full bg-linear-to-br from-orange-400 to-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {initial}
                    </span>
                    <span className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-neutral-800 text-sm">
                            {session?.user?.name || "Account"}
                        </span>
                        <span className="truncate text-[11px] text-neutral-400">
                            {session?.user?.email || "user@email.com"}
                        </span>
                    </span>
                    <FiChevronRight className="ml-auto text-neutral-300 text-sm" />
                </Link>

                {/* Logout */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="sidebar-nav-item flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                >
                    <FiLogOut className="text-lg shrink-0 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const initial = session?.user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-neutral-200/60 flex-col gap-2 sticky top-0 h-screen overflow-y-auto sidebar-desktop">
                <DesktopSidebarContent pathname={pathname} session={session} initial={initial} />
            </aside>

            {/* Mobile bottom tab bar */}
            <MobileTabBar pathname={pathname} />
        </>
    );
}
