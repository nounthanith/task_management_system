"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineKey, HiOutlineHashtag } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<1 | 2>(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignUp = async () => {
        setError("");
        setSuccess("");
        setGoogleLoading(true);
        const result = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
        if (result?.error) {
            setError("There was a problem registering with Google");
            setGoogleLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("The passwords do not match");
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
                throw new Error(data.message || "Something went wrong. Please try again.");
            }

            setSuccess("Account created! Enter the code we sent to verify your email.");
            setStep(2);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong. Please try again.");
            }

            setSuccess("Email verified successfully! Redirecting to login...");
            setTimeout(() => router.push("/login"), 1200);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Something went wrong. Please try again.");
            }
            setSuccess("A new code has been sent to your email.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
            <div className="w-full max-w-md">
                <div className="absolute top-20 right-8 w-20 h-20 rounded-full bg-accent-green/40 blur-2xl pointer-events-none" />
                <div className="absolute bottom-16 left-8 w-24 h-24 rounded-full bg-accent-yellow/40 blur-2xl pointer-events-none" />

                <div className="card-aesthetic p-8 sm:p-10 relative">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green text-primary text-sm font-medium mb-5">
                            <HiOutlineUser />
                            {step === 1 ? "Get started" : "Verify"}
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                            {step === 1 ? "Create your account" : "Verify your email"}
                        </h1>
                        <p className="text-muted text-sm mt-2">
                            {step === 1
                                ? "Join and start organizing your tasks"
                                : "Enter the 6-digit code sent to your email"}
                        </p>
                    </div>

                    {success && (
                        <Alert
                            variant="success"
                            dismissible
                            className="mb-5"
                            onDismiss={() => setSuccess("")}
                        >
                            {success}
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            variant="error"
                            title="Something went wrong"
                            dismissible
                            className="mb-5"
                            onDismiss={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )}

                    {step === 1 ? (
                        <>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <Input
                                    id="register-name"
                                    type="text"
                                    label="Full name"
                                    icon={<HiOutlineUser />}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                                <Input
                                    id="register-email"
                                    type="email"
                                    label="Email"
                                    icon={<HiOutlineEnvelope />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                                <Input
                                    id="register-password"
                                    type="password"
                                    label="Password"
                                    icon={<HiOutlineKey />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    required
                                />
                                <Input
                                    id="register-confirm-password"
                                    type="password"
                                    label="Confirm password"
                                    icon={<HiOutlineKey />}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                />
                                <Button type="submit" variant="primary" block loading={loading} className="mt-2">
                                    {loading ? "Sending code..." : "Register"}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-7">
                                <div className="h-px flex-1 bg-primary/10"></div>
                                <span className="text-xs text-muted uppercase tracking-wider">or</span>
                                <div className="h-px flex-1 bg-primary/10"></div>
                            </div>

                            <Button
                                variant="outline"
                                block
                                onClick={handleGoogleSignUp}
                                loading={googleLoading}
                                icon={<FcGoogle className="text-lg" />}
                            >
                                {googleLoading ? "Signing in..." : "Continue with Google"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <Input
                                    id="verify-otp"
                                    type="text"
                                    label="Verification code"
                                    icon={<HiOutlineHashtag />}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
                                    placeholder="000000"
                                    maxLength={6}
                                    inputMode="numeric"
                                    required
                                />
                                <Button type="submit" variant="primary" block loading={loading} className="mt-2">
                                    {loading ? "Verifying..." : "Verify account"}
                                </Button>
                            </form>

                            <p className="mt-5 text-sm text-center text-muted">
                                Didn&apos;t receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="text-primary font-medium hover:underline disabled:opacity-50"
                                >
                                    Resend
                                </button>
                            </p>
                            <p className="mt-3 text-sm text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-muted hover:text-primary underline"
                                >
                                    Back to edit your details
                                </button>
                            </p>
                        </>
                    )}

                    <p className="mt-7 text-sm text-center text-muted">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
