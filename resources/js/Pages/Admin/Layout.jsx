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
        <div className="min-h-screen bg-gray-50">
            <AppHeader />
            
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
                    <aside className="space-y-4">
                        <div className="card border border-gray-200 bg-white shadow-sm rounded-3xl overflow-hidden">
                            <div className="card-body p-6">
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
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                                        isActive 
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

                    <main>
                        <div className="card border border-gray-200 bg-white shadow-sm rounded-3xl overflow-hidden min-h-[600px]">
                            <div className="card-body p-8">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
