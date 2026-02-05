import AdminLayout from "./Layout";

const users = [
    { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", status: "Đang hoạt động" },
    { id: 2, name: "Trần Thị B", email: "thib@example.com", status: "Đang hoạt động" },
    { id: 3, name: "Phạm Văn C", email: "vanc@example.com", status: "Bị khóa" },
];

export default function AdminUsers() {
    return (
        <AdminLayout current="/admin/users">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
                    <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Thêm người dùng</button>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Thêm người dùng</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                            <input className="rounded-2xl border border-gray-300 px-4 py-2" placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" className="rounded-2xl border border-gray-300 px-4 py-2" placeholder="user@example.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                            <select className="rounded-2xl border border-gray-300 px-4 py-2">
                                <option>Đang hoạt động</option>
                                <option>Bị khóa</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Mật khẩu tạm</label>
                            <input type="password" className="rounded-2xl border border-gray-300 px-4 py-2" placeholder="••••••" />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Lưu người dùng</button>
                        <button className="rounded-full border border-gray-400 px-6 py-2 text-sm font-semibold text-gray-700">Làm mới</button>
                    </div>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <div className="overflow-hidden rounded-2xl border border-gray-300">
                        <table className="min-w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f3f4f6]">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tên người dùng</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-4 py-3">{user.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">{user.status}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button className="rounded-full border border-gray-400 px-3 py-1 text-xs">Sửa</button>
                                                <button className="rounded-full border border-gray-400 px-3 py-1 text-xs">Xóa</button>
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
