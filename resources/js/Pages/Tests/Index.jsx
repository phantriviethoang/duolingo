import { Clock, Users, MessageCircle, Info } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

export default function Index() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 mt-20 bg-base-100 mx-auto gap-10">
            {/* map */}
            <div className="card-body gap-4 border rounded-2xl">
                <h2 className="card-title text-lg font-semibold">
                    TOEIC Test 1
                </h2>

                <div className="space-y-3 text-sm text-base-content/80">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                            Thời gian làm bài: <strong>40 phút</strong> | 4 phần
                            thi | 40 câu hỏi | 3193 bình luận
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>
                            <strong>1,164,912</strong> người đã luyện tập đề thi
                            này
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm mt-2">
                    <Info size={16} className="mt-0.5" />
                    <span>
                        Sẵn sàng để bắt đầu làm test? Chúc bạn đạt được kết quả
                        tốt nhất
                    </span>
                </div>

                <div className="card-actions justify-center mt-4">
                    <button className="btn btn-active">Bắt đầu thi</button>
                </div>
            </div>
            <div className="card-body gap-4 border rounded-2xl">
                <h2 className="card-title text-lg font-semibold">
                    TOEIC Test 1
                </h2>

                <div className="space-y-3 text-sm text-base-content/80">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                            Thời gian làm bài: <strong>40 phút</strong> | 4 phần
                            thi | 40 câu hỏi | 3193 bình luận
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>
                            <strong>1,164,912</strong> người đã luyện tập đề thi
                            này
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm mt-2">
                    <Info size={16} className="mt-0.5" />
                    <span>
                        Sẵn sàng để bắt đầu làm test? Chúc bạn đạt được kết quả
                        tốt nhất
                    </span>
                </div>

                <div className="card-actions justify-center mt-4">
                    <button className="btn btn-active">Bắt đầu thi</button>
                </div>
            </div>
            <div className="card-body gap-4 border rounded-2xl">
                <h2 className="card-title text-lg font-semibold">
                    TOEIC Test 1
                </h2>

                <div className="space-y-3 text-sm text-base-content/80">
                    <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>
                            Thời gian làm bài: <strong>40 phút</strong> | 4 phần
                            thi | 40 câu hỏi | 3193 bình luận
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>
                            <strong>1,164,912</strong> người đã luyện tập đề thi
                            này
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm mt-2">
                    <Info size={16} className="mt-0.5" />
                    <span>
                        Sẵn sàng để bắt đầu làm test? Chúc bạn đạt được kết quả
                        tốt nhất
                    </span>
                </div>

                <div className="card-actions justify-center mt-4">
                    <button className="btn btn-active">Bắt đầu thi</button>
                </div>
            </div>
        </div>
    );
}
