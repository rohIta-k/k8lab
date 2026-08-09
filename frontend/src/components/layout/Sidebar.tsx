import { SIDEBAR_ITEMS } from "../../constants/navigation";
import SidebarItem from "./SidebarItem";

import logo from "../../assets/logos/k8lab-icon.svg";

export default function Sidebar() {
  return (
    <aside
      className="flex h-full flex-col"
      style={{
        width: "var(--sidebar-width)",
        borderRight: "1px solid var(--border-color)",
        background:
          "linear-gradient(180deg, rgba(5, 9, 20, 0.98) 0%, rgba(10, 16, 32, 0.98) 100%)",
        boxShadow: "inset -1px 0 0 rgba(255, 255, 255, 0.04)",
        padding: "24px 16px",
      }}
    >
      {/* Logo / Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <img
          src={logo}
          alt="K8Lab"
          className="h-10 w-10"
        />

        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            K8Lab
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
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