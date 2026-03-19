import { Head, Link } from "@inertiajs/react";
import {
    Compass,
    ChevronRight,
    BookOpen,
    Settings,
    Layers,
    ArrowUpRight,
    PlusCircle,
    Info,
} from "lucide-react";
import AdminLayout from "../Layout";

export default function PathIndex({ pathData, levels }) {
    const getPassThreshold = (part) => {
        const thresholds = { 1: 60, 2: 75, 3: 90 };
        return thresholds[part];
    };

    return (
        <AdminLayout current="/admin/path">
            <Head title="Quản lý lộ trình học tập" />

            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Cấu trúc Lộ trình
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Quản lý hệ thống Level, Part và quy tắc mở khóa.
                        </p>
                    </div>
                    <Link
                        href={route("tests.create")}
                        className="btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-2xl px-6 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Tạo nội dung mới
                    </Link>
                </div>

                <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 flex items-start gap-4">
                    <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <div className="text-sm text-blue-800 leading-relaxed">
                        <p className="font-bold mb-1">Quy tắc hệ thống:</p>
                        <ul className="list-disc list-inside space-y-1 opacity-80">
                            <li>Người dùng bắt đầu từ Level A1.</li>
                            <li>
                                Hoàn thành Part trước với điểm tối thiểu để mở
                                Part sau.
                            </li>
                            <li>
                                Hoàn thành đủ 3 Part của Level hiện tại để mở
                                khóa Level tiếp theo.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Levels Hierarchy */}
                <div className="grid grid-cols-1 gap-8">
                    {levels.map((level) => (
                        <div
                            key={level}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
                        >
                            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                        {level}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">
                                            Trình độ {level}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                            CEFR Standard
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route("path.parts", level)}
                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Xem giao diện học viên"
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((part) => (
                                        <div
                                            key={part}
                                            className="relative p-6 rounded-2xl border-2 border-gray-50 bg-gray-50/30 hover:border-blue-100 hover:bg-blue-50/30 transition-all group/part"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                                    Phần {part}
                                                </span>
                                                <div className="flex gap-1">
                                                    <span className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                                                        Yêu cầu:{" "}
                                                        {getPassThreshold(part)}
                                                        %
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-gray-900">
                                                        {
                                                            pathData[level][
                                                                `part${part}`
                                                            ]
                                                        }
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                                                        Bộ đề thi
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={route("admin.tests", {
                                                        level,
                                                        part,
                                                    })}
                                                    className="flex-1 bg-white border border-gray-200 py-2 rounded-xl text-xs font-black text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-center"
                                                >
                                                    Quản lý bộ đề
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
