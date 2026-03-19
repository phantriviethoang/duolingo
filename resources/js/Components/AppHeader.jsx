import { Link, usePage } from "@inertiajs/react";
import Logo from "@/Components/Logo";
import { BookOpen, Zap, Trophy, HelpCircle } from "lucide-react";

const baseLinks = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Lộ trình", href: "/levels", icon: "🎓" },
    { label: "Bài thi cơ bản", href: "/tests", icon: "📝" },
    { label: "Giới thiệu", href: "/about", icon: "ℹ️" },
    { label: "Liên hệ", href: "/contact", icon: "📞" },
];

export default function AppHeader() {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const current = ziggy?.location ?? "";
    const navLinks = user?.role === "admin" ? [...baseLinks, { label: "Admin", href: "/admin", icon: "⚙️" }] : baseLinks;

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                    <Logo className="h-10 w-10" />
                    <div>
                        <span className="text-lg font-bold text-blue-600">LingGo</span>
                        <p className="text-xs text-gray-500">Học và luyện tập ngoại ngữ</p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {baseLinks.slice(0, 5).map((item) => {
                        const isActive = current.includes(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative pb-1 transition-colors ${isActive
                                    ? "text-blue-600 font-semibold"
                                    : "text-gray-700 hover:text-blue-600"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>{item.icon}</span>
                                    {item.label}
                                </div>
                                {isActive && (
                                    <span className="absolute inset-x-0 -bottom-1 block h-1 bg-blue-600 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="dropdown dropdown-end">
                            <label
                                tabIndex={0}
                                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role === 'admin' ? '👑 Admin' : '👤 Học viên'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-50 menu p-3 shadow-lg bg-white rounded-lg w-56 border border-gray-200"
                            >
                                <li className="mb-2">
                                    <span className="text-xs text-gray-500 px-3 py-1 font-semibold">MENU CHÍNH</span>
                                </li>
                                <li>
                                    <Link href="/levels" className="text-gray-800 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
                                        🎓 Lộ trình học
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/results" className="text-gray-800 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
                                        🏆 Kết quả của tôi
                                    </Link>
                                </li>
                                {user.role === 'admin' && (
                                    <>
                                        <li>
                                            <span className="text-xs text-gray-500 px-3 py-1 font-semibold">QUẢN TRỊ VIÊN</span>
                                        </li>
                                        <li>
                                            <Link href="/admin" className="text-gray-800 hover:bg-amber-100 hover:text-amber-700 rounded-lg">
                                                ⚙️ Trang quản lý
                                            </Link>
                                        </li>
                                    </>
                                )}
                                <li className="border-t border-gray-200 mt-2 pt-2">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-red-600 hover:bg-red-100 rounded-lg"
                                    >
                                        🚪 Đăng xuất
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-blue-600 font-semibold hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
                <nav className="grid grid-cols-3 gap-2 text-xs font-medium">
                    {baseLinks.slice(0, 5).map((item) => {
                        const isActive = current.includes(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-center transition-colors ${isActive
                                    ? "bg-blue-100 text-blue-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <div>{item.icon}</div>
                                <div>{item.label}</div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
