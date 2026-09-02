import type { Metadata } from "next";
import HomeView from "./HomeView";

const APP_URL = "https://taskmanagementsystem-eight.vercel.app";

export const metadata: Metadata = {
    title: "Task Management — Plan Less, Get Things Done",
    description:
        "A friendly calendar and event management app to organize tasks, track progress, and stay productive. Free to get started.",
    alternates: {
        canonical: APP_URL,
    },
    openGraph: {
        title: "Task Management — Plan Less, Get Things Done",
        description:
            "A friendly calendar and event management app to organize tasks, track progress, and stay productive.",
        url: APP_URL,
        type: "website",
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
        description:
            "A friendly calendar and event management app to organize tasks, track progress, and stay productive.",
        images: ["/og.png"],
    },
};

export default function Home() {
    return <HomeView />;
}