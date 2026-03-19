import { useForm, router, Link } from "@inertiajs/react";
import AdminLayout from "./Layout";
import { Plus, Edit2, Trash2, Search, Filter, BookOpen } from "lucide-react";

export default function AdminTests({ tests = [] }) {
    const handleDelete = (testId) => {
        if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
        router.delete(route("tests.destroy", testId), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout current="/admin/tests">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý đề thi</h1>
                        <p className="text-gray-500 mt-1">Danh sách tất cả các bài thi trên hệ thống.</p>
                    </div>
                    <Link 
                        href={route("tests.create")} 
                        className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-2xl px-6 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm đề thi mới
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm tên đề thi..." 
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all">
                            <Filter className="w-4 h-4" />
                            Bộ lọc
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Đề thi</th>
                                    <th className="px-8 py-5">Trình độ</th>
                                    <th className="px-8 py-5 text-center">Thời gian</th>
                                    <th className="px-8 py-5 text-center">Câu hỏi</th>
                                    <th className="px-8 py-5 text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                                    <BookOpen className="w-8 h-8 text-gray-300" />
                                                </div>
                                                <p className="text-gray-400 font-bold">Chưa có đề thi nào trong danh sách.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => (
                                        <tr key={test.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                                                        {test.id}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-black text-gray-900 leading-tight">{test.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{test.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">Level {test.level}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Part {test.part}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                                    {test.duration}p
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center text-sm font-bold text-gray-700">
                                                {test.total_questions} câu
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link 
                                                        href={route("tests.edit", test.id)} 
                                                        className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(test.id)}
                                                        className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
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
