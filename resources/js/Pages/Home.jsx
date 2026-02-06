// import Layout from "../Layouts/Layout";

import { Link } from "@inertiajs/react";

export default function Home({ featuredCourses = [], stats = {} }) {
    const fallbackCourses = featuredCourses.length
        ? featuredCourses
        : [
            { id: 1, title: "Khóa học 1" },
            { id: 2, title: "Khóa học 2" },
            { id: 3, title: "Khóa học 3" },
        ];

    return (
        <div className="min-h-screen bg-white">
            <section className="bg-[#cfe8ff] py-16 text-center text-gray-900">
                <div className="mx-auto max-w-4xl px-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-700">
                        Chào mừng bạn đến với LingGo!!!
                    </p>
                    <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                        Chúc bạn có trải nghiệm học tập hiệu quả với LingGo.
                    </h1>
                    <p className="mt-3 text-lg font-semibold">
                        Hãy bắt đầu học tập ngay hôm nay.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link href="/tests" className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white">
                            Đề thi online
                        </Link>
                        <Link href="/flashcards" className="rounded-full border border-black px-8 py-3 text-sm font-semibold text-black">
                            Học flashcards
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Khóa học Online nổi bật</h2>
                    <p className="mt-2 text-sm text-gray-600">Hiện có {stats.tests ?? "--"} đề thi và {stats.flashcards ?? "--"} flashcard để bạn luyện tập.</p>
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
    );
}

// Home.layout = (page) => <Layout children={page} />;

// export default Home;
