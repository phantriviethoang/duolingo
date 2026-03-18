import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function Show({ test, result, questions }) {

    return (
        <>
            <Head title={`Kết quả - ${test.title}`} />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href="/results"
                    className="btn btn-ghost font-normal text-lg btn-sm gap-2 mb-6"
                >
                    <ArrowLeft size={18} />
                    Quay lại lịch sử
                </Link>

                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body text-center">
                        <h1 className="text-2xl font-bold mb-2">
                            {test.title}
                        </h1>
                        <div className="mb-2">
                            <div className="flex items-center gap-2 justify-center">
                                {result.score >= 70 ? (
                                    <CheckCircle2
                                        size={40}
                                        className="text-success"
                                    />
                                ) : (
                                    <AlertCircle
                                        size={40}
                                        className="text-warning"
                                    />
                                )}
                                <h2 className="text-4xl font-bold">
                                    {result.score}%
                                </h2>
                            </div>
                            <p className="mt-3 text-lg text-base-content/70">
                                Bạn đã trả lời đúng {result.correct}/
                                {result.total} câu hỏi
                            </p>
                            <p className="text-sm text-base-content/60 mt-2">
                                Hoàn thành lúc:{" "}
                                {new Date().toLocaleDateString('en-GB')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chua bai */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Chữa bài chi tiết</h3>
                        <div className="space-y-4">
                            {questions.map((question, index) => {
                                const userAnswerId =
                                    result.answers[question.id];

                                const userOption = question.options.find(
                                    (opt) => opt.id === userAnswerId,
                                );

                                // lay dap an dung
                                const correctOption = question.options.find(
                                    (opt) => opt.is_correct,
                                );

                                // if else check
                                const isCorrect =
                                    userAnswerId === correctOption?.id;

                                return (
                                    <div
                                        key={question.id}
                                        className={`p-4 rounded-lg border-2 ${isCorrect
                                                ? "border-green-200 bg-success/10"
                                                : "border-red-200 bg-error/10"
                                            }`}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <span
                                                className={`text-white rounded-md badge ${isCorrect
                                                        ? "badge-success"
                                                        : "badge-error"
                                                    }`}
                                            >
                                                Câu {index + 1}
                                            </span>
                                            <div className="flex justify-center items-center gap-1 mb-1">
                                                {isCorrect ? (
                                                    <>
                                                        <span className="text-lg mb-1 ml-2">
                                                            Đúng
                                                        </span>
                                                        <CheckCircle2
                                                            size={20}
                                                            className="text-success mb-1"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-lg mb-1 ml-2">
                                                            Sai
                                                        </span>
                                                        <AlertCircle
                                                            size={20}
                                                            className="text-error mb-1"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-semibold mb-3">
                                            {question.question}
                                        </p>

                                        <div className="space-y-2 mb-3">
                                            {/* map lua chon */}
                                            {question.options.map(
                                                (option, optIndex) => {
                                                    // cau tra loi cua nguoi dung
                                                    const isUserAnswer =
                                                        option.id ===
                                                        userAnswerId;

                                                    // cau tra loi dung
                                                    const isCorrectAnswer =
                                                        option.is_correct;

                                                    return (
                                                        <div
                                                            key={option.id}
                                                            className={`p-2 rounded ${isCorrectAnswer
                                                                    ? "bg-success/15 border border-success/50"
                                                                    : isUserAnswer
                                                                        ? "bg-error/15 border border-error/50"
                                                                        : "bg-base-200"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {isCorrectAnswer && (
                                                                    <CheckCircle2
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-success"
                                                                    />
                                                                )}
                                                                {isUserAnswer &&
                                                                    !isCorrectAnswer && (
                                                                        <AlertCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="text-error"
                                                                        />
                                                                    )}
                                                                <span
                                                                    className={`${isCorrectAnswer ? "font-semibold text-green-500" : ""}`}
                                                                >
                                                                    {String.fromCharCode(
                                                                        65 +
                                                                        optIndex,
                                                                    )}
                                                                    .{" "}
                                                                    {
                                                                        option.text
                                                                    }
                                                                </span>
                                                                {isUserAnswer && (
                                                                    <span className="badge badge-sm">
                                                                        Bạn chọn
                                                                    </span>
                                                                )}
                                                                {isCorrectAnswer && (
                                                                    <span className="badge badge-success badge-sm text-[15px]">
                                                                        Đáp án
                                                                        đúng
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>

                                        <div className="mt-3 space-y-2 text-left">
                                            {question.translation && (
                                                <div className="p-3 bg-base-200 rounded border border-red-400">
                                                    <p className="text-sm italic text-base-content/80">
                                                        <span className="font-semibold text-secondary not-italic">
                                                            Dịch câu hỏi:
                                                        </span>{" "}
                                                        {question.translation}
                                                    </p>
                                                </div>
                                            )}

                                            {question.explanation && (
                                                <div className="p-3 bg-success/5 rounded border border-success/70">
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-success">
                                                            Đáp án đúng:
                                                        </span>{" "}
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            )}

                                            {question.detailed_explanation && (
                                                <div className="p-3 bg-info/5 rounded border border-info/80">
                                                    <p className="text-sm">
                                                        <span className="font-semibold text-info">
                                                            Giải thích ngữ pháp:
                                                        </span>{" "}
                                                        {
                                                            question.detailed_explanation
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="card-actions justify-center mt-6">
                            <Link
                                href="/tests"
                                className="btn btn-primary rounded-xl btn-sm"
                            >
                                Làm bài khác
                            </Link>
                            <Link
                                href={`/tests/${test.id}/take`}
                                className="btn btn-outline rounded-xl btn-sm"
                            >
                                Làm lại bài này
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
