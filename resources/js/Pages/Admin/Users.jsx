import AdminLayout from "./Layout";
import { UserPlus, Search, Shield, ShieldOff, MoreHorizontal, Mail, Calendar, UserCheck } from "lucide-react";

const users = [
    { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", status: "Đang hoạt động", role: "student", joined: "12/03/2024" },
    { id: 2, name: "Trần Thị B", email: "thib@example.com", status: "Đang hoạt động", role: "student", joined: "15/03/2024" },
    { id: 3, name: "Phạm Văn C", email: "vanc@example.com", status: "Bị khóa", role: "admin", joined: "01/01/2024" },
];

export default function AdminUsers() {
    return (
        <AdminLayout current="/admin/users">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý người dùng</h1>
                        <p className="text-gray-500 mt-1">Quản lý tài khoản và phân quyền hệ thống.</p>
                    </div>
                    <button className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-2xl px-6 flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <UserPlus className="w-5 h-5" />
                        Thêm người dùng
                    </button>
                </div>

                {/* Search & Actions */}
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm theo tên hoặc email..." 
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Người dùng</th>
                                    <th className="px-8 py-5">Vai trò</th>
                                    <th className="px-8 py-5">Trạng thái</th>
                                    <th className="px-8 py-5">Ngày tham gia</th>
                                    <th className="px-8 py-5 text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                                user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                                {user.role === 'admin' ? 'Quản trị' : 'Học viên'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.2 w-1.5 h-1.5 rounded-full ${user.status === 'Đang hoạt động' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-bold ${user.status === 'Đang hoạt động' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                {user.joined}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
