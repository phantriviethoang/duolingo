// import Layout from "../Layouts/Layout";

import { Link } from "@inertiajs/react";

export default function Home() {
    return (
        <>
            <section className="min-h-[60vh] bg-base-100 flex items-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            LUYỆN ĐỀ THI KHÔNG GIỚI HẠN
                        </h1>

                        <ul className="space-y-4 text-base md:text-lg">
                            <li className="flex items-start gap-3">
                                <span>
                                    Kho đề thi phong phú:
                                    <strong> IELTS, TOEIC</strong>, ...
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span>
                                    Giao diện đơn giản, dễ thao tác, phù hợp cho
                                    việc học từ vựng.
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span>
                                    Nội dung đa dạng, từ cơ bản đến nâng cao.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-center">
                <Link href="">
                    <button className="btn btn-secondary">Tham gia ngay</button>
                </Link>
            </div>
        </>
    );
}

// Home.layout = (page) => <Layout children={page} />;

// export default Home;
