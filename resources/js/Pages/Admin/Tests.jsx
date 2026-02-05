import AdminLayout from "./Layout";

const tests = [
    { id: 1, title: "IELTS Simulation", description: "Listening test 1", duration: "60 phút", questions: 40 },
    { id: 2, title: "TOEIC Practice", description: "Reading part", duration: "45 phút", questions: 30 },
];

export default function AdminTests() {
    return (
        <AdminLayout current="/admin/tests">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý đề thi</h1>
                    <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Thêm đề thi</button>
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
                                {tests.map((test) => (
                                    <tr key={test.id} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-4 py-3">{test.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{test.title}</td>
                                        <td className="px-4 py-3">{test.description}</td>
                                        <td className="px-4 py-3">{test.duration}</td>
                                        <td className="px-4 py-3">{test.questions}</td>
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
