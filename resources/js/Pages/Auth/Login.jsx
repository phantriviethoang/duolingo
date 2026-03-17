import { Head, Link, useForm } from "@inertiajs/react";
// import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { route } from "ziggy-js";
import Logo from "@/Components/Logo";

export default function Login({ canResetPassword = true }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    const registerHref = useMemo(() => {
        try {
            return route("register");
        } catch (e) {
            return "/register";
        }
    }, []);

    const forgotHref = useMemo(() => {
        if (!canResetPassword) return null;
        try {
            return route("password.request");
        } catch (e) {
            return "#";
        }
    }, [canResetPassword]);

    return (
        <>
            <Head title="Đăng nhập" />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-xl shadow-xl rounded-xl border-none bg-white p-10 text-center ">
                    <div className="mx-auto mb-6 flex justify-center">
                        <Logo className="h-16 w-16" />
                    </div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Đăng nhập
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6 text-left"
                    >
                        <div>
                            <label className="text-sm font-medium text-slate-700">
                                Tài khoản
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-2 w-full border-slate-400 bg-transparent py-2 text-lg text-slate-800 outline-none focus:border-slate-900"
                                placeholder="Nhập email của bạn"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">
                                Mật khẩu
                            </label>
                            <div className="mt-2 flex items-center border-slate-400">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full bg-transparent py-2 text-lg text-slate-800 outline-none"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-full bg-[#1f7dd8] py-3 text-lg font-semibold text-white transition hover:bg-[#1761ac] disabled:opacity-60"
                        >
                            {processing ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-sm text-slate-700">
                        <Link
                            href={registerHref}
                            className="hover:text-[#1f7dd8]"
                        >
                            Đăng ký tài khoản
                        </Link>
                        {canResetPassword && (
                            <Link
                                href={forgotHref || "#"}
                                className="hover:text-[#1f7dd8]"
                            >
                                Quên mật khẩu?
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
