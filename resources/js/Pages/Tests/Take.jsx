import QuizTake from "@/Pages/Quiz/Take";
import { usePage } from "@inertiajs/react";

export default function Take({ test, question: _1, retake_wrong: _2, previous_result_id: _3 }) {
    const { url } = usePage();

    // Check if this is CEFR system by checking URL pattern
    const isCEFRSystem = url.includes('/path/') || url.includes('/cefr/');

    // For CEFR system, we need to submit to CEFR complete route
    // Extract level and part from URL or test data
    let submitRoute = `/tests/${test?.id}/results`;

    if (isCEFRSystem && test?.title) {
        // Try to extract level and part from test title
        const match = test.title.match(/([A-Z]\d+)\s*-\s*.*\s*Part\s*(\d+)/i);
        if (match) {
            const [, level, part] = match;
            submitRoute = `/path/${level}/part/${part}/complete`;
        }
    }

    return (
        <QuizTake
            quiz={test}
            questions={test?.questions || []}
            submitRoute={submitRoute}
        />
    );
}
