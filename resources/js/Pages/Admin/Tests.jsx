import { router, Link } from "@inertiajs/react";
import AdminLayout from "./Layout";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminTests({ tests = [], filters = {} }) {
    const handleDelete = (testId) => {
        if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
        router.delete(route("tests.destroy", testId), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout current="/admin/tests">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Quản lý đề thi</h1>
                        <p className="text-sm text-base-content/70">
                            {filters.level || filters.part
                                ? `Đang lọc theo: ${filters.level ? `Trình độ ${filters.level}` : ''} ${filters.part ? ` - Phần ${filters.part}` : ''}`
                                : 'Danh sách tất cả các bài thi trên hệ thống.'
                            }
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {(filters.level || filters.part) && (
                            <button
                                onClick={() => router.get(route('admin.tests'))}
                                className="btn btn-sm btn-ghost"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                        <Link
                            href={route("tests.create")}
                            className="btn btn-sm btn-primary flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm đề thi mới
                        </Link>
                    </div>
                </div>

                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Đề thi</th>
                                        <th>Trình độ</th>
                                        <th>Thời gian</th>
                                        <th>Số câu</th>
                                        <th className="text-right">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tests.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-sm text-base-content/60">
                                                Chưa có đề thi.
                                            </td>
                                        </tr>
                                    ) : (
                                        tests.map((test) => (
                                            <tr key={test.id}>
                                                <td>
                                                    <p className="font-medium">{test.title}</p>
                                                    <p className="text-xs text-base-content/60">{test.description}</p>
                                                </td>
                                                <td>
                                                    Level {test.level} - Part {test.part}
                                                </td>
                                                <td>{test.duration} phút</td>
                                                <td>{test.total_questions}</td>
                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={route("tests.edit", test.id)}
                                                            className="btn btn-xs btn-ghost"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(test.id)}
                                                            className="btn btn-xs btn-ghost text-error"
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
            </div>
        </AdminLayout>
    );
}
