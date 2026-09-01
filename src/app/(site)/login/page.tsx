"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineEnvelope, HiOutlineKey, HiOutlineArrowRight } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid email or password");
        } else if (result?.ok) {
            window.location.href = result.url || "/profile";
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setGoogleLoading(true);
        const result = await signIn("google", { callbackUrl: "/profile", redirect: false });
        if (result?.error) {
            setError("There was a problem signing in with Google");
            setGoogleLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            router.replace("/profile");
        }
    }, [session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (session) return null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
            <div className="w-full max-w-md">
                {/* Decorative pastel marks */}
                <div className="absolute top-20 left-8 w-20 h-20 rounded-full bg-accent-blue/40 blur-2xl pointer-events-none" />
                <div className="absolute bottom-16 right-8 w-24 h-24 rounded-full bg-accent-pink/40 blur-2xl pointer-events-none" />

                <div className="card-aesthetic p-8 sm:p-10 relative">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-yellow text-primary text-sm font-medium mb-5">
                            <HiOutlineKey />
                            Welcome
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome back</h1>
                        <p className="text-muted text-sm mt-2">Sign in to continue to your tasks</p>
                    </div>

                    {error && (
                        <div className="bg-accent-pink/30 border border-accent-pink/50 text-primary px-4 py-3 rounded-2xl mb-5 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Credentials form */}
                    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                        <Input
                            id="login-email"
                            type="email"
                            label="Email Address"
                            icon={<HiOutlineEnvelope />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            id="login-password"
                            type="password"
                            label="Password"
                            icon={<HiOutlineKey />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <Button
                            type="submit"
                            block
                            loading={loading}
                            icon={<HiOutlineArrowRight />}
                            className="mt-2"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="h-px flex-1 bg-primary/10"></div>
                        <span className="text-xs text-muted uppercase tracking-wider">or</span>
                        <div className="h-px flex-1 bg-primary/10"></div>
                    </div>

                    {/* Google */}
                    <Button
                        variant="outline"
                        block
                        onClick={handleGoogleSignIn}
                        loading={googleLoading}
                        icon={<FcGoogle className="text-lg" />}
                    >
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                    </Button>

                    <p className="mt-7 text-sm text-center text-muted">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
