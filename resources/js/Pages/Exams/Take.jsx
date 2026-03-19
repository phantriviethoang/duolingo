import QuizTake from "@/Pages/Quiz/Take";

export default function Take({ exam, section, questions }) {
    const submitRoute = `/exams/${exam.id}/sections/submit`;
    
    return (
        <QuizTake
            quiz={exam}
            questions={questions || []}
            submitRoute={submitRoute}
            section={section}
        />
    );
}
