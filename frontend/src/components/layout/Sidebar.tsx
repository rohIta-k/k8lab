import clsx from "clsx";

import { SIDEBAR_ITEMS } from "../../constants/navigation";

import { useUIStore } from "../../store";

import ClusterSelector from "./ClusterSelector";
import SidebarItem from "./SidebarItem";
import logo from "../../assets/logos/k8lab-icon.svg";

export default function Sidebar() {
  const { sidebarCollapsed } = useUIStore((state) => ({
    sidebarCollapsed: state.sidebarCollapsed,
  }));

  return (
    <aside
      className={clsx(
        "flex h-screen flex-col border-r border-[var(--border-color)] bg-[var(--background-sidebar)] transition-all duration-300",
        sidebarCollapsed
          ? "w-20"
          : "w-[var(--sidebar-width)]"
      )}
    >
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-6 py-5">
        <img
          src={logo}
          alt="K8Lab"
          className="h-9 w-9"
        />

        {!sidebarCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              K8Lab
            </h1>

            <p className="text-xs text-[var(--text-muted)]">
              Kubernetes Playground
            </p>
          </div>
        )}
      </div>

      <div className="border-b border-[var(--border-color)] p-4">
        <ClusterSelector />
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
          />
        ))}
      </nav>
    </aside>
  );
}