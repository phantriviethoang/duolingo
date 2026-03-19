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
            'duration' => ['required', 'integer', 'min:1'],
            'level' => ['required', 'string', 'in:A1,A2,B1,B2,C1,C2'],
            'part' => ['required', 'integer', 'min:1', 'max:3'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['required', 'array', 'min:2'],
            'questions.*.options.*.text' => ['required', 'string'],
            'questions.*.options.*.is_correct' => ['required', 'boolean'],
            'questions.*.explanation' => ['nullable', 'string'],
            'questions.*.translation' => ['nullable', 'string'],
            'questions.*.detailed_explanation' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Tiêu đề đề thi là bắt buộc.',
            'level.required' => 'Trình độ là bắt buộc.',
            'level.in' => 'Trình độ không hợp lệ.',
            'part.required' => 'Phần là bắt buộc.',
            'part.integer' => 'Phần phải là số nguyên.',
            'part.min' => 'Phần phải từ 1 đến 3.',
            'part.max' => 'Phần phải từ 1 đến 3.',
            'duration.required' => 'Thời gian làm bài là bắt buộc.',
            'duration.integer' => 'Thời gian làm bài phải là số nguyên.',
            'duration.min' => 'Thời gian làm bài phải ít nhất 1 phút.',
            'questions.required' => 'Đề thi phải có ít nhất 1 câu hỏi.',
            'questions.*.question.required' => 'Nội dung câu hỏi không được để trống.',
            'questions.*.options.required' => 'Mỗi câu hỏi phải có đáp án.',
            'questions.*.options.min' => 'Mỗi câu hỏi phải có ít nhất 2 đáp án.',
            'questions.*.options.*.text.required' => 'Nội dung đáp án không được để trống.',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            foreach ((array) $this->input('questions', []) as $index => $question) {
                $options = (array) ($question['options'] ?? []);
                $correctCount = collect($options)->filter(function ($option) {
                    return filter_var($option['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN);
                })->count();

                if ($correctCount !== 1) {
                    $validator->errors()->add(
                        "questions.{$index}.options",
                        'Mỗi câu hỏi phải có đúng 1 đáp án đúng.'
                    );
                }
            }
        });
    }
}
