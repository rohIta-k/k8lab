import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import { useCluster } from "../hooks";

export default function MainLayout() {
  const { fetchClusters } = useCluster();

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "var(--background-page)",
        color: "var(--text-primary)",
      }}
    >
      <Sidebar />

      <main
        className="flex min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          background: "var(--background-primary)",
        }}
      >
        <section className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </section>
      </main>
    </div>
  );
}