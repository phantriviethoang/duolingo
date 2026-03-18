import AppHeader from "@/Components/AppHeader";
import { Fragment } from "react/jsx-runtime";

export default function Layout({ children }) {
    return (
        <Fragment>
            <AppHeader />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 pt-32">{children}</main>
        </Fragment>
    );
}
