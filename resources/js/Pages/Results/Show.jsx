import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Clock,
    BarChart2,
    Check,
    X,
    Minus,
    ChevronRight,
    MessageSquare,
    PartyPopper,
} from "lucide-react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import confetti from "canvas-confetti";

export default function ResultsShow({ result }) {
    const {
        test,
        answers,
        score,
        correct_count,
        wrong_count,
        skipped_count,
        total_count,
        accuracy,
        pass_threshold,
        is_passed_requirement,
    } = result;

    useEffect(() => {
        if (is_passed_requirement) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 30,
                spread: 360,
                ticks: 60,
                zIndex: 0,
            };

            const randomInRange = (min, max) =>
                Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Since particles fall down, start a bit higher than random
                confetti({
                    ...defaults,
                    particleCount,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [is_passed_requirement]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            // second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatTimeSpent = (seconds) => {
        if (!seconds) return "N/A";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [
            h > 0 ? h : null,
            m.toString().padStart(2, "0"),
            s.toString().padStart(2, "0"),
        ]
            .filter(Boolean)
            .join(":");
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Kết quả: ${test.title}`} />

            <div className="min-h-screen bg-gray-50/50 py-10">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-8">
                        <Link
                            href={route("results.index")}
                            className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Quay lại lịch sử
                        </Link>

                        <div className="flex items-center gap-6">
                            {is_passed_requirement && (
                                <div className="hidden sm:flex items-center gap-2 text-amber-500">
                                    <PartyPopper className="w-6 h-6" />
                                    <span className="font-black text-sm uppercase tracking-widest">
                                        Chúc mừng! Bạn đã vượt qua!
                                    </span>
                                </div>
                            )}
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold ${is_passed_requirement
                                        ? "bg-green-50 border-green-200 text-green-700 shadow-sm shadow-green-100"
                                        : "bg-red-50 border-red-200 text-red-700 shadow-sm shadow-red-100"
                                    }`}
                            >
                                {is_passed_requirement ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>
                                            ĐÃ ĐẠT (Yêu cầu: {pass_threshold}%)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="w-5 h-5" />
                                        <span>
                                            CHƯA ĐẠT (Yêu cầu: {pass_threshold}
                                            %)
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-3">
                                {(wrong_count > 0 || skipped_count > 0) && (
                                    <Link
                                        href={route("path.test.take", {
                                            level: test.level,
                                            test: test.id,
                                            retake_wrong: 1,
                                            result_id: result.id,
                                        })}
                                        className="btn btn-error btn-sm rounded-lg text-white font-bold"
                                    >
                                        Làm lại câu sai
                                    </Link>
                                )}
                                <Link
                                    href={route("path.test.take", {
                                        level: test.level,
                                        test: test.id,
                                    })}
                                    className="btn btn-outline btn-sm rounded-lg font-bold"
                                >
                                    Làm lại tất cả
                                </Link>
                                <Link
                                    href={route("path.levels")}
                                    className="btn btn-primary btn-sm rounded-lg font-bold"
                                >
                                    Làm bài khác
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-gray-900 leading-tight">
                            Kết quả luyện tập: {test.title}
                        </h1>
                        <div className="flex gap-2 mt-3">
                            <span className="badge badge-warning text-white font-bold py-3 px-4 rounded-lg">
                                Level {test.level}
                            </span>
                            <span className="badge badge-warning text-white font-bold py-3 px-4 rounded-lg">
                                Part {test.part}
                            </span>
                        </div>
                    </div>

                    {/* Result Summary Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                        {/* Summary Column */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-indigo-50 p-3 rounded-xl">
                                    <BarChart2 className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        Kết quả
                                    </p>
                                    <p className="text-xl font-black text-gray-900">
                                        {correct_count}/{total_count}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-purple-50 p-3 rounded-xl">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        Thời gian làm
                                    </p>
                                    <p className="text-xl font-black text-gray-900">
                                        {formatTimeSpent(result.time_spent)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-amber-50 p-3 rounded-xl">
                                    <BarChart2 className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        Độ chính xác
                                    </p>
                                    <p className="text-xl font-black text-gray-900">
                                        {accuracy}%
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-rose-50 p-3 rounded-xl">
                                    <BarChart2 className="w-6 h-6 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        Ngưỡng yêu cầu
                                    </p>
                                    <p className="text-xl font-black text-gray-900">
                                        ≥ {pass_threshold}%
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                        Ngày hoàn thành
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-900">
                                        {formatDate(result.completed_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Grid */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                    <BarChart2 className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="text-blue-600 font-bold text-lg">
                                    Điểm số
                                </p>
                                <p className="text-4xl font-black text-gray-900 mt-2">
                                    {score}%
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    trên 100%
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <p className="text-green-600 font-bold text-lg">
                                    Trả lời đúng
                                </p>
                                <p className="text-4xl font-black text-gray-900 mt-2">
                                    {correct_count}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    câu hỏi
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <X className="w-8 h-8 text-red-500" />
                                </div>
                                <p className="text-red-600 font-bold text-lg">
                                    Trả lời sai
                                </p>
                                <p className="text-4xl font-black text-gray-900 mt-2">
                                    {wrong_count}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    câu hỏi
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Minus className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-500 font-bold text-lg">
                                    Bỏ qua
                                </p>
                                <p className="text-4xl font-black text-gray-900 mt-2">
                                    {skipped_count}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    câu hỏi
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 flex items-center">
                                <ChevronRight className="w-6 h-6 text-indigo-600 mr-2" />
                                Phân tích chi tiết bài làm
                            </h2>
                        </div>

                        <div className="p-8 space-y-10">
                            {test.questions?.map((question, index) => {
                                const userAnswerId = answers[question.id];
                                const correctOption = question.answers.find(
                                    (opt) => opt.is_correct,
                                );
                                const isCorrect =
                                    userAnswerId === correctOption?.id;
                                const hasUserAnswer =
                                    userAnswerId !== undefined &&
                                    userAnswerId !== null;

                                return (
                                    <div key={question.id} className="relative">
                                        {/* Question Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <span
                                                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${!hasUserAnswer
                                                        ? "bg-gray-400"
                                                        : isCorrect
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                            >
                                                {index + 1}
                                            </span>

                                            <div className="flex-1 pt-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`text-xs font-bold uppercase tracking-widest ${!hasUserAnswer
                                                                ? "text-gray-400"
                                                                : isCorrect
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                    >
                                                        {!hasUserAnswer
                                                            ? "Bỏ qua"
                                                            : isCorrect
                                                                ? "Đúng"
                                                                : "Sai"}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900 leading-relaxed">
                                                    {question.question_text}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-14 mb-6">
                                            {question.answers?.map(
                                                (answer, optIndex) => {
                                                    const isUserAnswer =
                                                        answer.id ===
                                                        userAnswerId;
                                                    const isCorrectAnswer =
                                                        answer.is_correct;

                                                    let stateClass =
                                                        "bg-gray-50 border-gray-100 text-gray-600";
                                                    if (isCorrectAnswer)
                                                        stateClass =
                                                            "bg-green-50 border-green-200 text-green-700 font-bold ring-2 ring-green-500 ring-offset-1";
                                                    else if (isUserAnswer)
                                                        stateClass =
                                                            "bg-red-50 border-red-200 text-red-700 font-bold";

                                                    return (
                                                        <div
                                                            key={answer.id}
                                                            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="opacity-50 text-sm">
                                                                    {String.fromCharCode(
                                                                        65 +
                                                                        optIndex,
                                                                    )}
                                                                    .
                                                                </span>
                                                                <span>
                                                                    {
                                                                        answer.answer_text
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {isCorrectAnswer ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                ) : null}

                                                                {isUserAnswer ? (
                                                                    <span className="text-[10px] uppercase font-black bg-white/50 px-2 py-0.5 rounded-full">
                                                                        Bạn chọn
                                                                    </span>
                                                                ) : null}

                                                                {isUserAnswer &&
                                                                    !isCorrectAnswer ? (
                                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>

                                        <div className="ml-14 space-y-3">
                                            {question.translation && (
                                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                                    <p className="text-sm text-indigo-900">
                                                        <span className="font-black uppercase text-[10px] tracking-widest mr-2 opacity-50">
                                                            Dịch câu:
                                                        </span>
                                                        {question.translation}
                                                    </p>
                                                </div>
                                            )}

                                            {(question.explanation ||
                                                question.detailed_explanation) && (
                                                    <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                                        <div className="flex items-start gap-2">
                                                            <MessageSquare className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-black uppercase text-amber-800 tracking-widest mb-1">
                                                                    Giải thích & Ngữ
                                                                    pháp:
                                                                </p>
                                                                <p className="text-sm text-amber-900 leading-relaxed">
                                                                    {
                                                                        question.explanation
                                                                    }
                                                                    {question.detailed_explanation && (
                                                                        <span className="block mt-2 pt-2 border-t border-amber-200/50">
                                                                            {
                                                                                question.detailed_explanation
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        {index < test.questions.length - 1 && (
                                            <div className="h-px bg-gray-100 my-10 ml-14"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Next Part Suggestion */}
                    {is_passed_requirement && (
                        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl shadow-lg border-2 border-emerald-200 p-8 md:p-12">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shrink-0">
                                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-emerald-900 font-black text-2xl md:text-3xl mb-2">
                                        🚀 Phần tiếp theo chờ bạn!
                                    </p>
                                    <p className="text-emerald-700 text-base md:text-lg leading-relaxed">
                                        Bạn đã hoàn thành <span className="font-bold">Phần {test.part}</span> tại trình độ <span className="font-bold">{test.level}</span> với kết quả xuất sắc. Tiếp tục với <span className="font-bold">Phần {test.part + 1}</span> để nâng cao kỹ năng!
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('path.parts', { level: test.level })}
                                    className="btn btn-lg bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-2xl font-black text-base md:text-lg px-8"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                    Làm Phần {test.part + 1}
                                </Link>
                                <Link
                                    href={route('path.levels')}
                                    className="btn btn-lg btn-outline border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 rounded-2xl font-bold text-base md:text-lg"
                                >
                                    Xem lộ trình
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
