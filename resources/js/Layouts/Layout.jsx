import { Link } from "@inertiajs/react";
import { Fragment } from "react/jsx-runtime";

export default function Layout({ children }) {
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

                        <Link href="/login">
                            <button className="btn">Đăng nhập</button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="max-x-7xl mx-auto px-6">{children}</main>
        </Fragment>
    );
}
