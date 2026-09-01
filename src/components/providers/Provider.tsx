"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactNode {
    return <SessionProvider>{children}</SessionProvider>;
}
