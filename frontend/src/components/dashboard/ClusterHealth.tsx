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
    <Card className="min-h-[370px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Cluster Health
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Core control-plane components are healthy.
          </p>
        </div>

        <Badge variant="success">
          Healthy
        </Badge>
      </div>

      <div className="space-y-3">
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
              className="flex items-center justify-between rounded-[24px] border border-white/5 bg-[var(--background-elevated)]/70 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
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

              <Badge variant={variant} className="shrink-0">
                {component.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}