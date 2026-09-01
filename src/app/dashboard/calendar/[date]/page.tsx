import CalendarDateView from "./CalendarDateView";

export default async function CalendarDatePage({
    params,
}: {
    params: Promise<{ date: string }>;
}) {
    const { date } = await params;
    return <CalendarDateView date={date} />;
}
