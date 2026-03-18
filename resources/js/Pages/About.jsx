import React from "react";

function About() {
    return (
        <div className="min-h-screen bg-base-100">

            {/* Hero */}
            <div className="hero bg-base-200 py-20">
                <div className="hero-content text-center">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-bold">Về Nền Tảng Của Chúng Tôi</h1>
                        <p className="py-6">
                            Nền tảng luyện thi trắc nghiệm tiếng Anh của chúng tôi giúp
                            học sinh rèn luyện ngữ pháp, từ vựng và kỹ năng đọc thông qua
                            hàng ngàn câu hỏi tương tác.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission */}
            <section className="max-w-5xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold mb-6 text-center">Sứ Mệnh Của Chúng Tôi</h2>

                <p className="text-center text-gray-500">
                    Chúng tôi hướng đến việc giúp việc ôn thi tiếng Anh trở nên dễ dàng,
                    thông minh và dễ tiếp cận hơn cho mọi học sinh. Hệ thống cung cấp
                    các bài thi mô phỏng thực tế, chấm điểm ngay lập tức và giải thích chi tiết.
                </p>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto py-16 px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Những Gì Chúng Tôi Cung Cấp
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Bài Thi Luyện Tập</h3>
                            <p>
                                Hàng ngàn câu hỏi trắc nghiệm bao gồm ngữ pháp,
                                từ vựng và đọc hiểu.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Phản Hồi Ngay Lập Tức</h3>
                            <p>
                                Nhận kết quả và lời giải chi tiết ngay sau khi hoàn thành bài thi.
                            </p>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow">
                        <div className="card-body">
                            <h3 className="card-title">Theo Dõi Tiến Độ</h3>
                            <p>
                                Theo dõi kết quả học tập theo thời gian và tập trung vào
                                các điểm yếu để cải thiện nhanh hơn.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default About;
