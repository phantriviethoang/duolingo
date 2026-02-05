import AdminLayout from "./Layout";

const questions = [
    { id: 1, test: "IELTS Simulation", question: "She ____ to school every day.", difficulty: "Dễ", status: "Đang dùng" },
    { id: 2, test: "TOEIC Practice", question: "Choose the correct synonym of 'rapid'.", difficulty: "Trung bình", status: "Nháp" },
    { id: 3, test: "Grammar Test", question: "Rewrite the sentence using passive voice.", difficulty: "Khó", status: "Đang dùng" },
];

export default function AdminQuestions() {
    return (
        <AdminLayout current="/admin/questions">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý câu hỏi</h1>
                    <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Thêm câu hỏi</button>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <div className="overflow-hidden rounded-2xl border border-gray-300">
                        <table className="min-w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f3f4f6]">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Đề thi</th>
                                    <th className="px-4 py-3">Câu hỏi</th>
                                    <th className="px-4 py-3">Độ khó</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-4 py-3">{item.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.test}</td>
                                        <td className="px-4 py-3">{item.question}</td>
                                        <td className="px-4 py-3">{item.difficulty}</td>
                                        <td className="px-4 py-3">{item.status}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button className="rounded-full border border-gray-400 px-3 py-1 text-xs">Sửa</button>
                                                <button className="rounded-full border border-gray-400 px-3 py-1 text-xs">Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
