import { Head, router, usePage } from "@inertiajs/react";
import { Clock, AlertCircle, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";
import AppHeader from "../../Components/AppHeader";

export default function Take({
    test,
    exam,
    quiz: incomingQuiz,
    questions: incomingQuestions,
    submitRoute: incomingSubmitRoute,
    section = null,
    question: _1,
    retake_wrong: _2,
    previous_result_id: _3,
}) {
    const { url } = usePage();
    const quiz = incomingQuiz || test || exam;
    const questions = Array.isArray(incomingQuestions)
        ? incomingQuestions
        : test?.questions || [];

    const levelFromUrl = url.match(/\/path\/([A-Z]\d+)\//)?.[1] || quiz?.level;
    const submitRoute =
        incomingSubmitRoute ||
        (levelFromUrl
            ? `/path/${levelFromUrl}/test-${quiz?.id}/submit`
            : "/path/level");

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const intervalRef = useRef(null);
    const submitLockRef = useRef(false);
    const autoSubmittedRef = useRef(false);

    const sectionSuffix = section ? `_sec_${section.order}` : "";
    const storageKey = `quiz_${quiz?.id}${sectionSuffix}_answers`;
    const storageStartTimeKey = `quiz_${quiz?.id}${sectionSuffix}_startTime`;
    const parsedDuration = Number(quiz?.duration);
    const quizDurationMinutes =
        Number.isFinite(parsedDuration) && parsedDuration > 0
            ? parsedDuration
            : 40;
    const quizDurationSeconds = Math.floor(quizDurationMinutes * 60);

    const [timeLeft, setTimeLeft] = useState(quizDurationSeconds);

    useEffect(() => {
        if (!quiz?.id) return;
        try {
            const saved = localStorage.getItem(storageKey);
            const parsedSavedAnswers = saved ? JSON.parse(saved) : {};
            const hasSavedAnswers =
                parsedSavedAnswers &&
                typeof parsedSavedAnswers === "object" &&
                Object.keys(parsedSavedAnswers).length > 0;

            if (saved) {
                setSelectedAnswers(parsedSavedAnswers);
            }

            const now = Date.now();
            const startTimeExists = localStorage.getItem(storageStartTimeKey);
            const parsedStartTime = startTimeExists
                ? parseInt(startTimeExists, 10)
                : NaN;

            const shouldResetSession =
                !hasSavedAnswers &&
                Number.isFinite(parsedStartTime) &&
                parsedStartTime > 0 &&
                Math.floor((now - parsedStartTime) / 1000) >=
                quizDurationSeconds;

            if (
                !startTimeExists ||
                !Number.isFinite(parsedStartTime) ||
                parsedStartTime <= 0 ||
                shouldResetSession
            ) {
                localStorage.setItem(storageStartTimeKey, now.toString());
                setTimeLeft(quizDurationSeconds);
            } else {
                const timeUsed = Math.floor((now - parsedStartTime) / 1000);
                const remaining = Math.max(0, quizDurationSeconds - timeUsed);
                setTimeLeft(remaining);
            }
        } catch (error) {
            console.error("Error loading saved data:", error);
            setTimeLeft(quizDurationSeconds);
        }
    }, [quiz?.id, storageKey, storageStartTimeKey, quizDurationSeconds]);

    useEffect(() => {
        if (
            !quiz?.id ||
            isSubmitting ||
            Object.keys(selectedAnswers).length === 0
        )
            return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(selectedAnswers));
        } catch (error) {
            console.error("Error saving answers:", error);
        }
    }, [selectedAnswers, quiz?.id, isSubmitting, storageKey]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSubmitting || Object.keys(selectedAnswers).length === 0) {
                return;
            }
            e.preventDefault();
            e.returnValue =
                "Bạn đang làm bài thi. Nếu rời đi, tiến độ sẽ được lưu. Bạn có chắc chắn?";
            return e.returnValue;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isSubmitting, selectedAnswers]);

    // if (!quiz) {
    //     return (
    //         <Layout>
    //             <Head title="Lỗi" />
    //             <div className="flex items-center justify-center py-20">
    //                 <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-red-500">
    //                     <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    //                     <h2 className="text-xl font-bold text-gray-900 mb-2">
    //                         Không tìm thấy đề thi
    //                     </h2>
    //                     <p className="text-gray-600 mb-6">
    //                         Đề thi này không tồn tại hoặc đã bị xóa.
    //                     </p>
    //                     <button
    //                         onClick={() => router.visit("/path/level")}
    //                         className="btn btn-primary w-full"
    //                     >
    //                         Quay lại danh sách
    //                     </button>
    //                 </div>
    //             </div>
    //         </Layout>
    //     );
    // }

    // if (questions.length === 0) {
    //     return (
    //         <Layout>
    //             <Head title="Lỗi" />
    //             <div className="flex items-center justify-center py-20">
    //                 <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-yellow-500">
    //                     <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
    //                     <h2 className="text-xl font-bold text-gray-900 mb-2">
    //                         Đề thi chưa sẵn sàng
    //                     </h2>
    //                     <p className="text-gray-600 mb-6">
    //                         Đề thi này chưa có câu hỏi. Vui lòng liên hệ quản
    //                         trị viên.
    //                     </p>
    //                     <button
    //                         onClick={() => router.visit("/path/level")}
    //                         className="btn btn-primary w-full"
    //                     >
    //                         Quay lại danh sách
    //                     </button>
    //                 </div>
    //             </div>
    //         </Layout>
    //     );
    // }

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAnswerSelect = (questionId, answerId) => {
        if (isSubmitting) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        if (isSubmitting || submitLockRef.current) return;

        submitLockRef.current = true;
        setIsSubmitting(true);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const payload = section
            ? { section_order: section.order, answers: selectedAnswers }
            : { answers: selectedAnswers };

        const visit = router.post(submitRoute, payload, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                try {
                    localStorage.removeItem(storageKey);
                    localStorage.removeItem(storageStartTimeKey);
                } catch (error) {
                    console.error("Error clearing saved data:", error);
                }
            },
            onError: (errors) => {
                console.error("Submit error:", errors);
                setIsSubmitting(false);
                submitLockRef.current = false;
                alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
            },
            onFinish: () => {
                setIsSubmitting(false);
                submitLockRef.current = false;
            },
        });

        if (visit && typeof visit.catch === "function") {
            visit.catch((error) => {
                if (
                    error?.code === "ERR_CANCELED" ||
                    error?.message === "Request aborted"
                ) {
                    return;
                }
                console.error("Unexpected submit request error:", error);
            });
        }
    };

    const autoSubmit = () => {
        if (isSubmitting || submitLockRef.current) return;

        submitLockRef.current = true;
        setIsSubmitting(true);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const payload = section
            ? { section_order: section.order, answers: selectedAnswers }
            : { answers: selectedAnswers };

        const visit = router.post(submitRoute, payload, {
            preserveScroll: true,
            preserveState: false,
            onSuccess: () => {
                try {
                    localStorage.removeItem(storageKey);
                    localStorage.removeItem(storageStartTimeKey);
                } catch (error) {
                    console.error("Error clearing saved data:", error);
                }
            },
            onError: (errors) => {
                console.error("Auto submit error:", errors);
                setIsSubmitting(false);
                submitLockRef.current = false;
                autoSubmittedRef.current = false;
                alert(
                    "Có lỗi xảy ra khi tự động nộp bài. Vui lòng thử nộp lại.",
                );
            },
            onFinish: () => {
                setIsSubmitting(false);
                submitLockRef.current = false;
            },
        });

        if (visit && typeof visit.catch === "function") {
            visit.catch((error) => {
                if (
                    error?.code === "ERR_CANCELED" ||
                    error?.message === "Request aborted"
                ) {
                    return;
                }
                console.error("Unexpected auto submit request error:", error);
            });
        }
    };

    useEffect(() => {
        if (isSubmitting) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newValue = prev - 1;
                if (newValue <= 0) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return 0;
                }
                return newValue;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isSubmitting]);

    useEffect(() => {
        if (isSubmitting) return;
        if (timeLeft > 0) return;
        if (autoSubmittedRef.current) return;

        autoSubmittedRef.current = true;
        autoSubmit();
    }, [timeLeft, isSubmitting]);

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const answeredCount = Object.values(selectedAnswers).filter(
        (v) => v !== undefined && v !== null,
    ).length;
    const question = questions[currentQuestion];

    return (
        <>
            <Head title={`Làm đề thi: ${quiz.title}`} />
            <AppHeader />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="sticky top-24 z-40 bg-white shadow border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {quiz.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                {section ? `Phần ${section.order} - ` : ""}
                                Câu {currentQuestion + 1}/{questions.length}
                            </p>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-600 uppercase">
                                Đã trả lời
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                                {answeredCount}/{questions.length}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div
                                className={`flex items-center gap-2 ${timeLeft < 60 ? "text-red-600" : "text-gray-700"}`}
                            >
                                <Clock
                                    className={`w-5 h-5 ${timeLeft < 60 ? "animate-pulse" : ""}`}
                                />
                                <span className="font-bold text-lg">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowSubmitConfirm(true)}
                                disabled={isSubmitting}
                                className="btn btn-success btn-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Đang nộp...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Nộp Bài
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-2">
                        <div className="max-w-6xl mx-auto">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-blue-600 mb-3">
                                        Câu {currentQuestion + 1}/
                                        {questions.length}
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {question.question}
                                    </h3>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {question.options &&
                                        (Array.isArray(question.options)
                                            ? question.options.map(
                                                (option, index) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option.id}
                                                            checked={
                                                                selectedAnswers[
                                                                question
                                                                    .id
                                                                ] ===
                                                                option.id
                                                            }
                                                            onChange={() =>
                                                                handleAnswerSelect(
                                                                    question.id,
                                                                    option.id,
                                                                )
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">
                                                                {String.fromCharCode(
                                                                    65 +
                                                                    index,
                                                                )}
                                                                .{" "}
                                                                {option.text}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ),
                                            )
                                            : Object.entries(
                                                question.options,
                                            ).map(([key, value], index) => (
                                                <label
                                                    key={key}
                                                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={key}
                                                        checked={
                                                            selectedAnswers[
                                                            question.id
                                                            ] === key
                                                        }
                                                        onChange={() =>
                                                            handleAnswerSelect(
                                                                question.id,
                                                                key,
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {String.fromCharCode(
                                                                65 + index,
                                                            )}
                                                            . {value}
                                                        </p>
                                                    </div>
                                                </label>
                                            )))}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentQuestion === 0}
                                        className="btn btn-outline flex-1 disabled:opacity-70"
                                    >
                                        ← Câu trước
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={
                                            currentQuestion ===
                                            questions.length - 1
                                        }
                                        className="btn btn-primary flex-1 disabled:opacity-70"
                                    >
                                        Câu tiếp theo →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-96 space-y-6">
                                <h3 className="font-bold text-gray-900">
                                    Danh sách câu hỏi
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, index) => (
                                        <button
                                            key={q.id}
                                            onClick={() =>
                                                setCurrentQuestion(index)
                                            }
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-all border-2 ${currentQuestion === index
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : selectedAnswers[q.id]
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm space-y-2">
                                    <p className="text-gray-600">
                                        <span className="inline-block w-3 h-3 rounded border-2 border-gray-300 mr-2"></span>
                                        Chưa trả lời
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="inline-block w-3 h-3 rounded bg-green-100 border-2 border-green-500 mr-2"></span>
                                        Đã trả lời
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showSubmitConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Xác nhận nộp bài?
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Bạn đã trả lời{" "}
                                <span className="font-bold">
                                    {answeredCount}/{questions.length}
                                </span>{" "}
                                câu
                            </p>
                            {/* {answeredCount < questions.length && (
                                <p className="text-yellow-600 text-sm mb-4">
                                    ⚠️ Còn {questions.length - answeredCount}{" "}
                                    câu chưa được trả lời
                                </p>
                            )} */}
                            {/* <p className="text-gray-600 text-sm mb-6">
                                Bạn không thể quay lại để sửa câu trả lời sau
                                khi nộp bài.
                            </p> */}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitConfirm(false)}
                                    disabled={isSubmitting}
                                    className="btn btn-outline flex-1 disabled:opacity-50"
                                >
                                    Tiếp tục làm bài
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="btn btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Đang nộp...
                                        </>
                                    ) : (
                                        "Nộp bài"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
