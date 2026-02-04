import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function Show({ test, result, questions }) {
  return (
    <>
      <Head title={`Kết quả - ${test.title}`} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/results"
          className="btn btn-ghost btn-sm gap-2 mb-6"
        >
          <ArrowLeft size={16} />
          Quay lại lịch sử
        </Link>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body text-center">
            <h1 className="text-2xl font-bold mb-4">
              {test.title}
            </h1>
            <div className="mb-6">
              {result.score >= 70 ? (
                <CheckCircle2
                  size={80}
                  className="mx-auto text-success mb-4"
                />
              ) : (
                <AlertCircle
                  size={80}
                  className="mx-auto text-warning mb-4"
                />
              )}
              <h2 className="text-4xl font-bold mb-2">
                {result.score}%
              </h2>
              <p className="text-lg text-base-content/70">
                Bạn đã trả lời đúng {result.correct}/
                {result.total} câu hỏi
              </p>
              <p className="text-sm text-base-content/60 mt-2">
                Hoàn thành lúc: {result.completed_at}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Chữa bài chi tiết</h3>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswerId =
                  result.answers[question.id];
                const userOption = question.options.find(
                  (opt) => opt.id === userAnswerId,
                );
                const correctOption = question.options.find(
                  (opt) => opt.is_correct,
                );
                const isCorrect =
                  userAnswerId === correctOption?.id;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${isCorrect
                      ? "border-success bg-success/10"
                      : "border-error bg-error/10"
                      }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`badge ${isCorrect
                          ? "badge-success"
                          : "badge-error"
                          }`}
                      >
                        Câu {index + 1}
                      </span>
                      {isCorrect ? (
                        <CheckCircle2
                          size={20}
                          className="text-success"
                        />
                      ) : (
                        <AlertCircle
                          size={20}
                          className="text-error"
                        />
                      )}
                    </div>
                    <p className="font-semibold mb-3">
                      {question.question}
                    </p>

                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer =
                          option.id === userAnswerId;
                        const isCorrectAnswer =
                          option.is_correct;

                        return (
                          <div
                            key={option.id}
                            className={`p-2 rounded ${isCorrectAnswer
                              ? "bg-success/20 border border-success"
                              : isUserAnswer
                                ? "bg-error/20 border border-error"
                                : "bg-base-200"
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && (
                                <CheckCircle2
                                  size={16}
                                  className="text-success"
                                />
                              )}
                              {isUserAnswer &&
                                !isCorrectAnswer && (
                                  <AlertCircle
                                    size={
                                      16
                                    }
                                    className="text-error"
                                  />
                                )}
                              <span
                                className={`${isCorrectAnswer ? "font-semibold" : ""}`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option.text}
                              </span>
                              {isUserAnswer && (
                                <span className="badge badge-sm">
                                  Bạn chọn
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="badge badge-success badge-sm">
                                  Đáp án đúng
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 space-y-2 text-left">
                      {question.translation && (
                        <div className="p-3 bg-base-200 rounded">
                          <p className="text-sm italic text-base-content/80">
                            <span className="font-semibold text-secondary not-italic">
                              Dịch câu hỏi:
                            </span>{" "}
                            {question.translation}
                          </p>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="p-3 bg-success/5 rounded border border-success/20">
                          <p className="text-sm">
                            <span className="font-semibold text-success">
                              Đáp án đúng:
                            </span>{" "}
                            {question.explanation}
                          </p>
                        </div>
                      )}

                      {question.detailed_explanation && (
                        <div className="p-3 bg-info/5 rounded border border-info/20">
                          <p className="text-sm">
                            <span className="font-semibold text-info">
                              Giải thích ngữ
                              pháp:
                            </span>{" "}
                            {
                              question.detailed_explanation
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-actions justify-center mt-6">
              <Link href="/tests" className="btn btn-primary">
                Làm bài khác
              </Link>
              <Link
                href={`/tests/${test.id}/take`}
                className="btn btn-outline"
              >
                Làm lại bài này
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
