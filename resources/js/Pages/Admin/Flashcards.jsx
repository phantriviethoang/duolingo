import AdminLayout from "./Layout";

const flashcards = [
    { id: 1, word: "tomato", topic: "Từ vựng giao tiếp", status: "Đang dùng" },
    { id: 2, word: "appointment", topic: "Từ vựng văn phòng", status: "Nháp" },
    { id: 3, word: "habitat", topic: "Từ vựng về động vật", status: "Đang dùng" },
];

export default function AdminFlashcards() {
    return (
        <AdminLayout current="/admin/flashcards">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý flashcards</h1>
                    <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Thêm flashcard</button>
                </div>

                <div className="rounded-3xl border border-gray-300 bg-white p-6">
                    <div className="overflow-hidden rounded-2xl border border-gray-300">
                        <table className="min-w-full text-left text-sm text-gray-700">
                            <thead className="bg-[#f3f4f6]">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Từ vựng</th>
                                    <th className="px-4 py-3">Chủ đề</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                    <th className="px-4 py-3">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flashcards.map((card) => (
                                    <tr key={card.id} className="odd:bg-white even:bg-gray-50">
                                        <td className="px-4 py-3">{card.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{card.word}</td>
                                       <td className="px-4 py-3">{card.topic}</td>
                                        <td className="px-4 py-3">{card.status}</td>
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
