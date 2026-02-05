import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Clock, ChevronLeft, ChevronRight, Send, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Take({ test }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // LocalStorage keys
    const ANSWERS_KEY = `test_${test?.id}_answers`;
    const TIME_KEY = `test_${test?.id}_time`;
    const SUBMITTED_KEY = `test_${test?.id}_submitted`;

    const intervalRef = useRef(null);

    // Ensure test.questions is always an array
    const questions = Array.isArray(test?.questions) ? test.questions : [];

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const saved = localStorage.getItem(ANSWERS_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem(TIME_KEY);
        return saved ? parseInt(saved, 10) : (test?.duration || 40) * 60;
    });

    const [isSubmitted, setIsSubmitted] = useState(() => {
        return localStorage.getItem(SUBMITTED_KEY) === 'true';
    });

    // Guard clauses
    if (!test) {
        return (
            <>
                <Head title="Lỗi" />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đề thi</h2>
                            <p className="text-gray-600 mb-6">Đề thi này không tồn tại hoặc đã bị xóa.</p>
                            <button
                                onClick={() => router.visit("/tests")}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (questions.length === 0) {
        return (
            <>
                <Head title="Lỗi" />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đề thi chưa sẵn sàng</h2>
                            <p className="text-gray-600 mb-6">Đề thi này chưa có câu hỏi. Vui lòng liên hệ quản trị viên.</p>
                            <button
                                onClick={() => router.visit("/tests")}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Utility functions
    const clearStorage = () => {
        localStorage.removeItem(ANSWERS_KEY);
        localStorage.removeItem(TIME_KEY);
        localStorage.removeItem(SUBMITTED_KEY);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (questionId, answerId) => {
        if (isSubmitted) return;
        const newAnswers = {
            ...selectedAnswers,
            [questionId]: answerId,
        };
        setSelectedAnswers(newAnswers);
        localStorage.setItem(ANSWERS_KEY, JSON.stringify(newAnswers));
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
        if (isSubmitted) return;

        if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        router.post(
            `/tests/${test.id}/results`,
            { answers: selectedAnswers },
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

    const autoSubmit = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        router.post(
            `/tests/${test.id}/results`,
            { answers: selectedAnswers },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                    clearStorage();
                },
            }
        );
    };

    // Warn on page reload
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

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newValue = prev - 1;
                localStorage.setItem(TIME_KEY, newValue.toString());

                if (newValue <= 0) {
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
    }, [isSubmitted]);

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    if (isSubmitted) {
        return (
            <>
                <Head title="Đang nộp bài..." />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang nộp bài...</h2>
                            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const question = questions[currentQuestion];

    return (
        <>
            <Head title={`Làm đề thi: ${test.title}`} />
            <div className="min-h-screen bg-white">
                <div className="border-b border-gray-200">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Link href="/tests" className="flex items-center gap-2 text-sm underline">
                                <ChevronLeft className="h-4 w-4" />
                                Thoát
                            </Link>
                            <span className="font-semibold">{test.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Clock className="h-5 w-5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:flex-row">
                    {/* Question panel */}
                    <div className="flex-1 rounded-4xl border border-gray-300 bg-[#f4f4f7] p-8">
                        <p className="text-lg font-semibold text-gray-700 mb-4">Câu {currentQuestion + 1}:</p>
                        <p className="text-gray-800 text-lg leading-relaxed mb-6">{question.question}</p>

                        <div className="space-y-3">
                            {question.options?.map((option, index) => (
                                <label key={option.id} className="flex items-center gap-3 text-lg text-gray-800">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option.id}
                                        checked={selectedAnswers[question.id] === option.id}
                                        onChange={() => handleAnswerSelect(question.id, option.id)}
                                        className="h-5 w-5"
                                    />
                                    <span>{String.fromCharCode(65 + index)}. {option.text}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center justify-between text-sm text-gray-600">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="rounded-full border border-gray-400 px-6 py-2 font-semibold disabled:opacity-50"
                            >
                                Câu trước
                            </button>
                            <span>
                                Câu {currentQuestion + 1} / {questions.length}
                            </span>
                            <button
                                onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
                                className={`rounded-full px-6 py-2 font-semibold ${currentQuestion === questions.length - 1 ? 'bg-[#f87171] text-white' : 'border border-gray-400'}`}
                            >
                                {currentQuestion === questions.length - 1 ? 'Nộp bài' : 'Câu tiếp theo'}
                            </button>
                        </div>
                    </div>

                    {/* Timer & navigation panel */}
                    <div className="w-full max-w-sm rounded-4xl border border-gray-300 p-6">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Clock className="h-5 w-5" />
                            <span>Thời gian: {formatTime(timeLeft)}</span>
                        </div>

                        <div className="mt-6 grid grid-cols-5 gap-3">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${currentQuestion === index
                                        ? 'border-black bg-black text-white'
                                        : selectedAnswers[q.id]
                                            ? 'border-gray-900 bg-gray-900/70 text-white'
                                            : 'border-gray-400 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="mt-8 w-full rounded-full bg-[#f87171] py-3 text-lg font-semibold text-white"
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
