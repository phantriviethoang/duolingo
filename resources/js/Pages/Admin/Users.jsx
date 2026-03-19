import { Link, router, Head } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./Layout";
import { Mail, Calendar, Search, Filter, Users, Shield, GraduationCap, Clock, ArrowRight, UserPlus, X } from "lucide-react";

export default function AdminUsers({ users, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");

    const applyFilters = (e) => {
        if (e) e.preventDefault();
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

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-100 flex items-center gap-1.5"><Shield className="w-3 h-3" /> Quản trị</span>;
            case 'teacher':
                return <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100 flex items-center gap-1.5"><GraduationCap className="w-3 h-3" /> Giáo viên</span>;
            default:
                return <span className="inline-block px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100 flex items-center gap-1.5">Học viên</span>;
        }
    };

    return (
        <AdminLayout current="/admin/users">
            <Head title="Quản lý người dùng" />
            
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý người dùng</h1>
                        <p className="text-gray-500 font-medium mt-1">
                            {filters.search || filters.role 
                                ? `Đang tìm kiếm: ${filters.search || ''} ${filters.role ? ` - Vai trò: ${filters.role}` : ''}`
                                : 'Danh sách tất cả người dùng tham gia hệ thống LingGo.'
                            }
                        </p>
                    </div>
                    <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20 gap-2">
                        <UserPlus className="w-5 h-5" />
                        Thêm người dùng
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[2rem] border-2 border-gray-50 p-6 shadow-sm">
                    <form onSubmit={applyFilters} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="w-full md:flex-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tìm kiếm</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input input-bordered w-full pl-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium"
                                    placeholder="Tên hoặc email người dùng..."
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-64">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vai trò</label>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="select select-bordered w-full pl-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all font-bold"
                                >
                                    <option value="">Tất cả vai trò</option>
                                    <option value="admin">Quản trị viên</option>
                                    <option value="student">Học viên</option>
                                    <option value="teacher">Giáo viên</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-xl px-8 font-black flex-1 md:flex-none">
                                Lọc dữ liệu
                            </button>
                            {(filters.search || filters.role) && (
                                <button type="button" onClick={clearFilters} className="btn btn-ghost rounded-xl px-4 text-gray-400 hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Vai trò</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Trạng thái học</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Hoạt động</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ngày tham gia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                    <Users className="w-10 h-10" />
                                                </div>
                                                <p className="text-gray-400 font-bold">Không tìm thấy người dùng nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg border border-blue-100 shadow-sm">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                            <Mail className="w-3 h-3" />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    {getRoleBadge(user.role)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-xs font-black text-gray-900">Level {user.current_level || 'A1'}</span>
                                                    <div className="w-16 bg-gray-100 rounded-full h-1 overflow-hidden">
                                                        <div className="bg-blue-500 h-full w-1/3 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3 text-amber-500" />
                                                        {user.results_count || 0} bài làm
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <p className="text-sm font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Joined</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="bg-gray-50/50 px-8 py-6 flex items-center justify-center border-t border-gray-100">
                            <div className="flex gap-2">
                                {users.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                                            link.active 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                                : link.url 
                                                    ? 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100' 
                                                    : 'bg-transparent text-gray-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
