import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FiUsers, FiShield, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { isAdmin } from "@/lib/auth";
import { getUsers } from "./action";

const PER_PAGE = 10;

export const metadata: Metadata = {
    title: "Users (Admin)",
    description: "Admin panel showing all registered users on the platform.",
    robots: { index: false, follow: false },
};

export default async function Users({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const admin = await isAdmin();
    if (!admin) {
        redirect("/login");
    }

    const sp = await searchParams;
    const rawPage = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page ?? "1");
    const currentPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const all = await getUsers();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const start = (safePage - 1) * PER_PAGE;
    const pageUsers = all.slice(start, start + PER_PAGE);

    const admins = all.filter((u) => u.role === "admin").length;
    const members = total - admins;

    const firstIdx = total === 0 ? 0 : start + 1;
    const lastIdx = Math.min(start + PER_PAGE, total);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 mt-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                        Users
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">
                        Admin panel — view everyone registered on the platform.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-3 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0 mb-2">
                        <FiUsers className="text-base sm:text-lg" />
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-500">Total</p>
                    <p className="text-2xl font-bold text-neutral-900 leading-tight">{total}</p>
                </div>
                <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-3 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-md shrink-0 mb-2">
                        <FiShield className="text-base sm:text-lg" />
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-500">Admins</p>
                    <p className="text-2xl font-bold text-neutral-900 leading-tight">{admins}</p>
                </div>
                <div className="rounded-2xl bg-white border border-neutral-200/60 shadow-sm p-3 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center shadow-md shrink-0 mb-2">
                        <FiUser className="text-base sm:text-lg" />
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-500">Members</p>
                    <p className="text-2xl font-bold text-neutral-900 leading-tight">{members}</p>
                </div>
            </div>

            {/* User list */}
            <div className="rounded-3xl bg-white border border-neutral-200/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-800">All members</span>
                    <span className="text-xs font-medium text-neutral-400">
                        {total > 0 ? `${firstIdx}–${lastIdx} of ${total}` : "0 total"}
                    </span>
                </div>

                {pageUsers.length === 0 ? (
                    <div className="text-center py-14 px-6">
                        <div className="mx-auto w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                            <FiUser className="text-orange-500 text-2xl" />
                        </div>
                        <p className="text-neutral-600 font-medium">No users found</p>
                        <p className="text-sm text-neutral-400 mt-1">Users will appear here as they sign up.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-neutral-100">
                        {pageUsers.map((user) => {
                            const isAdmin = user.role === "admin";
                            return (
                                <li
                                    key={user._id}
                                    className="flex items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-neutral-50/70 transition-colors"
                                >
                                    <span
                                        className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm ${
                                            isAdmin
                                                ? "bg-linear-to-br from-orange-400 to-orange-500"
                                                : "bg-linear-to-br from-neutral-400 to-neutral-500"
                                        }`}
                                    >
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-neutral-400 truncate mt-0.5">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                            isAdmin
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-neutral-100 text-neutral-500"
                                        }`}
                                    >
                                        {isAdmin && <FiShield className="text-[11px]" />}
                                        {isAdmin ? "Admin" : "Member"}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* Pagination */}
                {total > PER_PAGE && (
                    <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-neutral-100">
                        <Link
                            href={safePage > 1 ? `/users?page=${safePage - 1}` : "/users"}
                            aria-disabled={safePage <= 1}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-neutral-200 shadow-sm transition-all duration-200 active:scale-[0.98] ${
                                safePage <= 1
                                    ? "pointer-events-none opacity-40 text-neutral-400"
                                    : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                        >
                            <FiChevronLeft />
                            <span className="hidden sm:inline">Prev</span>
                        </Link>
                        <span className="text-sm font-semibold text-neutral-500">
                            Page <span className="text-neutral-900">{safePage}</span> / {totalPages}
                        </span>
                        <Link
                            href={safePage < totalPages ? `/users?page=${safePage + 1}` : `/users?page=${totalPages}`}
                            aria-disabled={safePage >= totalPages}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-neutral-200 shadow-sm transition-all duration-200 active:scale-[0.98] ${
                                safePage >= totalPages
                                    ? "pointer-events-none opacity-40 text-neutral-400"
                                    : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <FiChevronRight />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}