import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Home,
    ChevronRight,
    Bell,
    Compass,
} from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl fixed inset-y-0 z-50">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        L
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">LingGo <span className="text-blue-500">CMS</span></span>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">DANH MỤC CHÍNH</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = current === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}

                    <div className="pt-10">
                        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">LIÊN KẾT NHANH</p>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Đăng xuất
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="text-sm font-medium text-gray-400">
                        Admin / <span className="text-gray-900 capitalize">{current.split('/').pop() || 'Dashboard'}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || "Administrator"}</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-tighter">System Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 shadow-sm flex items-center justify-center text-white font-black">
                                {user?.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
