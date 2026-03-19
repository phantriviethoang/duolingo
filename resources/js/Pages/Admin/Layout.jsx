import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, FileText, Users, LogOut, Home, Compass } from "lucide-react";
import AppHeader from "@/Components/AppHeader";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Quản lý đề thi", href: "/admin/tests", icon: FileText },
    { label: "Quản lý lộ trình", href: "/admin/path", icon: Compass },
    { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children, current }) {
    const {
        auth: { user },
    } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppHeader />

            <div className="flex-1 flex w-full px-4 lg:px-6 py-6 pt-24">
                <div className="flex flex-col lg:flex-row gap-8 w-full items-start relative">
                    <div className="hidden lg:block w-70 shrink-0">
                        <aside className="fixed w-70 top-1/2 -translate-y-1/2 left-4 lg:left-6 z-40">
                            <div className="card border border-gray-200 bg-white shadow-xl rounded-[2.5rem] overflow-hidden">
                                <div className="card-body p-8">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/20">
                                            {user?.name?.charAt(0).toUpperCase() || "A"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 leading-none mb-1">{user?.name || "Administrator"}</p>
                                            <span className="inline-block px-2 py-0.5 bg-amber-50 text-[10px] font-black text-amber-600 rounded-lg uppercase tracking-widest border border-amber-100">
                                                Quản trị viên
                                            </span>
                                        </div>
                                    </div>

                                    <ul className="menu gap-2 p-0 text-sm font-bold">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = current === item.href;

                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                                                                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                                            }`}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                        <div className="h-px bg-gray-100 my-4 mx-2"></div>
                                        <li>
                                            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all">
                                                <Home className="h-5 w-5" />
                                                Về trang chủ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Đăng xuất
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Mobile Aside (non-fixed) */}
                    <aside className="lg:hidden w-full mb-6">
                        <div className="card border border-gray-200 bg-white shadow-sm rounded-3xl overflow-hidden">
                            <div className="card-body p-6">
                                <ul className="menu menu-horizontal gap-2 p-0 text-xs font-bold justify-center flex-wrap">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link href={item.href} className={`px-3 py-2 rounded-xl ${current === item.href ? "bg-amber-500 text-white" : "text-gray-500"}`}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0 w-full">
                        <div className="card border border-gray-200 bg-white shadow-xl rounded-[2.5rem] overflow-hidden min-h-[calc(100vh-160px)]">
                            <div className="card-body p-6 lg:p-10">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
