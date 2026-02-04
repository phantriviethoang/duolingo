import { Head, Link, router, usePage } from "@inertiajs/react";
import { Clock, Users, Info, Plus, Edit, Trash2, Play } from "lucide-react";
import { useState } from "react";

export default function Index({ tests = [], flash, error }) {
  const { auth } = usePage().props;
  const isAdmin = auth?.user?.role === "admin";
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa đề thi này?")) {
      setDeletingId(id);
      router.delete(`/tests/${id}`, {
        preserveScroll: true,
        onFinish: () => setDeletingId(null),
      });
    }
  };

  return (
    <>
      <Head title="Đề thi online" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Đề thi online</h1>
          {isAdmin && (
            <Link
              href="/tests/create"
              className="btn btn-primary gap-2"
            >
              <Plus size={20} />
              Thêm đề thi mới
            </Link>
          )}
        </div>

        {flash?.success && (
          <div className="alert alert-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{flash.success}</span>
          </div>
        )}

        {flash?.error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{flash.error}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {(!tests || !Array.isArray(tests) || tests.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Chưa có đề thi nào trong database
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Hãy chạy migration và seeder để tạo dữ liệu mẫu:
              <br />
              <code className="bg-base-200 px-2 py-1 rounded">
                php artisan migrate:fresh --seed
              </code>
            </p>
            {isAdmin ? (
              <Link href="/tests/create" className="btn btn-primary">
                Tạo đề thi đầu tiên
              </Link>
            ) : (
              <p className="text-sm text-base-content/60">
                Đăng nhập tài khoản admin để tạo đề thi mới.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="card bg-base-100 shadow-xl border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg font-semibold">
                    {test.title}
                  </h2>

                  {test.description && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-base-content/80 mt-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        Thời gian:{" "}
                        <strong>{test.duration} phút</strong>{" "}
                        | {test.total_questions} câu hỏi
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>
                        <strong>
                          {test.attempts.toLocaleString()}
                        </strong>{" "}
                        người đã làm
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm mt-2">
                    <Info size={16} className="mt-0.5" />
                    <span className="text-base-content/70">
                      Sẵn sàng để bắt đầu làm test? Chúc
                      bạn đạt được kết quả tốt nhất
                    </span>
                  </div>

                  <div className="card-actions justify-between mt-4 pt-4 border-t border-base-300">
                    <Link
                      href={`/tests/${test.id}/take`}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <Play size={16} />
                      Bắt đầu thi
                    </Link>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Link
                          href={`/tests/${test.id}/edit`}
                          className="btn btn-ghost btn-sm gap-2"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(test.id)
                          }
                          disabled={
                            deletingId === test.id
                          }
                          className="btn btn-ghost btn-sm text-error gap-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
