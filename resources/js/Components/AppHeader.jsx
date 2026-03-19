import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Logo from "@/Components/Logo";

const baseLinks = [
    { label: "Lộ Trình", href: "/path/level", icon: "🎓", activePrefix: "/path" },
    { label: "Tiến Độ", href: "/progress/dashboard", icon: "📊", activePrefix: "/progress" },
    { label: "Kết Quả", href: "/results", icon: "📝", activePrefix: "/results" },
];

const adminLinks = [
    { label: "Dashboard quản trị", href: "/admin", activePrefix: "/admin" },
    { label: "Quản lý đề thi", href: "/admin/tests", activePrefix: "/admin/tests" },
    { label: "Quản lý người dùng", href: "/admin/users", activePrefix: "/admin/users" },
    { label: "Kết quả hệ thống", href: "/admin/results", activePrefix: "/admin/results" },
    { label: "Phân tích", href: "/admin/analytics", activePrefix: "/admin/analytics" },
];

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function AppHeader() {
    const { auth, ziggy } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';
    const navLinks = isAdmin
        ? [...baseLinks, { label: "Quản Trị", href: "/admin", activePrefix: "/admin" }]
        : baseLinks;
    const currentPath = new URL(ziggy?.location ?? window.location.href).pathname;
    const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-200 bg-linear-to-r from-blue-50 to-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <Logo className="h-10 w-10" />
                    <div>
                        <span className="text-lg font-bold text-blue-600">LingGo</span>
                        <p className="text-xs text-gray-500">Học và luyện tập ngoại ngữ</p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {/* Level Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                            className={`flex items-center gap-2 font-medium transition-colors ${currentPath.startsWith('/path') ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                                }`}
                        >
                            <span>Chọn Trình Độ</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isLevelDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    {levels.map(level => (
                                        <Link
                                            key={level}
                                            href={`/path/${level}`}
                                            className={`block px-4 py-2 text-sm ${currentPath === `/path/${level}` ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                }`}
                                            onClick={() => setIsLevelDropdownOpen(false)}
                                        >
                                            Level {level}
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <Link
                                        href="/path/level"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 italic"
                                        onClick={() => setIsLevelDropdownOpen(false)}
                                    >
                                        Tất cả trình độ
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {navLinks.map((item) => {
                        const isActive = currentPath.startsWith(item.activePrefix);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative pb-1 transition-colors ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5">
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
                                    <p className="text-xs text-gray-500 capitalize">{user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-50 menu p-3 shadow-lg bg-white rounded-lg w-56 border border-gray-200"
                            >
                                <li>
                                    <span className="text-xs text-gray-500 px-3 py-1 font-semibold">DANH MỤC</span>
                                </li>
                                <li>
                                    <Link href="/progress/dashboard" className="text-gray-800 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
                                        Tiến độ học tập
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/path/level" className="text-gray-800 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
                                        Lộ trình học
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/results" className="text-gray-800 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
                                        Kết quả của tôi
                                    </Link>
                                </li>
                                {user.role === 'admin' && (
                                    <>
                                        <li>
                                            <span className="text-xs text-gray-500 px-3 py-1 font-semibold">QUẢN TRỊ</span>
                                        </li>
                                        <li>
                                            <Link href="/admin" className="text-gray-800 hover:bg-amber-100 hover:text-amber-700 rounded-lg">
                                                Trang quản trị
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
                                        Đăng xuất
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
                <nav className="grid grid-cols-2 gap-2 text-xs font-medium">
                    {/* Level Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                            className={`flex items-center gap-2 font-medium transition-colors p-2 rounded ${currentPath.startsWith('/path') ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"
                                }`}
                        >
                            <span>Trình Độ</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isLevelDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    {levels.map(level => (
                                        <Link
                                            key={level}
                                            href={`/path/${level}`}
                                            className={`block px-4 py-2 text-sm ${currentPath === `/path/${level}` ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                }`}
                                            onClick={() => setIsLevelDropdownOpen(false)}
                                        >
                                            Level {level}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {navLinks.map((item) => {
                        const isActive = currentPath.startsWith(item.activePrefix);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-center transition-colors ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <div>{item.label}</div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
