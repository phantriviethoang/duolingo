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
                            Tests
                        </Link>
                        <Link className="nav-link" href="/flashcards">
                            Flashcards
                        </Link>

                        <Link href="/login">
                            <button className="btn">Đăng nhập</button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main>{children}</main>
        </Fragment>
    );
}
