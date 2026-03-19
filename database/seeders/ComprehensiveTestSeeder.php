<?php

namespace Database\Seeders;

use App\Models\Test;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Database\Seeder;

/**
 * ComprehensiveTestSeeder
 *
 * Tạo dữ liệu test hoàn chỉnh cho hệ thống:
 * - 6 levels: A1, A2, B1, B2, C1, C2
 * - 3 parts per level
 * - 2 tests per part
 * - 10 questions per test with 4 answers each
 */
class ComprehensiveTestSeeder extends Seeder
{
    public function run(): void
    {
        $levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

        foreach ($levels as $level) {
            for ($part = 1; $part <= 3; $part++) {
                // Tạo 2 tests cho mỗi part
                for ($testIdx = 1; $testIdx <= 2; $testIdx++) {
                    $test = Test::create([
                        'title' => "$level - Part $part - Test $testIdx",
                        'description' => "Assessment test for $level - Part $part - Version $testIdx",
                        'duration' => 30 + ($testIdx * 5),
                        'level' => $level,
                        'part' => $part,
                        'total_questions' => 10,
                        'is_active' => true,
                    ]);

                    // Tạo 10 câu hỏi cho mỗi test
                    for ($qIdx = 1; $qIdx <= 10; $qIdx++) {
                        $question = Question::create([
                            'test_id' => $test->id,
                            'question_text' => $this->generateQuestionText($level, $part, $qIdx),
                            'question_type' => 'multiple_choice',
                            'order' => $qIdx,
                            'translation' => $this->generateTranslation($level, $part, $qIdx),
                            'explanation' => $this->generateExplanation($level, $part, $qIdx),
                            'detailed_explanation' => $this->generateDetailedExplanation($level, $part, $qIdx),
                        ]);

                        // Tạo 4 đáp án cho mỗi câu hỏi
                        $correctAnswer = rand(0, 3);
                        for ($aIdx = 0; $aIdx < 4; $aIdx++) {
                            Answer::create([
                                'question_id' => $question->id,
                                'answer_text' => $this->generateAnswerText($level, $part, $qIdx, $aIdx),
                                'is_correct' => $aIdx === $correctAnswer,
                            ]);
                        }
                    }
                }
            }
        }
    }

    private function generateQuestionText($level, $part, $questionIndex)
    {
        $templates = [
            'A1' => [
                "What is the correct answer for question $questionIndex in A1 Part $part?",
                "Choose the best option for A1 Part $part question $questionIndex.",
                "Select the correct response for this $level question.",
            ],
            'A2' => [
                "Which option best completes the sentence in A2 Part $part?",
                "What would be the most appropriate answer for question $questionIndex?",
                "Choose the correct grammar structure for this $level exercise.",
            ],
            'B1' => [
                "Analyze the situation and select the most suitable response for B1 Part $part.",
                "Which of the following best describes the context in question $questionIndex?",
                "Evaluate the options and choose the most logical answer.",
            ],
            'B2' => [
                "Consider the nuanced meaning and select the most precise answer for B2 Part $part.",
                "Which option demonstrates the best understanding of the context in question $questionIndex?",
                "Analyze the subtle differences and choose the most appropriate response.",
            ],
            'C1' => [
                "Evaluate the complex scenario and select the most sophisticated response for C1 Part $part.",
                "Which option best captures the implicit meaning in question $questionIndex?",
                "Consider the cultural and linguistic nuances in your answer choice.",
            ],
            'C2' => [
                "Analyze the highly sophisticated context and select the most appropriate response for C2 Part $part.",
                "Which option demonstrates mastery-level understanding in question $questionIndex?",
                "Evaluate the subtle linguistic and cultural implications in your choice.",
            ],
        ];

        $levelTemplates = $templates[$level];
        return $levelTemplates[array_rand($levelTemplates)];
    }

    private function generateAnswerText($level, $part, $questionIndex, $answerIndex)
    {
        $answers = [
            "Option A for $level Part $part question $questionIndex",
            "Option B for $level Part $part question $questionIndex",
            "Option C for $level Part $part question $questionIndex",
            "Option D for $level Part $part question $questionIndex",
        ];

        return $answers[$answerIndex];
    }

    private function generateTranslation($level, $part, $questionIndex)
    {
        $translations = [
            'A1' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ A1.",
            'A2' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ A2.",
            'B1' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ B1.",
            'B2' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ B2.",
            'C1' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ C1.",
            'C2' => "Đây là bản dịch câu hỏi $questionIndex phần $part cấp độ C2.",
        ];

        return $translations[$level];
    }

    private function generateExplanation($level, $part, $questionIndex)
    {
        $explanations = [
            'A1' => "Đáp án đúng là A vì đây là cấu trúc cơ bản nhất.",
            'A2' => "Đáp án đúng là B vì phù hợp với ngữ cảnh cấp độ A2.",
            'B1' => "Đáp án đúng là C vì thể hiện sự hiểu biết ngữ pháp B1.",
            'B2' => "Đáp án đúng là D vì phức tạp hơn phù hợp cấp B2.",
            'C1' => "Đáp án đúng là A vì thể hiện sự tinh tế ngôn ngữ C1.",
            'C2' => "Đáp án đúng là B vì thể hiện sự thành thạo cấp độ C2.",
        ];

        return $explanations[$level];
    }

    private function generateDetailedExplanation($level, $part, $questionIndex)
    {
        $detailedExplanations = [
            'A1' => "Ngữ pháp: Present Simple. Đây thì hiện tại đơn được dùng cho sự thật hiển nhiên.",
            'A2' => "Ngữ pháp: Past Simple. Thì quá khứ đơn diễn tả hành động đã kết thúc trong quá khứ.",
            'B1' => "Ngữ pháp: Present Perfect. Thì hiện tại hoàn thành nối quá khứ với hiện tại.",
            'B2' => "Ngữ pháp: Conditional Sentences. Câu điều kiện loại 2 diễn tả tình huống giả định.",
            'C1' => "Ngữ pháp: Inversion. Đảo cấu trúc nhấn mạnh trong tiếng Anh trang trọng.",
            'C2' => "Ngữ pháp: Subjunctive Mood. Lối giả định diễn tả mong muốn hoặc tình huống không có thật.",
        ];

        return $detailedExplanations[$level];
    }
}
