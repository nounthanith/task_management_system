import Navbar from "@/components/layouts/Navbar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="">{children}</main>
        </div >
    );
}
