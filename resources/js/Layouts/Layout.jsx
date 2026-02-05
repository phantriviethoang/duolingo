import AppHeader from "@/Components/AppHeader";
import { Fragment } from "react/jsx-runtime";

export default function Layout({ children }) {
    return (
        <Fragment>
            <AppHeader />
            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </Fragment>
    );
}
