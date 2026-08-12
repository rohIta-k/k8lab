import Badge from "../common/Badge";
import Card from "../common/Card";
import StatusChip from "../common/StatusChip";

import type { Resource } from "../../types/resources";

interface OverviewCardProps {
  resource: Resource;
}

export default function OverviewCard({
  resource,
}: OverviewCardProps) {
  const fields = resource.fields;

  return (
    <Card className="!p-2 shadow-none">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Overview
        </h3>
      </div>

      <div className="space-y-3 p-4">
        <OverviewRow
          label="Status"
          value={
            <StatusChip
              status={resource.status}
            />
          }
        />

        <OverviewRow
          label="Resource"
          value={formatResourceType(
            resource.type
          )}
        />

        {resource.namespace && (
          <OverviewRow
            label="Namespace"
            value={resource.namespace}
          />
        )}

        {"labels" in fields && (
          <OverviewRow
            label="Labels"
            value={
              <div className="flex flex-wrap justify-end gap-2">
                {Object.entries(
                  fields.labels
                ).length > 0 ? (
                  Object.entries(
                    fields.labels
                  ).map(
                    ([key, value]) => (
                      <Badge
                        key={key}
                        variant="secondary"
                      >
                        {key}={value}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-[var(--text-muted)]">
                    None
                  </span>
                )}
              </div>
            }
          />
        )}

        {"ready" in fields && (
          <OverviewRow
            label="Ready"
            value={fields.ready}
          />
        )}

        {"replicas" in fields && (
          <OverviewRow
            label="Replicas"
            value={fields.replicas.toString()}
          />
        )}

        {"image" in fields && (
          <OverviewRow
            label="Image"
            value={fields.image}
          />
        )}

        {"strategy" in fields && (
          <OverviewRow
            label="Strategy"
            value={fields.strategy}
          />
        )}

        {"owner" in fields && (
          <OverviewRow
            label="Owner"
            value={
              fields.owner || "-"
            }
          />
        )}

        {"restartCount" in fields && (
          <OverviewRow
            label="Restarts"
            value={fields.restartCount.toString()}
          />
        )}

        {"node" in fields && (
          <OverviewRow
            label="Node"
            value={fields.node || "-"}
          />
        )}

        {"ip" in fields && (
          <OverviewRow
            label="IP"
            value={fields.ip || "-"}
          />
        )}

        {"type" in fields && (
          <OverviewRow
            label="Type"
            value={String(fields.type)}
          />
        )}

        {"clusterIP" in fields && (
          <OverviewRow
            label="Cluster IP"
            value={fields.clusterIP}
          />
        )}

        {"ports" in fields && (
          <OverviewRow
            label="Ports"
            value={fields.ports.join(", ")}
          />
        )}

        {"selector" in fields && (
          <OverviewRow
            label="Selector"
            value={
              formatLabels(
                fields.selector
              )
            }
          />
        )}

        {"keys" in fields && (
          <OverviewRow
            label="Keys"
            value={fields.keys.toString()}
          />
        )}

        {"hosts" in fields && (
          <OverviewRow
            label="Hosts"
            value={
              fields.hosts.length > 0
                ? fields.hosts.join(", ")
                : "-"
            }
          />
        )}

        {"capacity" in fields && (
          <OverviewRow
            label="Capacity"
            value={fields.capacity}
          />
        )}

        {"completions" in fields && (
          <OverviewRow
            label="Completions"
            value={fields.completions}
          />
        )}

        {"schedule" in fields && (
          <OverviewRow
            label="Schedule"
            value={fields.schedule}
          />
        )}
      </div>
    </Card>
  );
}

interface OverviewRowProps {
  label: string;
  value: React.ReactNode;
}

function OverviewRow({
  label,
  value,
}: OverviewRowProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
      <span className="min-w-0 break-words text-sm text-[var(--text-muted)]">
        {label}
      </span>

      <div className="min-w-0 max-w-full break-words text-right text-sm text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

function formatLabels(
  labels: Record<string, string>
) {
  const entries =
    Object.entries(labels);

  if (entries.length === 0) {
    return "-";
  }

  return entries
    .map(
      ([key, value]) =>
        `${key}=${value}`
    )
    .join(", ");
}

function formatResourceType(
  type: string
) {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) =>
      char.toUpperCase()
    );
}