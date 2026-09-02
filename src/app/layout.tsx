import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Task Management";
const APP_DESCRIPTION =
  "Task Management is a simple, friendly calendar and event management app. Organize tasks, track progress, and stay productive — all in one clean place.";
const APP_URL = "https://taskmanagementsystem-eight.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Task Management — Plan Less, Get Things Done",
    template: "%s | Task Management",
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "task management",
    "calendar",
    "event scheduling",
    "to-do list",
    "productivity",
    "task organizer",
  ],
  authors: [{ name: "Task Management" }],
  creator: "Task Management",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: "Task Management — Plan Less, Get Things Done",
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 2400,
        height: 1800,
        alt: "Task Management — Plan Less, Get Things Done",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Task Management — Plan Less, Get Things Done",
    description: APP_DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}