"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignUp = async () => {
        setError("");
        setGoogleLoading(true);
        const result = await signIn("google", { callbackUrl: "/", redirect: false });
        if (result?.error) {
            setError("មានបញ្ហាក្នុងការចុះឈ្មោះជាមួយ Google");
            setGoogleLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("លេខសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "មានកំហុសឆ្គងបានកើតឡើង");
            }

            router.push("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "មានកំហុសឆ្គងបានកើតឡើង");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md p-8 bg-surface rounded-2xl shadow-card border border-border">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M19 8v6M22 11h-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">ចុះឈ្មោះគណនីថ្មី</h2>
                    <p className="text-muted text-sm mt-1">Create your account to get started</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-5 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        id="register-name"
                        type="text"
                        label="ឈ្មោះរបស់អ្នក"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                    />
                    <Input
                        id="register-email"
                        type="email"
                        label="អ៊ីមែល (Email)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <Input
                        id="register-password"
                        type="password"
                        label="លេខសម្ងាត់ (Password)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                    />
                    <Input
                        id="register-confirm-password"
                        type="password"
                        label="បញ្ជាក់លេខសម្ងាត់ (Confirm Password)"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                    />
                    <Button type="submit" variant="success" loading={loading}>
                        {loading ? "កំពុងរក្សាទុក..." : "បង្កើតគណនី"}
                    </Button>
                </form>

                {/* DIVIDER */}
                <div className="relative flex py-6 items-center">
                    <div className="grow border-t border-border"></div>
                    <span className="shrink mx-4 text-muted text-sm">or</span>
                    <div className="grow border-t border-border"></div>
                </div>

                {/* GOOGLE SIGN UP BUTTON */}
                <Button variant="outline" onClick={handleGoogleSignUp} loading={googleLoading}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {googleLoading ? "Signing in..." : "ចុះឈ្មោះជាមួយ Google"}
                </Button>

                <p className="mt-6 text-sm text-center text-muted">
                    មានគណនីរួចហើយមែនទេ?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        ចូលប្រើប្រាស់នៅទីនេះ
                    </Link>
                </p>
            </div>
        </div>
    );
}
