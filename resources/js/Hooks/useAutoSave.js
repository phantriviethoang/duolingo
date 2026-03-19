import { useCallback, useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * useAutoSave Hook
 *
 * Tự động lưu câu trả lời của user định kỳ
 * Tránh mất dữ liệu nếu user tắt trình duyệt hoặc mất kết nối
 *
 * Sử dụng localStorage để lưu trữ tạm thời
 * Nếu có lỗi, sẽ retry sau 10s
 *
 * @param {Object} answers - Đối tượng {question_id: answer}
 * @param {Number} examId - ID của exam
 * @param {Number} sectionOrder - Số thứ tự của section
 * @param {Number} interval - Thời gian giữa các lần save (ms), mặc định 30s
 * @returns {Object} {isSaving, lastSavedAt, error}
 */
export function useAutoSave(answers, examId, sectionOrder, interval = 30000) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [error, setError] = useState(null);
    const timeoutRef = useRef(null);
    const prevAnswersRef = useRef(null);

    // Lưu vào localStorage
    const saveToLocalStorage = useCallback(() => {
        try {
            const key = `exam_${examId}_section_${sectionOrder}_answers`;
            localStorage.setItem(key, JSON.stringify({
                answers,
                currentQuestion: 0, // Sẽ được override từ component
                startTime: Date.now(),
                timestamp: new Date().toISOString(),
            }));
        } catch (err) {
            console.error('Failed to save to localStorage:', err);
        }
    }, [answers, examId, sectionOrder]);

    // Lấy dữ liệu từ localStorage
    const getStoredAnswers = useCallback(() => {
        try {
            const key = `exam_${examId}_section_${sectionOrder}_answers`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (err) {
            console.error('Failed to read from localStorage:', err);
            return null;
        }
    }, [examId, sectionOrder]);

    // Clear localStorage khi submit thành công
    const clearStoredAnswers = useCallback(() => {
        try {
            const key = `exam_${examId}_section_${sectionOrder}_answers`;
            localStorage.removeItem(key);
        } catch (err) {
            console.error('Failed to clear localStorage:', err);
        }
    }, [examId, sectionOrder]);

    // Auto-save logic
    useEffect(() => {
        // Kiểm tra nếu answers thay đổi so với lần trước
        const answersChanged = JSON.stringify(prevAnswersRef.current) !== JSON.stringify(answers);
        prevAnswersRef.current = answers;

        if (!answersChanged) {
            return;
        }

        // Save immediately to localStorage
        setIsSaving(true);
        setError(null);

        try {
            saveToLocalStorage();
            setLastSavedAt(new Date());
            setIsSaving(false);
        } catch (err) {
            setError('Failed to save. Retrying...');
            setIsSaving(false);

            // Retry sau 10s
            timeoutRef.current = setTimeout(() => {
                try {
                    saveToLocalStorage();
                    setLastSavedAt(new Date());
                    setError(null);
                } catch {
                    setError('Could not save. Check your connection.');
                }
            }, 10000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [answers, saveToLocalStorage, interval]);

    return {
        isSaving,
        lastSavedAt,
        error,
        getStoredAnswers,
        clearStoredAnswers,
    };
}
