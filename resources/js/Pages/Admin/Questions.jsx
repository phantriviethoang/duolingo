import AdminLayout from "./Layout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminQuestions() {
    const { questions = [] } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const { delete: destroy } = useForm();

    const filteredQuestions = questions.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.test.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
            destroy(route("questions.destroy", id));
        }
    };

    return (
        <AdminLayout current="/admin/questions">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý câu hỏi</h1>
                    <Link
                        href={route("questions.create")}
                        className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white"
                    >
                        Thêm câu hỏi
                    </Link>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-gray-300 px-4 py-2 text-sm"
                        />
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-gray-300">
                        <table className="min-w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f3f4f6]">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Đề thi</th>
                                    <th className="px-4 py-3">Câu hỏi</th>
                                    <th className="px-4 py-3">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.length > 0 ? (
                                    filteredQuestions.map((item) => (
                                        <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                                            <td className="px-4 py-3">{item.id}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.test}</td>
                                            <td className="px-4 py-3 max-w-md truncate" title={item.question_full}>
                                                {item.question}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route("questions.edit", item.id)}
                                                        className="rounded-full border border-gray-400 px-3 py-1 text-xs hover:bg-gray-50"
                                                    >
                                                        Sửa
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-full border border-gray-400 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            Không tìm thấy câu hỏi nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
