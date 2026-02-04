import { Head, router } from "@inertiajs/react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";

export default function Take({ test }) {
    if (!test) {
        return (
            <>
                <Head title="Lỗi" />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="alert alert-error">
                        <AlertCircle size={24} />
                        <span>Không tìm thấy đề thi.</span>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => router.visit("/tests")}
                            className="btn btn-primary"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!test.questions || test.questions.length === 0) {
        return (
            <>
                <Head title="Lỗi" />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="alert alert-error">
                        <AlertCircle size={24} />
                        <span>Đề thi này chưa có câu hỏi.</span>
                    </div>
                </div>
            </>
        );
    }

    // Storage Keys
    const STORAGE_KEY_PREFIX = `test_attempt_${test.id}_`;
    const ANSWERS_KEY = `${STORAGE_KEY_PREFIX}answers`;
    const TIME_KEY = `${STORAGE_KEY_PREFIX}time`;
    const SUBMITTED_KEY = `${STORAGE_KEY_PREFIX}submitted`;

    const [currentQuestion, setCurrentQuestion] = useState(0);

    // Initialize state from localStorage or defaults
    const [answers, setAnswers] = useState(() => {
        const saved = localStorage.getItem(ANSWERS_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem(TIME_KEY);
        // Nếu có saved thì dùng, nếu không thì dùng duration gốc
        return saved ? parseInt(saved, 10) : (test.duration || 40) * 60;
    });

    const [isSubmitted, setIsSubmitted] = useState(() => {
        return localStorage.getItem(SUBMITTED_KEY) === 'true';
    });

    const intervalRef = useRef(null);

    // Đảm bảo test.questions luôn là array
    const questions = Array.isArray(test.questions) ? test.questions : [];

    // Nếu không có questions, hiển thị lỗi
    if (questions.length === 0) {
        return (
            <>
                <Head title="Lỗi" />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="alert alert-error">
                        <AlertCircle size={24} />
                        <span>Đề thi này chưa có câu hỏi. Vui lòng quay lại.</span>
                    </div>
                </div>
            </>
        );
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleAnswer = (questionId, optionId) => {
        if (isSubmitted) return;
        const newAnswers = {
            ...answers,
            [questionId]: optionId,
        };
        setAnswers(newAnswers);
        // Save to storage immediately
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(newAnswers));
    };

    const clearStorage = () => {
        localStorage.removeItem(ANSWERS_KEY);
        localStorage.removeItem(TIME_KEY);
        localStorage.removeItem(SUBMITTED_KEY);
    }

    const handleSubmit = () => {
        if (isSubmitted) return;

        // Confirm dialog
        if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Submit to backend
        router.post(
            `/tests/${test.id}/results`,
            { answers },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                    clearStorage();
                },
                onError: (errors) => {
                    console.error('Submit error:', errors);
                    alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
                }
            }
        );
    };

    // Auto submit (no confirm)
    const autoSubmit = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        router.post(
            `/tests/${test.id}/results`,
            { answers },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                    clearStorage();
                },
            }
        );
    }

    // Warn on reload
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isSubmitted) {
                e.preventDefault();
                e.returnValue = "Bạn đang làm bài thi. Nếu tải lại trang, thời gian làm bài vẫn sẽ tiếp tục trôi!";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isSubmitted]);

    // Timer logic
    useEffect(() => {
        if (isSubmitted) return;

        // Start timer
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newValue = prev - 1;

                // Save time every second (or Optimize: every 5-10s if perf needed, but 1s is fine for simple text)
                localStorage.setItem(TIME_KEY, newValue.toString());

                if (newValue <= 0) {
                    // Time's up
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    autoSubmit();
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
    }, [isSubmitted]); // Removed answers/questions from dependency to avoid re-interval

    const goToQuestion = (index) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestion(index);
        }
    };

    const currentQ = questions[currentQuestion];
    const userAnswer = currentQ ? answers[currentQ.id] : undefined;

    // Show loading when submitted (redirecting to results)
    if (isSubmitted) {
        return (
            <>
                <Head title="Đang nộp bài..." />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                        <p className="text-lg">Đang nộp bài và tính điểm...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Làm bài - ${test.title}`} />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Timer and Progress Bar */}
                <div className="card bg-base-100 shadow-xl mb-6 sticky top-4 z-10">
                    <div className="card-body py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock
                                    size={24}
                                    className={`${timeLeft < 300
                                        ? "text-error animate-pulse"
                                        : "text-primary"
                                        }`}
                                />
                                <span
                                    className={`text-2xl font-bold ${timeLeft < 300 ? "text-error" : ""
                                        }`}
                                >
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <div className="flex-1 mx-6 hidden sm:block">
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{
                                            width: `${((test.duration * 60 - timeLeft) /
                                                (test.duration * 60)) *
                                                100
                                                }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-base-content/70">
                                    Câu {currentQuestion + 1}/{questions.length}
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary btn-sm"
                                >
                                    Nộp bài
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-xl lg:sticky lg:top-32">
                            <div className="card-body">
                                <h3 className="card-title text-sm mb-4">
                                    Danh sách câu hỏi
                                </h3>
                                <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                    {questions.map((question, index) => {
                                        const isAnswered =
                                            answers[question.id] !== undefined;
                                        const isCurrent = index === currentQuestion;

                                        return (
                                            <button
                                                key={question.id}
                                                onClick={() =>
                                                    goToQuestion(index)
                                                }
                                                className={`btn btn-sm ${isCurrent
                                                    ? "btn-primary"
                                                    : isAnswered
                                                        ? "btn-success"
                                                        : "btn-ghost"
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="divider"></div>
                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-primary w-full"
                                >
                                    Nộp bài ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                {currentQ ? (
                                    <>
                                        <div className="mb-6">
                                            <span className="badge badge-primary badge-lg mb-4">
                                                Câu {currentQuestion + 1}
                                            </span>
                                            <h2 className="text-2xl font-bold">
                                                {currentQ.question}
                                            </h2>
                                        </div>

                                        <div className="space-y-3">
                                            {currentQ.options && currentQ.options.length > 0 ? (
                                                currentQ.options.map((option) => {
                                                    const isSelected =
                                                        userAnswer === option.id;

                                                    return (
                                                        <button
                                                            key={option.id}
                                                            onClick={() =>
                                                                handleAnswer(
                                                                    currentQ.id,
                                                                    option.id
                                                                )
                                                            }
                                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                                                ? "border-primary bg-primary/10"
                                                                : "border-base-300 hover:border-primary/50"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                                        ? "border-primary bg-primary"
                                                                        : "border-base-300"
                                                                        }`}
                                                                >
                                                                    {isSelected && (
                                                                        <div className="w-3 h-3 rounded-full bg-white"></div>
                                                                    )}
                                                                </div>
                                                                <span className="font-semibold mr-2">
                                                                    {String.fromCharCode(
                                                                        65 + option.id
                                                                    )}.
                                                                </span>
                                                                <span>{option.text}</span>
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="alert alert-warning">
                                                    <span>Câu hỏi này chưa có đáp án.</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="alert alert-error">
                                        <span>Không tìm thấy câu hỏi.</span>
                                    </div>
                                )}

                                <div className="divider"></div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() =>
                                            setCurrentQuestion(
                                                Math.max(0, currentQuestion - 1)
                                            )
                                        }
                                        disabled={currentQuestion === 0}
                                        className="btn btn-outline"
                                    >
                                        ← Câu trước
                                    </button>

                                    <div className="text-sm text-base-content/70 hidden sm:block">
                                        Đã trả lời:{" "}
                                        {Object.keys(answers).length}/
                                        {questions.length}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setCurrentQuestion(
                                                Math.min(
                                                    questions.length - 1,
                                                    currentQuestion + 1
                                                )
                                            )
                                        }
                                        disabled={currentQuestion === questions.length - 1}
                                        className="btn btn-primary"
                                    >
                                        Câu sau →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
