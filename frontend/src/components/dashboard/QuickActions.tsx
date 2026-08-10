import {
  ArrowRight,
  Box,
  FlaskConical,
  Network,
} from "lucide-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

import { dashboardData } from "../../data/dashboard";

import Card from "../common/Card";

const actionIcons = {
  resource: Box,
  experiment: FlaskConical,
  topology: Network,
};

export default function QuickActions() {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-(--text-primary)">
        Quick Actions
      </h2>

      <div className="grid gap-3 md:grid-cols-3">
        {dashboardData.quickActions.map((action) => {
          const Icon =
            actionIcons[action.action] ?? ArrowRight;

          return (
            <NavLink
              key={action.id}
              to={action.path}
              className={({ isActive }) =>
                clsx(
                  "flex min-h-34 flex-col items-center justify-center rounded-md border border-(--border-color) bg-(--background-hover) px-4 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-(--primary) hover:bg-(--background-card)",
                  isActive &&
                    "border-(--primary) bg-(--background-card) shadow-[0_12px_24px_rgba(59,130,246,0.12)]"
                )
              }
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-(--background-card)">
                <Icon
                  size={18}
                  className="text-(--primary)"
                />
              </div>

              <h3 className="text-sm font-semibold text-(--text-primary)">
                {action.title}
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-(--text-secondary)">
                {action.description}
              </p>
            </NavLink>
          );
        })}
      </div>
    </Card>
  );
}