import { Fragment } from "react/jsx-runtime";
import AppHeader from "../Components/AppHeader";

export default function AuthenticatedLayout({ children, fullWidth = false }) {
    return (
        <Fragment>
            <AppHeader />
            <main className={`mx-auto pb-8 pt-20 ${fullWidth ? 'max-w-full px-4 sm:px-8 lg:px-12' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
                {children}
            </main>
        </Fragment>
    );
}
