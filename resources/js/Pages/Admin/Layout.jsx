import { Link, usePage } from "@inertiajs/react";
import { LayoutDashboard, FileText, Users, LogOut, Home, Compass } from "lucide-react";

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
        <div className="min-h-screen bg-base-200">
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
                    <aside className="card border border-base-300 bg-base-100">
                        <div className="card-body p-4">
                            <div className="mb-2">
                                <p className="text-sm font-semibold">LingGo Admin</p>
                                <p className="text-xs text-base-content/60">{user?.name || "Administrator"}</p>
                            </div>

                            <ul className="menu gap-1 rounded-box p-0 text-sm">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = current === item.href;

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={isActive ? "active" : ""}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        Về trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("logout")} method="post" as="button">
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    <main className="card border border-base-300 bg-base-100">
                        <div className="card-body p-4 sm:p-6">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
