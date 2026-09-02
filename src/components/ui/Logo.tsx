import Link from "next/link";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-accent-yellow flex items-center justify-center shadow-soft">
                <HiOutlineClipboardDocumentCheck className="text-lg text-primary" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-primary">SaluTask</span>
        </Link>
    );
}
