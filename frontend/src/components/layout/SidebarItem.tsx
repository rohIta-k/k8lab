import { NavLink } from "react-router-dom";
import clsx from "clsx";

import type { NavigationItem } from "../../types/navigation";

interface SidebarItemProps {
  item: NavigationItem;
}

export default function SidebarItem({ item }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-md px-4 py-3 text-[15px] font-medium transition-colors",
          isActive
            ? "bg-(--primary)/35 text-(--text-primary) shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
            : "text-(--text-secondary) hover:bg-(--background-hover) hover:text-(--text-primary)"
        )
      }
    >
      <Icon
        size={18}
        strokeWidth={1.8}
      />

      <span>{item.label}</span>
    </NavLink>
  );
}