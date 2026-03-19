import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./Layout";

export default function AdminResults({ results, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [level, setLevel] = useState(filters.level || "");

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            route("admin.results"),
            {
                search: search || undefined,
                level: level || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch("");
        setLevel("");
        router.get(route("admin.results"), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const rows = Array.isArray(results?.data) ? results.data : [];

    return (
        <AdminLayout current="/admin/results">
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold">Kết quả hệ thống</h1>
                    <p className="text-sm text-base-content/70">Danh sách bài làm từ dữ liệu thực.</p>
                </div>

                <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-2">
                    <label className="form-control w-full max-w-sm">
                        <span className="label-text text-xs">Tìm kiếm</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input input-sm input-bordered"
                            placeholder="Người dùng hoặc đề thi"
                        />
                    </label>

                    <label className="form-control w-36">
                        <span className="label-text text-xs">Trình độ</span>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="select select-sm select-bordered"
                        >
                            <option value="">Tất cả</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                        </select>
                    </label>

                    <button type="submit" className="btn btn-sm btn-primary">Lọc</button>
                    <button type="button" onClick={clearFilters} className="btn btn-sm btn-ghost">Xóa lọc</button>
                </form>

                <div className="card border border-base-300 bg-base-100">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Người dùng</th>
                                        <th>Đề thi</th>
                                        <th>Level/Part</th>
                                        <th>Điểm</th>
                                        <th>Đúng/Tổng</th>
                                        <th>Hoàn thành</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-sm text-base-content/60">
                                                Không có dữ liệu kết quả.
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <p className="font-medium">{row.user_name}</p>
                                                    <p className="text-xs text-base-content/60">{row.user_email}</p>
                                                </td>
                                                <td>{row.test_title}</td>
                                                <td>{row.level || "-"} / P{row.part || "-"}</td>
                                                <td>{row.score}%</td>
                                                <td>{row.correct}/{row.total}</td>
                                                <td>{row.completed_at}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-base-300 px-4 py-3 text-sm">
                            <span className="text-base-content/70">
                                Trang {results?.current_page || 1}/{results?.last_page || 1}
                            </span>
                            <div className="join">
                                <Link
                                    href={results?.prev_page_url || "#"}
                                    className={`join-item btn btn-sm ${results?.prev_page_url ? "" : "btn-disabled"}`}
                                >
                                    Trước
                                </Link>
                                <Link
                                    href={results?.next_page_url || "#"}
                                    className={`join-item btn btn-sm ${results?.next_page_url ? "" : "btn-disabled"}`}
                                >
                                    Sau
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
