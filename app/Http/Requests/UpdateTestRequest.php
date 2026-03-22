<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'level' => ['required', 'string', 'in:A1,A2,B1,B2,C1,C2'],
            'parts' => ['required', 'array', 'min:1'],
            'parts.*.part_number' => ['required', 'integer', 'min:1'],
            'parts.*.question_count' => ['required', 'integer', 'min:1'],
            'parts.*.duration' => ['required', 'integer', 'min:1'],
            'question_ids' => ['nullable', 'array'],
            'question_ids.*' => ['integer', 'exists:questions,id'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề đề thi là bắt buộc.',
            'level.required' => 'Trình độ là bắt buộc.',
            'level.in' => 'Trình độ không hợp lệ.',
            'parts.required' => 'Cấu hình phần thi là bắt buộc.',
            'parts.array' => 'Cấu hình phần thi không hợp lệ.',
            'parts.min' => 'Cần ít nhất 1 phần thi.',
            'parts.*.part_number.required' => 'Số phần là bắt buộc.',
            'parts.*.part_number.integer' => 'Số phần phải là số nguyên.',
            'parts.*.part_number.min' => 'Số phần phải lớn hơn 0.',
            'parts.*.question_count.required' => 'Số câu hỏi là bắt buộc.',
            'parts.*.question_count.integer' => 'Số câu hỏi phải là số nguyên.',
            'parts.*.question_count.min' => 'Số câu hỏi phải lớn hơn 0.',
            'parts.*.duration.required' => 'Thời gian là bắt buộc.',
            'parts.*.duration.integer' => 'Thời gian phải là số nguyên.',
            'parts.*.duration.min' => 'Thời gian phải lớn hơn 0.',
            'question_ids.array' => 'Định dạng câu hỏi không hợp lệ.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $parts = collect((array) $this->input('parts', []));
            $duplicates = $parts
                ->pluck('part_number')
                ->map(fn ($num) => (int) $num)
                ->duplicates();

            if ($duplicates->isNotEmpty()) {
                $validator->errors()->add('parts', 'Số phần không được trùng nhau.');
            }

        });
    }
}
