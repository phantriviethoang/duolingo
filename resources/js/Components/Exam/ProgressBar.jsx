import React from 'react';
import { CheckCircle2, Lock, Zap } from 'lucide-react';

/**
 * SectionProgressBar Component
 *
 * Hiển thị thanh tiến độ các section trong một exam
 *
 * Props:
 * - totalSections: Tổng số section
 * - completedSectionOrder: Section cuối cùng hoàn thành (0-indexed)
 * - currentSection: Section đang làm (nếu có)
 */
export function SectionProgressBar({ totalSections, completedSectionOrder = 0, currentSection = null }) {
    const progressPercent = Math.round(((completedSectionOrder || 0) / totalSections) * 100);

    return (
        <div className="w-full bg-white p-4 rounded-lg shadow">
            {/* Title & Stats */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    Tiến độ các phần
                </h3>
                <span className="text-lg font-bold text-blue-600">
                    {completedSectionOrder}/{totalSections}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Section Dots */}
            <div className="flex gap-2">
                {Array.from({ length: totalSections }, (_, i) => i + 1).map((num) => {
                    const isCompleted = num <= (completedSectionOrder || 0);
                    const isCurrent = num === currentSection;

                    return (
                        <div
                            key={num}
                            className={`
                flex-1 py-2 px-3 rounded-lg text-center font-semibold transition-all
                ${isCompleted
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : isCurrent
                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                        : 'bg-gray-100 text-gray-600 border border-gray-300'}
              `}
                            title={`Phần ${num}`}
                        >
                            <div className="flex items-center justify-center gap-1">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : isCurrent ? (
                                    <Zap className="w-4 h-4" />
                                ) : (
                                    <Lock className="w-4 h-4" />
                                )}
                                <span className="text-xs sm:text-sm md:text-base">{num}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Hoàn thành</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                    <Zap className="w-3 h-3" />
                    <span>Đang làm</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                    <Lock className="w-3 h-3" />
                    <span>Khóa</span>
                </div>
            </div>
        </div>
    );
}
