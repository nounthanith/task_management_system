"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import AuthButton from "./AuthButton";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6">
            <div className="mt-4 flex justify-between items-center w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-primary/10 rounded-full pl-4 sm:pl-6 pr-3 py-2 shadow-soft">
                <Logo />
                <div className="hidden sm:flex items-center gap-1">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            pathname === "/"
                                ? "bg-primary text-white"
                                : "text-primary/70 hover:bg-primary/5 hover:text-primary"
                        }`}
                    >
                        Home
                    </Link>
                </div>
                <AuthButton />
            </div>
        </nav>
    );
}
