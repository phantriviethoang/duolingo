import React from 'react';
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react';

/**
 * SaveIndicator Component
 *
 * Hiển thị trạng thái auto-save
 * - Saving: Đang lưu...
 * - Saved: Đã lưu lúc ...
 * - Error: Lỗi lưu, sẽ thử lại
 *
 * Props:
 * - isSaving: boolean
 * - lastSavedAt: Date object hoặc null
 * - error: string hoặc null
 */
export function SaveIndicator({ isSaving, lastSavedAt, error }) {
    const formatTime = (date) => {
        if (!date) return '';
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)}m trước`;
        return date.toLocaleTimeString('vi-VN');
    };

    return (
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg">
            {error ? (
                <>
                    <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-red-600">{error}</span>
                </>
            ) : isSaving ? (
                <>
                    <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-blue-600">Đang lưu...</span>
                </>
            ) : lastSavedAt ? (
                <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Đã lưu {formatTime(lastSavedAt)}</span>
                </>
            ) : (
                <span className="text-gray-400 italic">Chưa lưu</span>
            )}
        </div>
    );
}
