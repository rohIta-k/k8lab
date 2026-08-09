import {
  ArrowRight,
  Box,
  FlaskConical,
  Network,
} from "lucide-react";

import { dashboardData } from "../../data/dashboard";

import Button from "../common/Button";
import Card from "../common/Card";

const actionIcons = {
  resource: Box,
  experiment: FlaskConical,
  topology: Network,
};

export default function QuickActions() {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardData.quickActions.map((action) => {
          const Icon =
            actionIcons[action.action] ?? ArrowRight;

          return (
            <div
              key={action.id}
              className="rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-hover)] p-5 transition hover:border-[var(--primary)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--background-card)]">
                <Icon
                  size={20}
                  className="text-[var(--primary)]"
                />
              </div>

              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {action.description}
              </p>

              <Button
                variant="ghost"
                className="mt-4 w-full justify-between"
              >
                Open

                <ArrowRight size={16} />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}