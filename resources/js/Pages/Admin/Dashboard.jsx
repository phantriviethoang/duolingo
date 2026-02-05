import AdminLayout from "./Layout";

export default function AdminDashboard({ stats = [], recentResults = [] }) {
    return (
        <AdminLayout current="/admin">
            <div className="space-y-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {(stats.length ? stats : [
                        { label: "Tổng số người dùng", value: "--" },
                        { label: "Tổng đề thi", value: "--" },
                        { label: "Tổng bài làm", value: "--" },
                        { label: "Đề thi đang mở", value: "--" },
                    ]).map((item) => (
                        <div key={item.label} className="rounded-3xl border border-gray-300 bg-[#e5e5e5] px-6 py-8 text-center">
                            <p className="text-sm text-gray-600">{item.label}</p>
                            <p className="mt-4 text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">Bài làm gần đây</h2>
                    <div className="rounded-3xl border border-gray-300 bg-[#d8d8dd] p-6">
                        <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white">
                            <table className="min-w-full text-left text-sm text-gray-700">
                                <thead className="bg-[#f3f3f3] text-gray-900">
                                    <tr>
                                        <th className="px-4 py-3">Người dùng</th>
                                        <th className="px-4 py-3">Đề thi</th>
                                        <th className="px-4 py-3">Điểm</th>
                                        <th className="px-4 py-3">Thời gian</th>
                                        <th className="px-4 py-3">Ngày hoàn thành</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                                Chưa có dữ liệu bài làm.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentResults.map((row, index) => (
                                            <tr key={row.id || index} className={index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"}>
                                                <td className="px-4 py-3">{row.user}</td>
                                                <td className="px-4 py-3">{row.test}</td>
                                                <td className="px-4 py-3 font-semibold">{row.score}</td>
                                                <td className="px-4 py-3">{row.duration ? `${row.duration} phút` : "--"}</td>
                                                <td className="px-4 py-3">{row.completed_at || "--"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
