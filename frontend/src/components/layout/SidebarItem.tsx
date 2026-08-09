import { NavLink } from "react-router-dom";
import clsx from "clsx";

import type { NavigationItem } from "../../types/navigation";

interface SidebarItemProps {
  item: NavigationItem;
}

export default function SidebarItem({
  item,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
        )
      }
    >
      <Icon size={18} />

      <span>{item.label}</span>
    </NavLink>
  );
}