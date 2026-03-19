import { Head, Link } from "@inertiajs/react";
import { Lock, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Forbidden({ level, part, required_score, previous_score }) {
    return (
        <AuthenticatedLayout>
            <Head title="Truy cập bị từ chối" />
            
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
                    <div className="bg-red-50 px-8 py-12 text-center border-b border-red-100/50">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl shadow-red-500/10 mb-6 border border-red-100">
                            <Lock className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Truy cập bị khóa</h1>
                        <p className="text-red-600 font-bold uppercase tracking-widest text-xs">Error 403 - Forbidden</p>
                    </div>

                    <div className="p-10 md:p-16 space-y-8">
                        <div className="text-center space-y-4">
                            <p className="text-lg text-gray-600 font-medium leading-relaxed">
                                Rất tiếc, bạn chưa thể truy cập <span className="text-gray-900 font-black">Trình độ {level} - Phần {part}</span> vào lúc này.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm font-bold">
                                <ShieldAlert className="w-4 h-4" />
                                Bạn cần hoàn thành phần trước đó để tiếp tục
                            </div>
                        </div>

                        {/* Progress Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Điểm của bạn</p>
                                <p className="text-3xl font-black text-gray-900">{previous_score}%</p>
                                <p className="text-xs text-gray-500 mt-1">Phần {part - 1}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 text-center">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Yêu cầu tối thiểu</p>
                                <p className="text-3xl font-black text-blue-600">{required_score}%</p>
                                <p className="text-xs text-blue-500 mt-1">Để mở khóa Phần {part}</p>
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <Link
                                href={route('path.parts', level)}
                                className="flex-1 btn btn-primary bg-blue-600 border-none hover:bg-blue-700 text-white rounded-2xl h-14 font-black shadow-lg shadow-blue-500/20"
                            >
                                Quay lại lộ trình
                            </Link>
                            <Link
                                href={route('progress.dashboard')}
                                className="flex-1 btn btn-outline border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-2xl h-14 font-black"
                            >
                                Kiểm tra tiến độ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
