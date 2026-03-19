import AdminLayout from "./Layout";

export default function AdminAnalytics({ overview, resultsByLevel = [], recentDailyAttempts = [] }) {
    const cards = [
        { label: "Người dùng", value: overview?.total_users ?? 0 },
        { label: "Đề thi", value: overview?.total_tests ?? 0 },
        { label: "Bài làm", value: overview?.total_results ?? 0 },
        { label: "Điểm TB", value: `${overview?.avg_score ?? 0}%` },
        { label: "Tỉ lệ đạt", value: `${overview?.pass_rate ?? 0}%` },
    ];

    return (
        <AdminLayout current="/admin/analytics">
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold">Phân tích</h1>
                    <p className="text-sm text-base-content/70">Tổng hợp dữ liệu thật từ kết quả làm bài.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                    {cards.map((item) => (
                        <div key={item.label} className="stat rounded-lg border border-base-300 bg-base-100">
                            <div className="stat-title">{item.label}</div>
                            <div className="stat-value text-2xl">{item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="card border border-base-300 bg-base-100">
                        <div className="card-body p-0">
                            <div className="border-b border-base-300 px-4 py-3">
                                <h2 className="font-semibold">Theo trình độ</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Level</th>
                                            <th>Số lượt</th>
                                            <th>Điểm TB</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultsByLevel.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-8 text-center text-sm text-base-content/60">Không có dữ liệu.</td>
                                            </tr>
                                        ) : (
                                            resultsByLevel.map((row) => (
                                                <tr key={row.level}>
                                                    <td>{row.level}</td>
                                                    <td>{row.attempts}</td>
                                                    <td>{row.avg_score}%</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="card border border-base-300 bg-base-100">
                        <div className="card-body p-0">
                            <div className="border-b border-base-300 px-4 py-3">
                                <h2 className="font-semibold">7 ngày gần đây</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Số lượt làm bài</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentDailyAttempts.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="py-8 text-center text-sm text-base-content/60">Không có dữ liệu.</td>
                                            </tr>
                                        ) : (
                                            recentDailyAttempts.map((row) => (
                                                <tr key={row.day}>
                                                    <td>{row.day}</td>
                                                    <td>{row.attempts}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
