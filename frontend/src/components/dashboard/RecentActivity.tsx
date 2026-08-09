import {
  Activity,
  Box,
  Boxes,
  FlaskConical,
  Network,
} from "lucide-react";

import { dashboardData } from "../../data/dashboard";

import Badge from "../common/Badge";
import Card from "../common/Card";

const activityIcons = {
  Deployment: Boxes,
  ReplicaSet: Boxes,
  Pod: Box,
  Service: Network,
  Experiment: FlaskConical,
};

const badgeVariants = {
  success: "success",
  warning: "warning",
  danger : "danger",
  info: "info",
} as const;

export default function RecentActivity() {
  return (
    <Card>
      <div className="mb-6 flex items-center gap-2">
        <Activity
          size={20}
          className="text-[var(--primary)]"
        />

        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Recent Activity
        </h2>
      </div>

      <div className="space-y-4">
        {dashboardData.recentActivity.map((activity) => {
          const Icon =
            activityIcons[activity.type] ?? Activity;

          return (
            <div
              key={activity.id}
              className="rounded-[var(--radius-md)] bg-[var(--background-hover)] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    size={18}
                    className="text-[var(--primary)]"
                  />

                  <Badge
                    variant={
                      badgeVariants[activity.status]
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>

                <span className="text-xs text-[var(--text-muted)]">
                  {activity.time}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {activity.title}
              </h3>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {activity.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}