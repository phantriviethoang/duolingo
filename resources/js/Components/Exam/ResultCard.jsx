import React from 'react';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

/**
 * ResultCard Component
 *
 * Hiển thị kết quả sau khi nộp bài:
 * - ✅ PASS: Show success message, phần trăm, số câu đúng
 * - ❌ FAIL: Show failure message, phần trăm yêu cầu, số câu đúng
 *
 * Props:
 * - result: {passed, message, percentage, correct_count, total, required_percentage?, exam_completed?, next_section_unlocked?}
 * - onRetry: Function khi click "Làm lại"
 * - onContinue: Function khi click "Tiếp tục"
 */
export function ResultCard({ result, onRetry, onContinue }) {
    if (!result) {
        return null;
    }

    const { passed, message, percentage, correct_count, total, required_percentage, exam_completed, next_section_unlocked } = result;

    return (
        <div className={`modal modal-open ${result ? 'modal-open' : ''}`}>
            <div className="modal-box max-w-lg">
                {/* Header */}
                <div className={`text-center py-6 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                    {passed ? (
                        <>
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-green-700 mb-2">Tuyệt vời!</h2>
                            <p className="text-gray-700 text-lg">{message}</p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-red-700 mb-2">Chưa đạt yêu cầu</h2>
                            <p className="text-gray-700 text-lg">{message}</p>
                        </>
                    )}
                </div>

                {/* Score Details */}
                <div className="py-6 space-y-4">
                    {/* Percentage */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-900">Điểm của bạn:</span>
                        <span className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                        </span>
                    </div>

                    {/* Required Percentage */}
                    {required_percentage && (
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                            <span className="font-semibold text-gray-900">Yêu cầu tối thiểu:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {required_percentage}%
                            </span>
                        </div>
                    )}

                    {/* Correct Answers */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-900">Câu trả lời đúng:</span>
                        <span className="text-2xl font-bold text-gray-900">
                            {correct_count}/{total}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700 uppercase">Tiến độ</span>
                            <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="modal-action flex gap-2 mt-6">
                    {!passed && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="btn btn-outline flex-1"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Làm lại
                        </button>
                    )}

                    {passed && next_section_unlocked && (
                        <button
                            type="button"
                            onClick={onContinue}
                            className="btn btn-primary flex-1"
                        >
                            Tiếp tục phần tiếp theo
                        </button>
                    )}

                    {passed && exam_completed && (
                        <button
                            type="button"
                            onClick={onContinue}
                            className="btn btn-primary flex-1"
                        >
                            Xem kết quả cuối cùng
                        </button>
                    )}

                    {passed && !next_section_unlocked && !exam_completed && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="btn btn-primary flex-1"
                        >
                            Quay lại
                        </button>
                    )}
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button type="button">close</button>
            </form>
        </div>
    );
}
