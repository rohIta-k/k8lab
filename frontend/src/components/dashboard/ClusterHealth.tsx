import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { dashboardData } from "../../data/dashboard";

import Badge from "../common/Badge";
import Card from "../common/Card";

export default function ClusterHealth() {
  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Cluster Health
        </h2>

        <Badge variant="success">
          Healthy
        </Badge>
      </div>

      <div className="space-y-4">
        {dashboardData.health.map((component) => {
          const variant =
            component.status === "Healthy"
              ? "success"
              : component.status === "Warning"
              ? "warning"
              : "danger";

          const Icon =
            component.status === "Healthy"
              ? CheckCircle2
              : component.status === "Warning"
              ? AlertTriangle
              : XCircle;

          return (
            <div
              key={component.id}
              className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--background-hover)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={
                    component.status === "Healthy"
                      ? "text-[var(--success)]"
                      : component.status === "Warning"
                      ? "text-[var(--warning)]"
                      : "text-[var(--danger)]"
                  }
                />

                <span className="text-sm text-[var(--text-primary)]">
                  {component.name}
                </span>
              </div>

              <Badge variant={variant}>
                {component.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}