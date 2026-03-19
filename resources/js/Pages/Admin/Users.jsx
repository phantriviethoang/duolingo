import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./Layout";
import { Mail, Calendar } from "lucide-react";

export default function AdminUsers({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users"),
            {
                search: search || undefined,
                role: role || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch("");
        setRole("");
        router.get(route("admin.users"), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const rows = Array.isArray(users?.data) ? users.data : [];

    return (
        <AdminLayout current="/admin/users">
            <div className="space-y-4">
                <div>
                    <div>
                        <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
                        <p className="text-sm text-base-content/70">Danh sách người dùng hiện tại.</p>
                    </div>
                </div>

                <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-2">
                    <label className="form-control w-full max-w-sm">
                        <span className="label-text text-xs">Tìm kiếm</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input input-sm input-bordered"
                            placeholder="Tên hoặc email"
                        />
                    </label>

                    <label className="form-control w-44">
                        <span className="label-text text-xs">Vai trò</span>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="select select-sm select-bordered"
                        >
                            <option value="">Tất cả</option>
                            <option value="admin">Quản trị</option>
                            <option value="student">Học viên</option>
                            <option value="teacher">Giáo viên</option>
                        </select>
                    </label>

                    <button type="submit" className="btn btn-sm btn-primary">Lọc</button>
                    <button type="button" onClick={clearFilters} className="btn btn-sm btn-ghost">Xóa lọc</button>
                </form>

                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Trình độ</th>
                                        <th>Số bài làm</th>
                                        <th>Ngày tham gia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-sm text-base-content/60">
                                                Không có dữ liệu người dùng.
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((user) => (
                                            <tr key={user.id}>
                                                <td>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <div className="flex items-center gap-1 text-xs text-base-content/60">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-sm ${user.role === 'admin' ? 'badge-neutral' : 'badge-ghost'}`}>
                                                        {user.role === 'admin' ? 'Quản trị' : user.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                                                    </span>
                                                </td>
                                                <td>{user.status}</td>
                                                <td>{user.current_level}{user.target_level ? ` -> ${user.target_level}` : ''}</td>
                                                <td>{user.results_count}</td>
                                                <td>
                                                    <div className="flex items-center gap-1 text-xs text-base-content/60">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {user.joined}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-base-300 px-4 py-3 text-sm">
                            <span className="text-base-content/70">
                                Trang {users?.current_page || 1}/{users?.last_page || 1}
                            </span>
                            <div className="join">
                                <Link
                                    href={users?.prev_page_url || "#"}
                                    className={`join-item btn btn-sm ${users?.prev_page_url ? "" : "btn-disabled"}`}
                                >
                                    Trước
                                </Link>
                                <Link
                                    href={users?.next_page_url || "#"}
                                    className={`join-item btn btn-sm ${users?.next_page_url ? "" : "btn-disabled"}`}
                                >
                                    Sau
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
