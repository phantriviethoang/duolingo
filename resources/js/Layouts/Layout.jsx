import { Link, usePage } from "@inertiajs/react";
import { Fragment } from "react/jsx-runtime";

export default function Layout({ children }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const isAdmin = user?.role === "admin";

  return (
    <Fragment>
      <header>
        <nav>
          <Link className="" href="/">
            <img
              src="images/logo.png"
              className="w-10 h-10"
              alt="Logo"
            />
          </Link>
          <div className="space-x-2 flex items-center">
            <Link className="nav-link" href="/tests">
              Đề thi online
            </Link>
            <Link className="nav-link" href="/flashcards">
              Flashcards
            </Link>
            <Link className="nav-link" href="/results">
              Lịch sử
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <span>
                    Xin chào, <strong>{user.name}</strong>
                  </span>
                  {isAdmin && (
                    <span className="btn btn-sm btn-primary">
                      Admin
                    </span>
                  )}
                </div>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="btn btn-sm"
                >
                  Đăng xuất
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <button className="btn">Đăng nhập</button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="max-x-7xl mx-auto px-6">{children}</main>
    </Fragment>
  );
}
