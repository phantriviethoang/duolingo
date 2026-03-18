<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * SubmitSectionRequest
 *
 * Validate dữ liệu nộp bài cho một section
 */
class SubmitSectionRequest extends FormRequest
{
    /**
     * Kiểm tra user có phép nộp bài không
     */
    public function authorize(): bool
    {
        // Đã được bảo vệ bởi middleware auth
        return auth()->check();
    }

    /**
     * Các quy tắc validate
     */
    public function rules(): array
    {
        return [
            'section_order' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],
            'answers' => [
                'required',
                'array',
            ],
            'answers.*' => [
                'required',
                'string',
                'max:50', // option ID
            ],
        ];
    }

    /**
     * Custom messages
     */
    public function messages(): array
    {
        return [
            'section_order.required' => 'Thiếu thông tin phần bài thi',
            'section_order.integer' => 'Phần bài thi không hợp lệ',
            'section_order.min' => 'Phần bài thi không hợp lệ',
            'answers.required' => 'Vui lòng trả lời các câu hỏi',
            'answers.array' => 'Dữ liệu câu trả lời không hợp lệ',
            'answers.*.required' => 'Vui lòng trả lời tất cả câu hỏi',
            'answers.*.string' => 'Dữ liệu câu trả lời không hợp lệ',
        ];
    }
}
