import AdminLayout from "./Layout";

const stats = [
    { label: "Tổng số người dùng", value: 1200 },
    { label: "Tổng đề thi", value: 86 },
    { label: "Tổng bài làm", value: 4300 },
    { label: "Đang hoạt động", value: 254 },
];

const recentTests = [
    { user: "Nguyễn Văn A", test: "IELTS Simulation", score: "8.0", time: "45 phút", date: "05/02/2026" },
    { user: "Trần Thị B", test: "TOEIC Practice", score: "750", time: "60 phút", date: "04/02/2026" },
    { user: "Lê Văn C", test: "Grammar Test", score: "92", time: "30 phút", date: "03/02/2026" },
];

export default function AdminDashboard() {
    return (
        <AdminLayout current="/admin">
            <div className="space-y-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item) => (
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
                                    {recentTests.map((row, index) => (
                                        <tr key={row.user} className={index % 2 === 0 ? "bg-white" : "bg-[#f8f8f8]"}>
                                            <td className="px-4 py-3">{row.user}</td>
                                            <td className="px-4 py-3">{row.test}</td>
                                            <td className="px-4 py-3 font-semibold">{row.score}</td>
                                            <td className="px-4 py-3">{row.time}</td>
                                            <td className="px-4 py-3">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
