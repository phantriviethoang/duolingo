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
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl leading-tight">
                            Chinh phục ngoại ngữ <br />
                            <span className="text-blue-600">Dễ dàng hơn bao giờ hết</span>
                        </h1>
                        <p className="mt-8 text-lg font-medium text-slate-600 sm:text-xl leading-relaxed">
                            Hệ thống luyện thi và học tập ngoại ngữ theo chuẩn khung tham chiếu CEFR.
                            Lộ trình bài bản, đánh giá chi tiết và kho đề thi phong phú.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link href="/path/level" className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 shadow-lg transition-transform hover:scale-105">
                                Bắt đầu ngay
                            </Link>
                            <Link href="/progress/dashboard" className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg transition-transform hover:scale-105">
                                Xem tiến độ
                            </Link>
                        </div>
                    </div>
                </div>

                <section className="py-16">
                    <div className="mx-auto max-w-5xl px-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-900">Khóa học Online nổi bật</h2>
                        <p className="mt-2 text-sm text-gray-600">Hiện có {stats.tests ?? "--"} đề thi để bạn luyện tập.</p>
                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            {fallbackCourses.map((course) => (
                                <div
                                    key={course.id ?? course.title}
                                    className="rounded-4xl border border-gray-300 bg-gray-100 px-6 py-24 text-lg font-semibold text-gray-700"
                                >
                                    {course.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
                Footer
            </footer> */}
            </div>
        </AuthenticatedLayout>
    );
}
