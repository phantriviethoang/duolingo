import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResultsShow({ result }) {
    const { test, answers, score } = result;

    return (
        <>
            <Head title={`Kết quả - ${test.title}`} />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link
                    href={route('results.index')}
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
                                {score >= 70 ? (
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
                                    {score}%
                                </h2>
                            </div>
                            <p className="mt-3 text-lg text-base-content/70">
                                Bạn đã trả lời đúng {result.correct || 0}/
                                {result.total || test.questions?.length || 0} câu hỏi
                            </p>
                            <p className="text-sm text-base-content/60 mt-2">
                                Hoàn thành lúc:{" "}
                                {new Date(result.completed_at).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chua bai */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title mb-4">Chữa bài chi tiết</h3>
                        <div className="space-y-4">
                            {test.questions?.map((question, index) => {
                                const userAnswerId = answers[question.id];
                                
                                // Guard clause - kiểm tra answers có tồn tại không
                                if (!question.answers || !Array.isArray(question.answers)) {
                                    console.warn('Question answers is undefined:', question);
                                    return null;
                                }
                                
                                const userOption = question.answers.find((opt) => opt.id === userAnswerId);
                                const correctOption = question.answers.find((opt) => opt.is_correct);
                                const isCorrect = userAnswerId === correctOption?.id;
                                const hasUserAnswer = userAnswerId !== undefined && userAnswerId !== null;

                                return (
                                    <div
                                        key={question.id}
                                        className={`p-4 rounded-lg border-2 ${!hasUserAnswer
                                                ? "border-gray-200 bg-gray-50"
                                                : isCorrect
                                                    ? "border-green-200 bg-success/10"
                                                    : "border-red-200 bg-error/10"
                                            }`}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <span
                                                className={`text-white rounded-md badge ${!hasUserAnswer
                                                        ? "badge-neutral"
                                                        : isCorrect
                                                            ? "badge-success"
                                                            : "badge-error"
                                                    }`}
                                            >
                                                Câu {index + 1}
                                            </span>
                                            <div className="flex justify-center items-center gap-1 mb-1">
                                                {!hasUserAnswer ? (
                                                    <>
                                                        <span className="text-lg mb-1 ml-2">
                                                            Chưa chọn
                                                        </span>
                                                        <AlertCircle
                                                            size={20}
                                                            className="text-gray-500 mb-1"
                                                        />
                                                    </>
                                                ) : isCorrect ? (
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
                                            {question.question_text}
                                        </p>

                                        <div className="space-y-2 mb-3">
                                            {question.answers?.map((answer, optIndex) => {
                                                const isUserAnswer = answer.id === userAnswerId;
                                                const isCorrectAnswer = answer.is_correct;

                                                return (
                                                    <div
                                                        key={answer.id}
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
                                                                    size={16}
                                                                    className="text-success"
                                                                />
                                                            )}
                                                            {isUserAnswer && !isCorrectAnswer && (
                                                                <AlertCircle
                                                                    size={16}
                                                                    className="text-error"
                                                                />
                                                            )}
                                                            <span className={isCorrectAnswer ? "font-semibold text-green-500" : ""}>
                                                                {String.fromCharCode(65 + optIndex)}.{" "}
                                                                {answer.answer_text}
                                                            </span>
                                                            {isUserAnswer && (
                                                                <span className="badge badge-sm">
                                                                    Bạn chọn
                                                                </span>
                                                            )}
                                                            {isCorrectAnswer && (
                                                                <span className="badge badge-success badge-sm text-[15px]">
                                                                    Đáp án đúng
                                                                </span>
                                                            )}
                                                            {!hasUserAnswer && !isCorrectAnswer && optIndex === 0 && (
                                                                <span className="badge badge-neutral badge-sm">
                                                                    Bạn chưa chọn
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
                                                        {question.detailed_explanation}
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
                                href={route('tests.index')}
                                className="btn btn-primary rounded-xl btn-sm"
                            >
                                Làm bài khác
                            </Link>
                            <Link
                                href={route('tests.show', test.id)}
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
