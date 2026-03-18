import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Timer, Send } from 'lucide-react';
import { useAutoSave } from '@/Hooks/useAutoSave';
import { ResultCard } from '@/Components/Exam/ResultCard';
import { SectionProgressBar } from '@/Components/Exam/ProgressBar';
import { SaveIndicator } from '@/Components/Exam/SaveIndicator';

export default function Take({ exam, section, questions, total_sections }) {
    const { data, setData, post, processing } = useForm({
        section_order: section.order,
        answers: {},
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        // Tính thời gian thực tế dựa trên chế độ high-quality
        let baseDuration = exam.duration * 60; // Convert to seconds
        if (exam.is_high_quality) {
            baseDuration = Math.ceil(baseDuration * 0.8); // 20% ít thời gian hơn
        }
        return baseDuration;
    });
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    // Use auto-save hook
    const { isSaving, lastSavedAt, error: saveError, getStoredAnswers } = useAutoSave(
        data.answers,
        exam.id,
        section.order
    );

    // Initialize answers object with null values
    useEffect(() => {
        const initialAnswers = {};
        questions.forEach(q => {
            initialAnswers[q.id] = null;
        });

        // Try to restore from localStorage
        const stored = getStoredAnswers();
        if (stored?.answers) {
            setData('answers', stored.answers);
        } else {
            setData('answers', initialAnswers);
        }
    }, [questions]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Auto-submit when time runs out
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Check if all questions are answered - PHẢI KỌC TRƯỚC khi dùng trong useEffect
    const answeredCount = Object.values(data.answers).filter(v => v !== null).length;
    const allAnswered = answeredCount === questions.length;

    // Format time hh:mm:ss
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Cảnh báo khi back, F5, hoặc đóng tab nếu đã chọn đáp án
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Nếu không có câu nào được chọn hoặc đã submit xong thì không cảnh báo
            if (answeredCount === 0 || submitResult) {
                return;
            }
            e.preventDefault();
            e.returnValue = 'Bạn đang làm bài exam. Nếu rời đi, tiến độ của bạn sẽ được tự động lưu. Bạn có chắc chắn muốn rời khỏi?';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [answeredCount, submitResult]);

    const handleAnswerChange = (questionId, optionId) => {
        setData('answers', {
            ...data.answers,
            [questionId]: optionId,
        });
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        post(route('exams.sections.submit', exam.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Check for flash messages
                const flashSuccess = page.props.flash?.success;
                const flashError = page.props.flash?.error;

                if (flashSuccess) {
                    setSubmitResult({
                        passed: true,
                        ...flashSuccess,
                    });
                } else if (flashError) {
                    setSubmitResult({
                        passed: false,
                        ...flashError,
                    });
                }
            },
        });
    };

    return (
        <Layout>
            <Head title={`${exam.title} - Phòng thi - LinGo`} />

            <div className="min-h-screen bg-gray-50">
                {/* Fixed Header */}
                <div className="sticky top-0 z-40 bg-white shadow border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
                        {/* Left: Title */}
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {exam.title}
                                </h1>
                                {exam.is_high_quality && (
                                    <span className="badge badge-warning text-xs">
                                        ⭐ HIGH QUALITY
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Phần {section.order}/{total_sections}
                            </p>
                        </div>

                        {/* Center: Progress */}
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-600 uppercase">Trả lời</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {answeredCount}/{questions.length}
                                </p>
                            </div>
                        </div>

                        {/* Right: Timer */}
                        <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                            <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
                            <span className="font-bold text-lg">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Save Indicator */}
                    <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-end">
                        <SaveIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} error={saveError} />
                    </div>
                </div>

                {/* High-Quality Mode Info Banner */}
                {exam.is_high_quality && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 mx-4 mb-4 p-4 rounded">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⭐</span>
                            <div>
                                <h3 className="font-bold text-amber-900 mb-1">Chế độ High-Quality</h3>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• Thời gian có hạn: <strong>20% ít hơn</strong> bình thường</li>
                                    <li>• Yêu cầu điểm cao hơn: <strong>+20%</strong> so với bình thường</li>
                                    <li>• Để thử thách khả năng của bạn</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <SectionProgressBar
                            totalSections={total_sections}
                            completedSectionOrder={section.order - 1}
                            currentSection={section.order}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Questions */}
                        {questions.map((question, index) => (
                            <div key={question.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                {/* Question Header */}
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-blue-600 mb-2">
                                        Câu {index + 1}/{questions.length}
                                    </p>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {question.question}
                                    </h3>
                                    {question.translation && (
                                        <p className="text-sm text-gray-600 italic mt-2">
                                            ({question.translation})
                                        </p>
                                    )}
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    {question.options && Object.entries(question.options).map(([key, value]) => (
                                        <label key={key} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={key}
                                                checked={data.answers[question.id] === key}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{value}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Explanation (show only if answered) */}
                                {data.answers[question.id] && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                                        <p className="text-sm font-semibold text-gray-900 mb-2">Giải thích:</p>
                                        <p className="text-sm text-gray-700">{question.explanation}</p>
                                        {question.detailed_explanation && (
                                            <p className="text-sm text-gray-600 mt-2 italic">
                                                Chi tiết: {question.detailed_explanation}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Progress Check */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Kiểm tra:</h3>
                                    <p className={`text-lg font-bold ${allAnswered ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {allAnswered ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Đã trả lời tất cả câu hỏi
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5" />
                                                Còn {questions.length - answeredCount} câu chưa trả lời
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitConfirm(true)}
                                    disabled={processing || !allAnswered}
                                    className="btn btn-lg btn-primary"
                                >
                                    <Send className="w-5 h-5" />
                                    Nộp bài
                                </button>
                            </div>
                        </div>
                    </form>
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
                            {!allAnswered && (
                                <p className="text-yellow-600 text-sm mb-4">
                                    ⚠️ Còn {questions.length - answeredCount} câu chưa được trả lời
                                </p>
                            )}
                            <p className="text-gray-600 text-sm mb-6">
                                Hệ thống sẽ kiểm tra câu trả lời của bạn. Bạn không thể quay lại để sửa câu trả lời này.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="btn btn-outline flex-1"
                                    disabled={processing}
                                >
                                    Tiếp tục làm bài
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="btn btn-primary flex-1"
                                >
                                    {processing ? 'Đang nộp...' : 'Nộp bài'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submit Result Modal */}
                {submitResult && (
                    <ResultCard
                        result={submitResult}
                        onRetry={() => window.location.reload()}
                        onContinue={() => {
                            if (submitResult.exam_completed) {
                                window.location.href = route('exams.show', exam.id);
                            } else if (submitResult.next_section_unlocked) {
                                window.location.href = route('exams.take', {
                                    exam: exam.id,
                                    section: section.order + 1,
                                });
                            } else {
                                window.location.reload();
                            }
                        }}
                    />
                )}
            </div>
        </Layout>
    );
}
