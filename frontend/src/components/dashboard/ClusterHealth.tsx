import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Badge from "../common/Badge";
import Card from "../common/Card";

import type { ClusterHealth as ClusterHealthData } from "../../types/cluster";

interface ClusterHealthProps {
  health: ClusterHealthData[];
}

export default function ClusterHealth({
  health,
}: ClusterHealthProps) {
  const allHealthy =
    health.length > 0 &&
    health.every(
      (component) =>
        component.status === "Healthy"
    );

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Cluster Health
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Current status of cluster components.
          </p>
        </div>
      </div>

      {health.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-elevated)] p-4 text-sm text-[var(--text-secondary)]">
          No health information available.
        </div>
      ) : (
        <div className="space-y-3">
          {health.map((component) => {
            const healthy =
              component.status === "Healthy";

            const Icon = healthy
              ? CheckCircle2
              : XCircle;

            return (
              <div
                key={component.id}
                className="rounded-[24px] border border-white/5 bg-[var(--background-elevated)]/70 px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        healthy
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      }
                    />

                    <span className="text-sm text-[var(--text-primary)]">
                      {component.name}
                    </span>
                  </div>

                  <Badge
                    variant={
                      healthy
                        ? "success"
                        : "danger"
                    }
                    className="shrink-0"
                  >
                    {component.status}
                  </Badge>
                </div>

                {!healthy &&
                  component.reason && (
                    <p className="mt-2 ml-7 text-xs text-[var(--text-secondary)]">
                      {component.reason}
                    </p>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}