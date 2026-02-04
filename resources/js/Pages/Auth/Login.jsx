import { Head, useForm } from "@inertiajs/react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <>
      <Head title="Đăng nhập" />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-center text-2xl font-bold mb-6">
              Đăng nhập
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) =>
                    setData("email", e.target.value)
                  }
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                  required
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mật khẩu</span>
                </label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) =>
                    setData("password", e.target.value)
                  }
                  className={`input input-bordered ${errors.password ? "input-error" : ""}`}
                  required
                />
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password}
                    </span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary w-full"
              >
                {processing ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
