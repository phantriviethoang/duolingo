<?php

namespace App\Traits;

/**
 * HasQuestionBank
 *
 * Chứa bộ câu hỏi tiếng Anh dùng chung cho seeder + factory
 */
trait HasQuestionBank
{
    /**
     * Bộ ngân hàng câu hỏi tiếng Anh chất lượng cao
     */
    public function getQuestionBank(): array
    {
        return [
            [
                'question' => 'When filling out the order form, please _____ your address clearly to prevent delays.',
                'options' => ['fix', 'write', 'send', 'direct'],
                'correct' => 1,
                'explanation' => 'Động từ "write" phù hợp nhất vì nghĩa là viết thông tin xuống.',
                'translation' => 'Khi điền vào đơn đặt hàng, vui lòng _____ địa chỉ của bạn rõ ràng để tránh chậm trễ.',
                'detailed_explanation' => 'Trong ngữ cảnh "filling out the form" (điền đơn), ta dùng "write" (viết) địa chỉ. "Fix" là sửa chữa, "send" là gửi, "direct" là chỉ dẫn. Cụm "write your address" là tự nhiên nhất.',
            ],
            [
                'question' => 'Ms. Morgan recruited the individuals that the company _____ for the next three months.',
                'options' => ['will employ', 'to employ', 'has been employed', 'employ'],
                'correct' => 0,
                'explanation' => 'Cần thì tương lai "will employ" vì có "for the next three months".',
                'translation' => 'Cô Morgan đã tuyển dụng những cá nhân mà công ty _____ trong ba tháng tới.',
                'detailed_explanation' => 'Cụm trạng từ "for the next three months" (cho 3 tháng tới) chỉ tương lai, nên động từ cần chia ở thì tương lai đơn "will employ".',
            ],
            [
                'question' => 'The contractor had a fifteen-percent _____ in his business after advertising in the local newspaper.',
                'options' => ['experience', 'growth', 'formula', 'incentive'],
                'correct' => 1,
                'explanation' => '"Growth" là danh từ chỉ sự tăng trưởng, hợp ngữ cảnh.',
                'translation' => 'Nhà thầu đã có sự _____ 15% trong kinh doanh sau khi quảng cáo trên báo địa phương.',
                'detailed_explanation' => 'Câu cần danh từ hợp nghĩa sau "fifteen-percent". "Growth" (sự tăng trưởng) là hợp lý nhất khi nói về kết quả kinh doanh tốt lên nhờ quảng cáo. "Experience" là kinh nghiệm, "formula" là công thức, "incentive" là sự khích lệ.',
            ],
            [
                'question' => 'The free clinic was founded by a group of doctors to give _____ for various medical conditions.',
                'options' => ['treatment', 'treat', 'treated', 'treating'],
                'correct' => 0,
                'explanation' => 'Sau "give" cần danh từ. "Treatment" là dạng danh từ đúng.',
                'translation' => 'Phòng khám miễn phí được thành lập bởi một nhóm bác sĩ để cung cấp _____ cho các bệnh trạng khác nhau.',
                'detailed_explanation' => 'Cấu trúc "give [noun]" (đưa ra cái gì). "Treatment" là danh từ (sự điều trị). Các từ còn lại: "treat" (động từ), "treated" (quá khứ phân từ/tính từ), "treating" (danh động từ/hiện tại phân từ).',
            ],
            [
                'question' => 'Participants in the walking tour should gather _____ 533 Bates Road on Saturday morning.',
                'options' => ['with', 'at', 'like', 'among'],
                'correct' => 1,
                'explanation' => 'Giới từ "at" dùng cho địa điểm/địa chỉ cụ thể.',
                'translation' => 'Những người tham gia tour đi bộ nên tập trung _____ số 533 đường Bates vào sáng thứ Bảy.',
                'detailed_explanation' => 'Dùng giới từ "at" trước một địa chỉ cụ thể có số nhà (533 Bates Road).',
            ],
            [
                'question' => 'The artist sent _____ best pieces to the gallery to be reviewed by the owner.',
                'options' => ['him', 'himself', 'his', 'he'],
                'correct' => 2,
                'explanation' => 'Cần tính từ sở hữu "his" bổ nghĩa cho "best pieces".',
                'translation' => 'Người nghệ sĩ đã gửi những tác phẩm tốt nhất _____ tới phòng tranh để ông chủ xem xét.',
                'detailed_explanation' => 'Cần tính từ sở hữu để bổ nghĩa cho danh từ "best pieces". Chủ ngữ "The artist" (số ít, nam, giả định) nên dùng "his". "Himself" là đại từ phản thân, "him" là tân ngữ, "he" là chủ ngữ.',
            ],
            [
                'question' => 'The figures that accompany the financial statement should be _____ to the spending category.',
                'options' => ['relevance', 'relevantly', 'more relevantly', 'relevant'],
                'correct' => 3,
                'explanation' => 'Sau "be" cần tính từ. "Relevant" là đúng.',
                'translation' => 'Các số liệu đi kèm báo cáo tài chính cần phải _____ với danh mục chi tiêu.',
                'detailed_explanation' => 'Sau động từ to be "should be" cần một tính từ. "Relevant" (liên quan/thích hợp) là tính từ. "Relevance" là danh từ, "relevantly" là trạng từ.',
            ],
            [
                'question' => 'The building owner purchased the property _____ three months ago, but she has already spent a great deal of money on renovations.',
                'options' => ['yet', 'just', 'few', 'still'],
                'correct' => 1,
                'explanation' => '"Just" nghĩa là "mới đây", đi với "ago" để chỉ thời điểm gần.',
                'translation' => 'Chủ tòa nhà _____ mua bất động sản này ba tháng trước, nhưng cô ấy đã chi rất nhiều tiền để cải tạo.',
                'detailed_explanation' => 'Cụm từ "just ... ago" (chỉ mới ... trước đây) nhấn mạnh sự việc mới xảy ra. "Just three months ago" = Chỉ mới 3 tháng trước.',
            ],
            [
                'question' => 'We would like to discuss this problem honestly and _____ at the next staff meeting.',
                'options' => ['rarely', 'tiredly', 'openly', 'highly'],
                'correct' => 2,
                'explanation' => '"Openly" nghĩa là thẳng thắn, phù hợp với "honestly".',
                'translation' => 'Chúng tôi muốn thảo luận vấn đề này một cách trung thực và _____ tại cuộc họp nhân viên tiếp theo.',
                'detailed_explanation' => 'Cần một trạng từ song hành với "honestly" (trung thực). "Openly" (công khai/thẳng thắn) là phù hợp nhất về ngữ nghĩa.',
            ],
            [
                'question' => 'The store\'s manager plans to put the new merchandise on display _____ to promote the line of fall fashions.',
                'options' => ['soon', 'very', 'that', 'still'],
                'correct' => 0,
                'explanation' => '"Soon" là trạng từ chỉ "trong thời gian ngắn", hợp ngữ cảnh.',
                'translation' => 'Quản lý cửa hàng dự định sẽ trưng bày hàng hóa mới _____ để quảng bá dòng thời trang mùa thu.',
                'detailed_explanation' => 'Trạng từ "soon" (sớm/sắp tới) bổ nghĩa cho hành động "put ... on display".',
            ],
        ];
    }

    /**
     * Lấy một câu hỏi ngẫu nhiên từ bộ ngân hàng
     */
    public function getRandomQuestion(): array
    {
        $bank = $this->getQuestionBank();
        $selected = $bank[array_rand($bank)];

        $options = [];
        foreach ($selected['options'] as $index => $optionText) {
            $options[] = [
                'id' => $index,
                'text' => $optionText,
                'is_correct' => $index === $selected['correct'],
            ];
        }

        $answers = array_map(function ($option, $index) use ($selected) {
            return [
                'answer_text' => $option,
                'is_correct' => $index === $selected['correct'],
            ];
        }, $selected['options'], array_keys($selected['options']));

        return [
            // Legacy keys for existing form payloads
            'question' => $selected['question'],
            'options' => $options,
            'correct_option_id' => $selected['correct'],

            // Schema-aligned keys for questions/answers tables
            'question_text' => $selected['question'],
            'question_type' => 'multiple_choice',
            'answers' => $answers,

            'explanation' => $selected['explanation'] ?? null,
            'translation' => $selected['translation'] ?? null,
            'detailed_explanation' => $selected['detailed_explanation'] ?? null,
        ];
    }
}
