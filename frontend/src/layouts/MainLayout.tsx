import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
            <Sidebar />

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Topbar />

                <section className="content-padding flex-1 overflow-y-auto">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}