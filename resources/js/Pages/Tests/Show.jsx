import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAutoSave } from '@/Hooks/useAutoSave';

export default function TestsShow({ test }) {
    const intervalRef = useRef(null);

    // Phần làm bài - không có result ở đây
    const questions = Array.isArray(test?.questions) ? test.questions : [];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState((test?.duration || 40) * 60);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startTime] = useState(Date.now());
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Dùng useAutoSave hook có sẵn - chỉ cho answers
    const { isSaving, lastSavedAt, error, getStoredAnswers, clearStoredAnswers } = useAutoSave(
        selectedAnswers,
        test?.id,
        1, // sectionOrder mặc định là 1
        30000 // 30 seconds
    );

    // Custom storage cho toàn bộ state
    const storageKey = `test_${test?.id}_full_state`;

    // Lưu toàn bộ state vào localStorage
    const saveFullState = useCallback(() => {
        try {
            const fullState = {
                selectedAnswers,
                currentQuestion,
                timeLeft,
                startTime,
                lastSaved: Date.now(), // Thời điểm lưu lần cuối
                testId: test?.id
            };
            localStorage.setItem(storageKey, JSON.stringify(fullState));
            console.log('Saved full state to localStorage with timestamp');
        } catch (err) {
            console.error('Failed to save full state:', err);
        }
    }, [selectedAnswers, currentQuestion, timeLeft, startTime, test?.id, storageKey]);

    // Lấy full state từ localStorage
    const getFullState = useCallback(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (err) {
            console.error('Failed to read full state:', err);
            return null;
        }
    }, [storageKey]);

    // Xóa full state
    const clearFullState = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            console.log('Cleared full state from localStorage');
        } catch (err) {
            console.error('Failed to clear full state:', err);
        }
    }, [storageKey]);

    // State cho thông báo khôi phục tiến độ
    const [showRestoreNotification, setShowRestoreNotification] = useState(false);

    // Lưu state ban đầu ngay khi component mount (chỉ 1 lần)
    useEffect(() => {
        if (!isSubmitted) {
            const existingState = getFullState();
            if (!existingState || existingState.testId !== test?.id) {
                // Chỉ lưu nếu chưa có state hoặc khác testId
                saveFullState();
            }
        }
    }, [isSubmitted, saveFullState, getFullState, test?.id]);

    // Khôi phục toàn bộ state khi component mount
    useEffect(() => {
        const fullState = getFullState();
        if (fullState && fullState.testId === test?.id) {
            // Tính thời gian đã trôi qua từ LẦN LƯU CUỐI CÙNG
            const elapsedSinceLastSave = Math.floor((Date.now() - fullState.lastSaved) / 1000);

            // Thời gian còn lại = thời gian còn lại lúc lưu - thời gian đã trôi qua
            const adjustedTimeLeft = Math.max(0, fullState.timeLeft - elapsedSinceLastSave);

            console.log('Time calculation:', {
                lastSaved: new Date(fullState.lastSaved),
                now: new Date(),
                elapsedSinceLastSave: elapsedSinceLastSave,
                savedTimeLeft: fullState.timeLeft,
                adjustedTimeLeft: adjustedTimeLeft
            });

            setTimeLeft(adjustedTimeLeft);
            setSelectedAnswers(fullState.selectedAnswers || {});
            setCurrentQuestion(fullState.currentQuestion || 0);

            // Chỉ hiển thị thông báo nếu có đáp án đã chọn
            if (Object.keys(fullState.selectedAnswers || {}).length > 0) {
                setShowRestoreNotification(true);
                setTimeout(() => setShowRestoreNotification(false), 5000);
            }
        }
    }, [getFullState, test?.id]);

    // Auto-save full state mỗi 10 giây
    useEffect(() => {
        if (isSubmitted) return;

        const autoSaveInterval = setInterval(() => {
            saveFullState();
        }, 10000); // 10 seconds

        return () => clearInterval(autoSaveInterval);
    }, [saveFullState, isSubmitted]);

    // Cảnh báo trước khi refresh/đóng tab
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!isSubmitted) {
                // Luôn lưu state trước khi unload
                saveFullState();

                // Chỉ cảnh báo nếu user đã bắt đầu làm bài (có thời gian trôi qua)
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                if (elapsedSeconds > 5) { // Cảnh báo nếu làm bài hơn 5 giây
                    const message = 'Bạn có chắc muốn rời đi? Tiến độ làm bài sẽ được lưu.';
                    event.returnValue = message;
                    return message;
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [selectedAnswers, isSubmitted, saveFullState, startTime]);

    // Xóa localStorage khi nộp bài thành công
    const clearProgress = () => {
        clearStoredAnswers();
        clearFullState();
        console.log('Cleared all saved progress after submit');
    };

    // Utility functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

        if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Tính điểm trước khi submit
        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach(question => {
            const userAnswerId = selectedAnswers[question.id];

            // Guard clause - kiểm tra answers có tồn tại không
            if (!question.answers || !Array.isArray(question.answers)) {
                console.warn('Question answers is undefined:', question);
                return;
            }

            const correctAnswer = question.answers.find(a => a.is_correct);

            if (userAnswerId === correctAnswer?.id) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);

        // Đảm bảo answers không rỗng - nếu không có đáp án nào, gửi object có ít nhất 1 key
        let answersToSubmit = selectedAnswers;
        if (Object.keys(selectedAnswers).length === 0) {
            // Nếu không có đáp án nào, tạo object với key dummy để tránh lỗi validation
            answersToSubmit = { empty: true };
        }

        // Debug log để kiểm tra data
        console.log('Submitting data:', {
            test_id: test.id,
            answers: answersToSubmit,
            score: score,
            correct: correctCount,
            total: totalQuestions
        });

        router.post(
            route('results.store'),
            {
                test_id: test.id,
                answers: answersToSubmit,  // Gửi answers object
                score: score,
                correct: correctCount,
                total: totalQuestions
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                    clearProgress(); // Xóa saved progress sau khi submit thành công
                },
                onError: (errors) => {
                    console.error("Submit error:", errors);
                    console.error("Selected answers:", selectedAnswers);
                    console.error("Answers to submit:", answersToSubmit);
                    alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
                },
            },
        );
    };

    const autoSubmit = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Tính điểm trước khi auto-submit
        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach(question => {
            const userAnswerId = selectedAnswers[question.id];

            // Guard clause - kiểm tra answers có tồn tại không
            if (!question.answers || !Array.isArray(question.answers)) {
                console.warn('Question answers is undefined:', question);
                return;
            }

            const correctAnswer = question.answers.find(a => a.is_correct);

            if (userAnswerId === correctAnswer?.id) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / totalQuestions) * 100);

        // Đảm bảo answers không rỗng
        let answersToSubmit = selectedAnswers;
        if (Object.keys(selectedAnswers).length === 0) {
            answersToSubmit = { empty: true };
        }

        // Debug log để kiểm tra data
        console.log('Auto-submitting data:', {
            test_id: test.id,
            answers: answersToSubmit,
            score: score,
            correct: correctCount,
            total: totalQuestions
        });

        router.post(
            route('results.store'),
            {
                test_id: test.id,
                answers: answersToSubmit,  // Gửi answers object
                score: score,
                correct: correctCount,
                total: totalQuestions
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitted(true);
                    clearProgress(); // Xóa saved progress sau khi auto-submit thành công
                },
                onError: (errors) => {
                    console.error("Auto-submit error:", errors);
                    console.error("Selected answers:", selectedAnswers);
                    console.error("Answers to submit:", answersToSubmit);
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

    if (isSubmitted) {
        return (
            <>
                <Head title="Đang nộp bài..." />
                <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Đang nộp bài...
                            </h2>
                            <p className="text-gray-600">
                                Vui lòng đợi trong giây lát
                            </p>
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

            {/* Thông báo khôi phục tiến độ */}
            {showRestoreNotification && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
                    <CheckCircle2 size={20} />
                    <div>
                        <p className="font-semibold">Đã khôi phục tiến độ!</p>
                        <p className="text-sm">Tiếp tục làm bài từ nơi bạn đã dừng.</p>
                    </div>
                    <button
                        onClick={() => setShowRestoreNotification(false)}
                        className="ml-4 text-white hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="min-h-screen bg-white">
                <div className="border-b border-gray-200">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Link
                                href={route('path.levels')}
                                className="flex items-center gap-2 text-sm underline"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Thoát
                            </Link>
                            <span className="font-semibold">{test.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Clock className="h-5 w-5" />
                            <span>{formatTime(timeLeft)}</span>

                            {/* Auto-save indicator */}
                            <div className="flex items-center gap-1 ml-4 text-sm">
                                {isSaving ? (
                                    <>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span className="text-yellow-600">Đang lưu...</span>
                                    </>
                                ) : lastSavedAt ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-600">
                                            Đã lưu {new Date(lastSavedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                        <span className="text-gray-500">Chưa lưu</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:flex-row">
                    {/* Question panel */}
                    <div className="flex-1 rounded-2xl border border-gray-300 bg-[#f4f4f7] p-8">
                        <p className="text-lg font-semibold text-gray-700 mb-4">
                            Câu {currentQuestion + 1}:
                        </p>
                        <p className="text-gray-800 text-lg leading-relaxed mb-6">
                            {question.question_text}
                        </p>

                        <div className="space-y-3">
                            {question.answers && Array.isArray(question.answers) ? (
                                question.answers.map((answer, index) => (
                                    <label
                                        key={answer.id}
                                        className="flex items-center gap-3 text-lg text-gray-800"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={answer.id}
                                            checked={
                                                selectedAnswers[question.id] ===
                                                answer.id
                                            }
                                            onChange={() =>
                                                handleAnswerSelect(
                                                    question.id,
                                                    answer.id,
                                                )
                                            }
                                            className="h-5 w-5"
                                        />
                                        <span>
                                            {String.fromCharCode(65 + index)}. {" "}
                                            {answer.answer_text}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-red-600">Câu hỏi này không có đáp án. Vui lòng bỏ qua.</p>
                            )}
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
                                onClick={
                                    currentQuestion === questions.length - 1
                                        ? handleSubmit
                                        : handleNext
                                }
                                className={`rounded-full px-6 py-2 font-semibold ${currentQuestion === questions.length - 1
                                    ? "bg-[#f87171] text-white"
                                    : "border border-gray-400"
                                    }`}
                            >
                                {currentQuestion === questions.length - 1
                                    ? "Nộp bài"
                                    : "Câu tiếp theo"}
                            </button>
                        </div>
                    </div>

                    <div className="w-full max-w-sm rounded-2xl border border-gray-300 p-6 flex flex-col items-center justify-center mx-auto">
                        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                            <Clock className="h-5 w-5" />
                            <span>Thời gian: {formatTime(timeLeft)}</span>
                        </div>

                        <div className="mt-6 grid grid-cols-5 gap-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition ${currentQuestion === index
                                        ? "border-black bg-black text-white"
                                        : selectedAnswers[q.id]
                                            ? "border-gray-900 bg-gray-900/70 text-white"
                                            : "border-gray-400 text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="btn btn-secondary rounded-full mt-4"
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
