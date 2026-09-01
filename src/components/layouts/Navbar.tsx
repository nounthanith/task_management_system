import Logo from "../ui/Logo";
import AuthButton from "./AuthButton";

export default function Navbar() {
    const navItems = [{ label: "Home", href: "/" }];
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow z-10 flex items-center justify-between px-4 py-2">
            <Logo />
            <div className="flex items-center gap-2">
                {navItems.map((item) => (
                    <a key={item.href} href={item.href} className="px-4 py-2 text-gray-700 hover:text-primary">
                        {item.label}
                    </a>
                ))}
                <AuthButton />
            </div>
        </nav>
    );
}
