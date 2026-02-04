import { Head, Link } from "@inertiajs/react";
import { Calendar, Trophy, ArrowLeft } from "lucide-react";

export default function Index({ results }) {
    return (
        <>
            <Head title="Lịch sử làm bài" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Lịch sử làm bài</h1>
                    <p className="text-base-content/70">
                        Xem lại kết quả và chữa bài các đề đã làm
                    </p>
                </div>

                {results.length === 0 ? (
                    <div className="text-center py-12">
                        <Trophy size={80} className="mx-auto text-base-content/30 mb-4" />
                        <p className="text-lg text-base-content/70 mb-4">
                            Bạn chưa làm bài thi nào
                        </p>
                        <Link href="/tests" className="btn btn-primary">
                            Bắt đầu luyện thi
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((result) => (
                            <div
                                key={result.id}
                                className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow"
                            >
                                <div className="card-body">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h2 className="card-title text-lg mb-2">
                                                {result.test_title}
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm text-base-content/70">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    <span>{result.completed_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`text-3xl font-bold mb-1 ${result.score >= 70
                                                        ? 'text-success'
                                                        : result.score >= 50
                                                            ? 'text-warning'
                                                            : 'text-error'
                                                    }`}
                                            >
                                                {result.score}%
                                            </div>
                                            <div className="badge badge-outline">
                                                {result.score >= 70
                                                    ? 'Đạt'
                                                    : 'Chưa đạt'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <Link
                                            href={`/results/${result.id}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Xem chi tiết & chữa bài
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
