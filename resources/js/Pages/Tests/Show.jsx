import { Head, Link, router, usePage } from "@inertiajs/react";
import { Clock, Users, Calendar, Play, ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function Show({ test }) {
  const { auth } = usePage().props;
  const isAdmin = auth?.user?.role === "admin";

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      router.delete(`/tests/${test.id}`);
    }
  };

  return (
    <>
      <Head title={test.title} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/tests"
            className="btn btn-ghost btn-sm gap-2"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                href={`/tests/${test.id}/edit`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <Edit size={16} />
                Sửa đề thi
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-sm text-error gap-2"
              >
                <Trash2 size={16} />
                Xóa đề thi
              </button>
            </div>
          )}
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-4">
              {test.title}
            </h1>

            {test.description && (
              <p className="text-base-content/70 mb-6">
                {test.description}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Thời gian làm bài
                  </p>
                  <p className="text-lg font-semibold">
                    {test.duration} phút
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Users size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Số câu hỏi
                  </p>
                  <p className="text-lg font-semibold">
                    {test.total_questions} câu
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Số lượt làm bài
                  </p>
                  <p className="text-lg font-semibold">
                    {test.attempts.toLocaleString()} lượt
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-info/10 rounded-lg">
                  <Calendar
                    size={24}
                    className="text-info"
                  />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Ngày tạo
                  </p>
                  <p className="text-lg font-semibold">
                    {test.created_at}
                  </p>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="bg-base-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">
                Hướng dẫn làm bài
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Bạn có {test.duration} phút để hoàn thành{" "}
                    {test.total_questions} câu hỏi
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Mỗi câu hỏi chỉ có một đáp án đúng
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Bạn có thể xem lại các câu hỏi trước khi
                    nộp bài
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Sau khi hết thời gian, bài làm sẽ tự động
                    được nộp
                  </span>
                </li>
              </ul>
            </div>

            <div className="card-actions justify-center">
              <Link
                href={`/tests/${test.id}/take`}
                className="btn btn-primary btn-lg gap-2"
              >
                <Play size={20} />
                Bắt đầu làm bài
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
