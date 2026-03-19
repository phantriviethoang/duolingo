import { router, Link } from "@inertiajs/react";
import AdminLayout from "./Layout";
import { Plus, Edit2, Trash2, Search, Filter, Clock, FileQuestion } from "lucide-react";

export default function AdminTests({ tests = [], filters = {} }) {
    const handleDelete = (testId) => {
        if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
        router.delete(route("tests.destroy", testId), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout current="/admin/tests">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý đề thi</h1>
                        <p className="text-gray-500 font-medium mt-1">
                            {filters.level || filters.part
                                ? `Đang lọc: ${filters.level ? `Trình độ ${filters.level}` : ''} ${filters.part ? ` - Phần ${filters.part}` : ''}`
                                : 'Danh sách tất cả các bài thi trên hệ thống.'
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {(filters.level || filters.part) && (
                            <button
                                onClick={() => router.get(route('admin.tests'))}
                                className="btn btn-ghost btn-sm rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                        <Link
                            href={route("tests.create")}
                            className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20 gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm đề thi mới
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border-2 border-gray-50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thông tin đề thi</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Phân loại</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cấu hình</th>
                                    <th className="bg-white px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                    <FileQuestion className="w-10 h-10" />
                                                </div>
                                                <p className="text-gray-400 font-bold">Chưa có đề thi nào phù hợp.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => (
                                        <tr key={test.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                            <td className="px-8 py-6">
                                                <div className="max-w-2xl">
                                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{test.title}</p>
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-medium">{test.description || 'Không có mô tả.'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                                                        Level {test.level}
                                                    </span>
                                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                                                        Part {test.part}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <Clock className="w-4 h-4 text-amber-500" />
                                                        {test.duration} phút
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                        <FileQuestion className="w-4 h-4 text-blue-500" />
                                                        {test.total_questions} câu
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route("tests.edit", test.id)}
                                                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(test.id)}
                                                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
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
