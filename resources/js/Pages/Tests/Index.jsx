import { Head, Link } from "@inertiajs/react";
import { Clock, Users, Info, Play } from "lucide-react";

export default function Index({ tests = [], flash, error }) {
    return (
        <>
            <Head title="Đề thi online" />
            <div className="bg-white">
                <section className="bg-[#cfe8ff] py-12">
                    <div className="container mx-auto px-4 text-center text-gray-900">
                        <h1 className="mt-4 text-3xl font-bold">Đề thi online LingGo</h1>
                        <p className="mt-4 text-lg font-semibold">
                            Chọn đề thi phù hợp và bắt đầu luyện tập ngay hôm nay.
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Các bài thi được cập nhật liên tục, giúp bạn tự tin hơn trong mọi kỳ thi tiếng Anh.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-10">
                    <div className="mb-10 grid gap-4 rounded-3xl border border-gray-200 bg-white/80 p-6 text-gray-800 md:grid-cols-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Thời lượng</p>
                            <p className="mt-1 text-sm text-gray-500">Thời gian tiêu chuẩn theo đề thi thật.</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Cấp độ</p>
                            <p className="mt-2 text-md font-semibold">TOEIC · Grammar</p>
                            <p className="mt-1 text-sm text-gray-500">Đa dạng mức độ từ cơ bản đến nâng cao.</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hướng dẫn</p>
                            <p className="mt-2 text-md font-semibold">Đọc mô tả đề thi trước khi bắt đầu.</p>
                            <p className="mt-1 text-sm text-gray-500">Nhấn “Bắt đầu thi” để vào phòng thi.</p>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    )}

                    {!tests || tests.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                            <p className="text-lg font-semibold text-gray-700">Chưa có đề thi nào được mở.</p>
                            <p className="mt-2 text-sm text-gray-500">Hãy quay lại sau để thấy các bài thi mới nhất.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tests.map((test) => (
                                <div key={test.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                                    {test.description && (
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{test.description}</p>
                                    )}

                                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span>
                                                {test.duration} phút · {test.total_questions} câu hỏi
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} />
                                            <span>
                                                {test.attempts?.toLocaleString?.() ?? 0} lượt làm
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2 text-xs text-gray-500">
                                            <Info size={14} className="mt-0.5" />
                                            <span>Đề thi chuẩn hóa, phù hợp luyện tập trước khi thi thật.</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/tests/${test.id}`}
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white"
                                    >
                                        <Play size={16} />
                                        Bắt đầu thi
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
