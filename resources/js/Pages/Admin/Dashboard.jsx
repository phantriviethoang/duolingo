import AdminLayout from "./Layout";
import { Users, FileText, CheckCircle, PlayCircle } from "lucide-react";

export default function AdminDashboard({ stats = [], recentResults = [] }) {
    const defaultStats = [
        { label: "Tổng số người dùng", value: "0", icon: Users },
        { label: "Tổng đề thi", value: "0", icon: FileText },
        { label: "Tổng bài làm", value: "0", icon: CheckCircle },
        { label: "Đề thi đang mở", value: "0", icon: PlayCircle },
    ];

    const displayStats = stats.length ? stats.map((s, i) => ({
        ...s,
        icon: defaultStats[i]?.icon || FileText,
    })) : defaultStats;

    return (
        <AdminLayout current="/admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Dashboard quản trị</h1>
                    <p className="text-sm text-base-content/70">Tổng quan nhanh hệ thống.</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {displayStats.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="stat rounded-lg border border-base-300 bg-base-100">
                                <div className="stat-figure text-base-content/60">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="stat-title">{item.label}</div>
                                <div className="stat-value text-2xl">{item.value}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-0">
                        <div className="border-b border-base-300 px-4 py-3">
                            <h2 className="font-semibold">Bài làm gần đây</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Đề thi</th>
                                        <th>Điểm</th>
                                        <th>Ngày hoàn thành</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-sm text-base-content/60">
                                                Chưa có dữ liệu.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentResults.map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.user}</td>
                                                <td>{row.test}</td>
                                                <td>{row.score}%</td>
                                                <td>{row.completed_at}</td>
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
