import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

type BackLinkProps = {
    href: string;
    label?: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
            <span className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                <FiArrowLeft className="text-neutral-500" />
            </span>
            {label && <span>{label}</span>}
        </Link>
    );
}