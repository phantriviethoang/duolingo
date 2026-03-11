import { Link, usePage } from "@inertiajs/react";
import { LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Quản lý đề thi", href: "/admin/tests" },
  { label: "Quản lý câu hỏi", href: "/admin/questions" },
  { label: "Quản lý người dùng", href: "/admin/users" },
];

export default function AdminLayout({ children, current }) {
  const {
    auth: { user },
  } = usePage().props;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen border-t border-black/10">
        <aside className="flex w-64 flex-col justify-between bg-[#d9edf5] border-r border-gray-300 pt-6 pr-0">
          <div>
            {/* <div className="h-16 w-16 rounded-2xl bg-[#ffb4a2] flex items-center justify-center text-xl font-bold text-white">
              LG
            </div> */}
            {/* <div className="mt-6 text-sm font-semibold text-gray-700">ADMIN</div> */}

            <nav className="mt-6 space-y-2 flex flex-col ">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-full self-start px-4 py-2 text-sm font-semibold ${current === item.href
                    ? "bg-amber-100 text-black"
                    : "text-gray-700 "
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-md bg-[#ff5c5c] px-4 py-2 text-sm font-semibold text-white">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </aside>

        <main className="flex-1 bg-[#f4f4f7]">
          <div className="flex items-center justify-end border-b border-gray-300 px-8 py-4 text-sm font-semibold text-gray-700">
            <span className="mr-3">{user?.name || "Admin"}</span>
            <div className="h-8 w-8 rounded-full bg-black/80" />
          </div>
          <div className="px-8 py-10">{children}</div>
        </main>
      </div>
      {/* <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        Footer
      </footer> */}
    </div>
  );
}
