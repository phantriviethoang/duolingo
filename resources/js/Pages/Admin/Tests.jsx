import { useForm, router } from "@inertiajs/react";
import AdminLayout from "./Layout";

export default function AdminTests({ tests = [] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        duration: 60,
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tests.store"), {
            preserveScroll: true,
            onSuccess: () => reset("title", "description"),
        });
    };

    const handleDelete = (testId) => {
        if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;
        router.delete(route("tests.destroy", testId), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout current="/admin/tests">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý đề thi</h1>
                    <a href={route("tests.create")} className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Thêm đề thi</a>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <div className="overflow-hidden rounded-2xl border border-gray-300">
                        <table className="min-w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f3f4f6]">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tiêu đề</th>
                                    <th className="px-4 py-3">Mô tả</th>
                                    <th className="px-4 py-3">Thời gian</th>
                                    <th className="px-4 py-3">Số câu hỏi</th>
                                    <th className="px-4 py-3">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                            Chưa có đề thi nào.
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => (
                                        <tr key={test.id} className="odd:bg-white even:bg-gray-50">
                                            <td className="px-4 py-3">{test.id}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{test.title}</td>
                                            <td className="px-4 py-3">{test.description}</td>
                                            <td className="px-4 py-3">{test.duration} phút</td>
                                            <td className="px-4 py-3">{test.total_questions}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <a href={route("tests.edit", test.id)} className="rounded-full border border-gray-400 px-3 py-1 text-xs hover:bg-gray-50">
                                                        Sửa
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(test.id)}
                                                        className="rounded-full border border-gray-400 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Xóa
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
