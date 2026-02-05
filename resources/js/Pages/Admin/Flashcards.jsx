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
                    <h2 className="text-lg font-semibold text-gray-900">Tạo flashcard mới</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Từ vựng</label>
                            <input className="rounded-2xl border border-gray-300 px-4 py-2" placeholder="tomato" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Chủ đề</label>
                            <input className="rounded-2xl border border-gray-300 px-4 py-2" placeholder="Từ vựng giao tiếp" />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Nghĩa/ghi chú</label>
                            <textarea className="rounded-2xl border border-gray-300 px-4 py-2" rows={3} placeholder="(noun) /təˈmɑːtəʊ/"></textarea>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Trạng thái</label>
                            <select className="rounded-2xl border border-gray-300 px-4 py-2">
                                <option>Đang dùng</option>
                                <option>Nháp</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button className="rounded-full bg-[#2d8bfb] px-6 py-2 text-sm font-semibold text-white">Lưu flashcard</button>
                        <button className="rounded-full border border-gray-400 px-6 py-2 text-sm font-semibold text-gray-700">Làm mới</button>
                    </div>
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
