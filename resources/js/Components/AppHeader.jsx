import { Link, usePage } from "@inertiajs/react";
import Logo from "@/Components/Logo";

const baseLinks = [
    { label: "Đề thi online", href: "/tests" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
];

export default function AppHeader() {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const current = ziggy?.location ?? "";
    const navLinks = user?.role === "admin" ? [...baseLinks, { label: "Admin", href: "/admin" }] : baseLinks;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <Logo className="h-12 w-12" />
                    <span className="text-xl font-semibold text-gray-900">LingGo</span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-semibold text-gray-800">
                    {navLinks.map((item) => {
                        const isActive = current.includes(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative pb-1 ${isActive ? "text-black" : "text-gray-700 hover:text-black"
                                    }`}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute inset-x-0 -bottom-1 block h-0.5 bg-black" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <label
                                tabIndex={0}
                                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                            >
                                <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-gray-500">Xin chào</p>
                                    <p className="text-sm">{user.name}</p>
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-50 menu p-2 shadow bg-white rounded-box w-52 border border-gray-200"
                            >
                                <li>
                                    <Link href="/results" className="text-gray-800">
                                        Kết quả bài thi
                                    </Link>
                                </li>
                                <li>
                                </li>
                                <li>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-800"
                                    >
                                        Đăng xuất
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="rounded-full border border-gray-800 px-4 py-2">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="rounded-full bg-gray-900 px-4 py-2 text-white">
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
