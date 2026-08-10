import {
  Activity,
  Box,
  Boxes,
  FlaskConical,
  Network,
} from "lucide-react";

import Badge from "../common/Badge";
import Card from "../common/Card";

import type { ActivityItem } from "../../types/activity";

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityIcons = {
  Deployment: Boxes,
  ReplicaSet: Boxes,
  Pod: Box,
  Service: Network,
  Experiment: FlaskConical,
  Cluster: Network,
} as const;

const badgeVariants = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  error: "danger",
} as const;

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const hours = String(
    date.getHours(),
  ).padStart(2, "0");
  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");
  const seconds = String(
    date.getSeconds(),
  ).padStart(2, "0");

  const milliseconds = String(
    date.getMilliseconds(),
  ).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Latest activity from the current cluster.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-[var(--radius-md)] bg-[var(--background-hover)] p-4 text-sm text-[var(--text-secondary)]">
          No recent activity.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon =
              activityIcons[
                activity.type as keyof typeof activityIcons
              ] ?? Activity;

            const variant =
              badgeVariants[
                activity.status as keyof typeof badgeVariants
              ] ?? "info";

            return (
              <div
                key={activity.id}
                className="rounded-[var(--radius-md)] bg-[var(--background-hover)] p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={18}
                      className="text-[var(--primary)]"
                    />

                    <Badge variant={variant}>
                      {activity.type}
                    </Badge>
                  </div>

                  <span className="shrink-0 text-sm text-[var(--text-muted)]">
                    {formatDateTime(
                      activity.createdAt,
                    )}
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
      )}
    </Card>
  );
}