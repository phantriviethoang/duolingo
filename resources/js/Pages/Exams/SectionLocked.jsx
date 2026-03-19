import { Head, Link } from "@inertiajs/react";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Layout from "@/Layouts/Layout";

export default function SectionLocked({ exam, requested_section, last_completed_section, next_available_section }) {
    return (
        <Layout>
            <Head title="Section bị khóa" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-yellow-500">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <Lock className="w-16 h-16 text-yellow-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Phần này còn bị khóa
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                        Bạn đang cố gắng truy cập <strong>Phần {requested_section}</strong> của bộ đề <strong>"{exam.title}"</strong>
                    </p>

                    {/* Progress info */}
                    <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-700">Tiến độ của bạn:</span>
                            <span className="font-bold text-yellow-600">Phần {last_completed_section}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Phần có sẵn:</span>
                            <span className="font-bold text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Phần {next_available_section}
                            </span>
                        </div>
                    </div>

                    {/* Call to action */}
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {last_completed_section === 0
                            ? "Bạn cần hoàn thành Phần 1 trước khi có thể tiếp tục."
                            : `Bạn phải hoàn thành Phần ${next_available_section - 1} với điểm yêu cầu trước khi mở khóa Phần ${next_available_section}.`
                        }
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        {next_available_section > 1 && last_completed_section > 0 && (
                            <Link
                                href={`/tests/${exam.id}/take?section=${next_available_section}`}
                                className="btn btn-primary w-full"
                            >
                                Về Phần {next_available_section}
                            </Link>
                        )}
                        {last_completed_section === 0 && (
                            <Link
                                href={`/tests/${exam.id}/take?section=1`}
                                className="btn btn-primary w-full"
                            >
                                Bắt đầu Phần 1
                            </Link>
                        )}
                        <Link
                            href={`/tests/${exam.id}`}
                            className="btn btn-outline w-full flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại chi tiết bộ đề
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
