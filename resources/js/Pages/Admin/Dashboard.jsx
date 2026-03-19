import AdminLayout from "./Layout";
import { Users, FileText, CheckCircle, PlayCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function AdminDashboard({ stats = [], recentResults = [] }) {
    const defaultStats = [
        { label: "Tổng số người dùng", value: "0", icon: Users, color: "blue" },
        { label: "Tổng đề thi", value: "0", icon: FileText, color: "amber" },
        { label: "Tổng bài làm", value: "0", icon: CheckCircle, color: "green" },
        { label: "Đề thi đang mở", value: "0", icon: PlayCircle, color: "indigo" },
    ];

    const displayStats = stats.length ? stats.map((s, i) => ({
        ...s,
        icon: defaultStats[i]?.icon || FileText,
        color: defaultStats[i]?.color || "blue",
    })) : defaultStats;

    const getColorClass = (color) => {
        const colors = {
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            amber: "bg-amber-50 text-amber-600 border-amber-100",
            green: "bg-green-50 text-green-600 border-green-100",
            indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        };
        return colors[color] || colors.blue;
    };

    return (
        <AdminLayout current="/admin">
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard quản trị</h1>
                        <p className="text-gray-500 font-medium mt-1 text-sm">Chào mừng quay trở lại, đây là tổng quan hệ thống LingGo.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/tests" className="btn btn-sm rounded-xl bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm font-bold">
                            Quản lý đề thi
                        </Link>
                        <Link href="/admin/users" className="btn btn-sm rounded-xl bg-blue-600 text-white border-none hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold">
                            Người dùng mới
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {displayStats.map((item, idx) => {
                        const Icon = item.icon;
                        const colorClass = getColorClass(item.color);
                        return (
                            <div key={idx} className="bg-white rounded-4xl border-2 border-gray-50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl border ${colorClass}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hôm nay</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-500">{item.label}</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">{item.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Bài làm gần đây</h2>
                        </div>
                        <Link href="/admin/results" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            Xem tất cả <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="bg-white px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người dùng</th>
                                    <th className="bg-white px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đề thi</th>
                                    <th className="bg-white px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Kết quả</th>
                                    <th className="bg-white px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                    <Clock className="w-10 h-10" />
                                                </div>
                                                <p className="text-gray-400 font-bold text-sm">Chưa có hoạt động nào gần đây.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentResults.map((row) => (
                                        <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-100 shadow-sm">
                                                        {row.user?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-bold text-gray-900">{row.user}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{row.test}</p>
                                                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-[9px] font-black text-gray-500 rounded-md uppercase tracking-widest">Level {row.test?.split(' - ')[0] || '--'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full max-w-[100px] bg-gray-100 rounded-full h-1.5">
                                                        <div
                                                            className={`h-full rounded-full ${row.score >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                                            style={{ width: `${row.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-sm font-black ${row.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {row.score}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-gray-400">{row.completed_at}</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
