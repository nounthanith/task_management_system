"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    HiOutlineClipboardDocumentCheck,
    HiOutlineCheckCircle,
    HiOutlineLightBulb,
    HiOutlineChartBar,
    HiOutlineUsers,
    HiOutlineArrowRight,
    HiOutlineSparkles,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

const features = [
    {
        icon: HiOutlineClipboardDocumentCheck,
        color: "bg-accent-yellow",
        title: "Organize tasks",
        desc: "Keep every task in one place and stay on top of your to-do list with a clean, simple board.",
    },
    {
        icon: HiOutlineCheckCircle,
        color: "bg-accent-green",
        title: "Track progress",
        desc: "Mark tasks complete and watch your progress grow with clear, friendly status tracking.",
    },
    {
        icon: HiOutlineUsers,
        color: "bg-accent-blue",
        title: "Work together",
        desc: "Share tasks and collaborate with your team so everyone knows what needs to be done.",
    },
    {
        icon: HiOutlineChartBar,
        color: "bg-accent-pink",
        title: "Stay productive",
        desc: "Friendly stats and reminders help you focus on what matters most, every single day.",
    },
];

export default function HomeView() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace("/dashboard");
        }
    }, [session, router]);

    if (status === "loading" || session) return null;

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="w-full max-w-5xl mx-auto px-4 pt-32 pb-20 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-yellow text-primary text-sm font-medium mb-6">
                    <HiOutlineSparkles />
                    Simple task management
                </span>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary leading-tight">
                    Plan less.
                    <br />
                    Get things done.
                </h1>
                <p className="text-muted text-lg mt-6 max-w-xl mx-auto">
                    My Task Management is your friendly space to organize tasks, track progress, and
                    stay productive — all in one simple, beautiful place.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
                    <Link href="/register">
                        <Button size="lg" block icon={<HiOutlineArrowRight />}>
                            Get started free
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="sm:w-auto w-full">
                            Sign in
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Decorative blobs */}
            <div className="absolute top-40 right-0 w-64 h-64 rounded-full bg-accent-blue/30 blur-3xl pointer-events-none" />
            <div className="absolute top-64 left-0 w-64 h-64 rounded-full bg-accent-pink/30 blur-3xl pointer-events-none" />

            {/* Features */}
            <section className="w-full max-w-5xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue text-primary text-sm font-medium mb-4">
                        <HiOutlineLightBulb />
                        Features
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        Everything you need to stay organized
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {features.map((f) => (
                        <div key={f.title} className="card-aesthetic p-6 sm:p-7">
                            <span
                                className={`inline-flex w-12 h-12 rounded-2xl ${f.color} items-center justify-center mb-4`}
                            >
                                <f.icon className="text-2xl text-primary" />
                            </span>
                            <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
                            <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-5xl mx-auto px-4 py-16 text-center">
                <div className="card-aesthetic p-10 sm:p-14">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        Ready to get organized?
                    </h2>
                    <p className="text-muted mt-3 mb-8 max-w-md mx-auto">
                        Join today and start managing your tasks the easy way. It&apos;s free to get started.
                    </p>
                    <Link href="/register">
                        <Button size="lg" variant="yellow" icon={<HiOutlineArrowRight />}>
                            Create your account
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-primary/10 py-8 text-center text-sm text-muted">
                <p>Made with care for getting things done.</p>
            </footer>
        </div>
    );
}