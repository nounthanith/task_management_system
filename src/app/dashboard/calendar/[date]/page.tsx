import type { Metadata } from "next";
import CalendarDateView from "./CalendarDateView";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ date: string }>;
}): Promise<Metadata> {
    const { date } = await params;
    return {
        title: date ? `Events on ${date}` : "Day details",
        description: date ? `Scheduled events and details for ${date}.` : "Scheduled events for this day.",
        robots: { index: false, follow: false },
    };
}

export default async function CalendarDatePage({
    params,
}: {
    params: Promise<{ date: string }>;
}) {
    const { date } = await params;
    return <CalendarDateView date={date} />;
}