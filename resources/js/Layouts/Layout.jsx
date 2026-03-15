import AppHeader from "@/Components/AppHeader";
import { Fragment } from "react/jsx-runtime";

export default function Layout({ children }) {
    return (
        <Fragment>
            <AppHeader />
            <main className="mx-auto max-w-6xl px-6 pb-0 pt-24">{children}</main>
        </Fragment>
    );
}
