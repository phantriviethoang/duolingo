import AdminLayout from "./Layout";
import { 
    Users, 
    FileText, 
    CheckCircle, 
    PlayCircle, 
    ArrowUpRight, 
    TrendingUp,
    Clock,
    Calendar
} from "lucide-react";

export default function AdminDashboard({ stats = [], recentResults = [] }) {
    const defaultStats = [
        { label: "Tổng số người dùng", value: "1,284", icon: Users, color: "blue", trend: "+12%" },
        { label: "Tổng đề thi", value: "48", icon: FileText, color: "purple", trend: "+5%" },
        { label: "Tổng bài làm", value: "15,402", icon: CheckCircle, color: "green", trend: "+18%" },
        { label: "Đề thi đang mở", value: "32", icon: PlayCircle, color: "orange", trend: "Ổn định" },
    ];

    const displayStats = stats.length ? stats.map((s, i) => ({
        ...s,
        icon: defaultStats[i]?.icon || FileText,
        color: defaultStats[i]?.color || "blue",
        trend: defaultStats[i]?.trend || "Ổn định"
    })) : defaultStats;

    return (
        <AdminLayout current="/admin">
            <div className="space-y-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hệ thống quản trị</h1>
                    <p className="text-gray-500 mt-1">Tổng quan về hoạt động của LingGo trong 30 ngày qua.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {displayStats.map((item, idx) => {
                        const Icon = item.icon;
                        const colors = {
                            blue: "bg-blue-50 text-blue-600 border-blue-100",
                            purple: "bg-purple-50 text-purple-600 border-purple-100",
                            green: "bg-green-50 text-green-600 border-green-100",
                            orange: "bg-orange-50 text-orange-600 border-orange-100",
                        };
                        return (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl border ${colors[item.color]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {item.trend}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                                <div className="flex items-end gap-2 mt-1">
                                    <p className="text-3xl font-black text-gray-900">{item.value}</p>
                                    <ArrowUpRight className="w-4 h-4 text-gray-300 mb-2 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Bài làm gần đây</h2>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Xem tất cả</button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-white text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4">Người dùng</th>
                                        <th className="px-8 py-4">Đề thi</th>
                                        <th className="px-8 py-4 text-center">Điểm</th>
                                        <th className="px-8 py-4 text-right">Ngày hoàn thành</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                                        <Clock className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-400 font-bold">Chưa có dữ liệu bài làm mới.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentResults.map((row, index) => (
                                            <tr key={row.id || index} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                            {row.user?.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700">{row.user}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">{row.test}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter mt-1">Luyện tập CEFR</p>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                                        row.score >= 80 ? "bg-green-50 text-green-600" : 
                                                        row.score >= 50 ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                                                    }`}>
                                                        {row.score}%
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-bold text-gray-600">{row.completed_at}</span>
                                                        <span className="text-[10px] text-green-500 uppercase font-black tracking-tighter mt-1">Thành công</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Info / Sidebar in Dashboard */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2 leading-tight">Mẹo quản trị nhanh</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6">Bạn có thể quản lý câu hỏi trực tiếp trong phần chỉnh sửa đề thi để tiết kiệm thời gian.</p>
                                <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors">Đi tới Đề thi</button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Trạng thái hệ thống</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-bold text-gray-700">Database</span>
                                    </div>
                                    <span className="text-[10px] font-black text-green-500 uppercase">Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-bold text-gray-700">Storage</span>
                                    </div>
                                    <span className="text-[10px] font-black text-green-500 uppercase">92% Free</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
