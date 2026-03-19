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
                'sometimes',
                'nullable',
            ],
        ];
    }

    /**
     * Prepare data for validation.
     * Convert answers object to array if needed.
     */
    protected function prepareForValidation(): void
    {
        // Frontend gửi answers dạng object {questionId: answerId}
        // Convert thành array associative để validation + service xử lý
        if (is_object($this->answers)) {
            // Convert stdClass object to array
            $this->merge([
                'answers' => json_decode(json_encode($this->answers), true),
            ]);
        } elseif (is_array($this->answers)) {
            // Nếu đã là array, giữ nguyên
            $this->merge([
                'answers' => $this->answers,
            ]);
        }
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'section_order.required' => 'Phần thi là bắt buộc.',
            'section_order.integer' => 'Phần thi phải là một số nguyên.',
            'answers.required' => 'Câu trả lời là bắt buộc.',
            'answers.array' => 'Câu trả lời phải là một mảng.',
            'answers.*.required' => 'Vui lòng trả lời tất cả các câu hỏi.',
            'answers.*.string' => 'Câu trả lời phải là dạng chữ.',
        ];
    }
}
