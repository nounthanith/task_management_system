"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiUsers } from "react-icons/fi";
import Logo from "../ui/Logo";
import AuthButton from "./AuthButton";

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const loggedIn = status === "authenticated";
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === "admin";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6">
            <div className="mt-4 flex justify-between items-center w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-primary/10 rounded-full pl-4 sm:pl-6 pr-3 py-2 shadow-soft">
                <Logo />
                <div className="hidden sm:flex items-center gap-1">
                    <Link
                        href={loggedIn ? "/dashboard" : "/"}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === "/" || pathname === "/dashboard"
                            ? "bg-primary text-white"
                            : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                            }`}
                    >
                        {loggedIn ? "Dashboard" : "Home"}
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/users"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${pathname === "/users"
                                ? "bg-primary text-white"
                                : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                                }`}
                        >
                            Users
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    {isAdmin && (
                        <Link
                            href="/users"
                            aria-label="Users"
                            className={`sm:hidden flex items-center justify-center w-9 h-9 rounded-full p-2 transition-all duration-200 ${
                                pathname === "/users"
                                    ? "bg-primary text-white"
                                    : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                            }`}
                        >
                            <FiUsers className="text-lg" />
                        </Link>
                    )}
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
}
