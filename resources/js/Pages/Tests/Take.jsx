import QuizTake from "@/Pages/Quiz/Take";

export default function Take({ test, question: _1, retake_wrong: _2, previous_result_id: _3 }) {
    return (
        <QuizTake
            quiz={test}
            questions={test?.questions || []}
            submitRoute={`/tests/${test?.id}/results`}
        />
    );
}
