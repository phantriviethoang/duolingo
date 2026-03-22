import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Home({ featuredCourses = [], stats = {} }) {
    const fallbackCourses = featuredCourses.length
        ? featuredCourses
        : [
            { id: 1, title: "Khóa học 1" },
            { id: 2, title: "Khóa học 2" },
            { id: 3, title: "Khóa học 3" },
        ];

    return (
        <AuthenticatedLayout>
            <Head title="Home" />
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-2xl mt-20">
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl leading-tight">
                            Chinh phục ngoại ngữ <br />
                            <span className="text-blue-600">Dễ dàng hơn bao giờ hết</span>
                        </h1>
                        <p className="mt-8 text-lg font-medium text-slate-600 sm:text-xl leading-relaxed">
                            Hệ thống luyện thi và học tập ngoại ngữ theo chuẩn khung tham chiếu CEFR.
                            Lộ trình bài bản, đánh giá chi tiết và kho đề thi phong phú.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link href="/path" className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 shadow-lg transition-transform hover:scale-105">
                                Bắt đầu ngay
                            </Link>
                            <Link href="/progress/dashboard" className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105">
                                Xem tiến độ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
