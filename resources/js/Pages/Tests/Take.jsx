import { Head, Link, router, usePage } from "@inertiajs/react";
import { Clock, ChevronLeft, AlertCircle, CheckCircle2, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Layout from "@/Layouts/Layout";

export default function Take({ test }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const intervalRef = useRef(null);

    const questions = Array.isArray(test?.questions) ? test.questions : [];

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const [timeLeft, setTimeLeft] = useState((test?.duration || 40) * 60);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Lưu/Restore đáp án từ localStorage
    const storageKey = `test_${test?.id}_${test?.retake_wrong ? 'retake' : 'normal'}_answers`;

    // Load đáp án từ localStorage khi component mount
    useEffect(() => {
        if (!test?.id) return;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setSelectedAnswers(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading saved answers:', error);
        }
    }, [test?.id]);

    // Lưu đáp án vào localStorage khi có thay đổi
    useEffect(() => {
        if (!test?.id || isSubmitted || Object.keys(selectedAnswers).length === 0) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(selectedAnswers));
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    }, [selectedAnswers, test?.id, isSubmitted]);

    // Cảnh báo khi back, F5, hoặc đóng tab nếu đã chọn đáp án
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSubmitted || Object.keys(selectedAnswers).length === 0) {
                return;
            }
            e.preventDefault();
            e.returnValue = 'Bạn đang làm bài thi. Nếu rời đi, tiến độ của bạn sẽ được lưu và có thể khôi phục lại. Bạn có chắc chắn muốn rời khỏi?';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSubmitted, selectedAnswers]);

    // Guard clauses
    if (!test) {
        return (
            <Layout>
                <Head title="Lỗi" />
                <div className="flex items-center justify-center py-20">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-red-500">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Không tìm thấy đề thi
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Đề thi này không tồn tại hoặc đã bị xóa.
                        </p>
                        <button
                            onClick={() => router.visit("/tests")}
                            className="btn btn-primary w-full"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (questions.length === 0) {
        return (
            <Layout>
                <Head title="Lỗi" />
                <div className="flex items-center justify-center py-20">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border-l-4 border-yellow-500">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Đề thi chưa sẵn sàng
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Đề thi này chưa có câu hỏi. Vui lòng liên hệ quản trị viên.
                        </p>
                        <button
                            onClick={() => router.visit("/tests")}
                            className="btn btn-primary w-full"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Utility functions
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
        if (isSubmitted) return;
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
        if (isSubmitted) return;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        router.post(
            `/tests/${test.id}/results`,
            { 
                answers: selectedAnswers,
                retake_wrong: test.retake_wrong,
                previous_result_id: test.previous_result_id
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Xóa đáp án khỏi localStorage sau khi nộp bài thành công
                    try {
                        localStorage.removeItem(storageKey);
                    } catch (error) {
                        console.error('Error clearing saved answers:', error);
                    }
                    setIsSubmitted(true);
                },
                onError: (errors) => {
                    console.error("Submit error:", errors);
                    alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
                },
            },
        );
    };

    const autoSubmit = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        router.post(
            `/tests/${test.id}/results`,
            { 
                answers: selectedAnswers,
                retake_wrong: test.retake_wrong,
                previous_result_id: test.previous_result_id
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                },
            },
        );
    };

    // Timer logic
    useEffect(() => {
        if (isSubmitted) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newValue = prev - 1;

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
    const answeredCount = Object.values(selectedAnswers).filter(v => v !== undefined && v !== null).length;

    if (isSubmitted) {
        return (
            <Layout>
                <Head title="Đang nộp bài..." />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Đang nộp bài...
                            </h2>
                            <p className="text-gray-600">
                                Vui lòng đợi trong giây lát
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const question = questions[currentQuestion];

    return (
        <Layout>
            <Head title={`Làm đề thi: ${test.title}`} />
            <div className="min-h-screen bg-gray-50">
                {/* Fixed Header */}
                <div className="sticky top-24 z-40 bg-white shadow border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
                        {/* Left: Title & Progress */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {test.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Câu {currentQuestion + 1}/{questions.length}
                            </p>
                        </div>

                        {/* Center: Answer Count */}
                        <div className="text-center">
                            <p className="text-xs text-gray-600 uppercase">Đã trả lời</p>
                            <p className="text-lg font-bold text-blue-600">
                                {answeredCount}/{questions.length}
                            </p>
                        </div>

                        {/* Right: Timer */}
                        <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                            <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
                            <span className="font-bold text-lg">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
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

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Question Panel */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
                                {/* Question Text */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-blue-600 mb-3">
                                        Câu {currentQuestion + 1}/{questions.length}
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {question.question}
                                    </h3>
                                    {question.translation && (
                                        <p className="text-sm text-gray-600 italic">
                                            ({question.translation})
                                        </p>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="space-y-3 mb-8">
                                    {question.options && (
                                        Array.isArray(question.options)
                                            ? question.options.map((option, index) => (
                                                <label
                                                    key={option.id}
                                                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={option.id}
                                                        checked={selectedAnswers[question.id] === option.id}
                                                        onChange={() => handleAnswerSelect(question.id, option.id)}
                                                        className="w-4 h-4"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {String.fromCharCode(65 + index)}. {option.text}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))
                                            : Object.entries(question.options).map(([key, value], index) => (
                                                <label
                                                    key={key}
                                                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={key}
                                                        checked={selectedAnswers[question.id] === key}
                                                        onChange={() => handleAnswerSelect(question.id, key)}
                                                        className="w-4 h-4"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {String.fromCharCode(65 + index)}. {value}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))
                                    )}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentQuestion === 0}
                                        className="btn btn-outline flex-1 disabled:opacity-50"
                                    >
                                        ← Câu trước
                                    </button>
                                    {currentQuestion < questions.length - 1 ? (
                                        <button
                                            onClick={handleNext}
                                            className="btn btn-primary flex-1"
                                        >
                                            Câu tiếp theo →
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowSubmitConfirm(true)}
                                            className="btn btn-success flex-1"
                                        >
                                            <Send className="w-4 h-4" />
                                            Nộp bài
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Question Navigator Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-96">
                                <h3 className="font-bold text-gray-900 mb-4">Danh sách câu hỏi</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, index) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurrentQuestion(index)}
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

                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs text-gray-600 mb-2">
                                        <span className="inline-block w-3 h-3 rounded border-2 border-gray-300 mr-2"></span>
                                        Chưa trả lời
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        <span className="inline-block w-3 h-3 rounded bg-green-100 border-2 border-green-500 mr-2"></span>
                                        Đã trả lời
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showSubmitConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Xác nhận nộp bài?
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Bạn đã trả lời <span className="font-bold">{answeredCount}/{questions.length}</span> câu
                            </p>
                            {answeredCount < questions.length && (
                                <p className="text-yellow-600 text-sm mb-4">
                                    ⚠️ Còn {questions.length - answeredCount} câu chưa được trả lời
                                </p>
                            )}
                            <p className="text-gray-600 text-sm mb-6">
                                Bạn không thể quay lại để sửa câu trả lời sau khi nộp bài.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="btn btn-outline flex-1"
                                >
                                    Tiếp tục làm bài
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-success flex-1"
                                >
                                    Nộp bài
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
