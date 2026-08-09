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
  return (
    <Card>
      <h3 className="mb-5 text-base font-semibold text-[var(--text-primary)]">
        Overview
      </h3>

      <div className="space-y-4">
        {"status" in resource && (
          <OverviewRow
            label="Status"
            value={
              <StatusChip status={resource.status} />
            }
          />
        )}

        {"labels" in resource && (
          <OverviewRow
            label="Labels"
            value={
              <div className="flex flex-wrap gap-2">
                {Object.entries(resource.labels).map(
                  ([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                    >
                      {key}={value}
                    </Badge>
                  )
                )}
              </div>
            }
          />
        )}

        {"image" in resource && (
          <OverviewRow
            label="Image"
            value={resource.image}
          />
        )}

        {"replicas" in resource && (
          <OverviewRow
            label="Replicas"
            value={resource.replicas.toString()}
          />
        )}

        {"strategy" in resource && (
          <OverviewRow
            label="Strategy"
            value={resource.strategy}
          />
        )}

        {"type" in resource &&
          typeof resource.type === "string" && (
            <OverviewRow
              label="Type"
              value={resource.type}
            />
          )}

        <OverviewRow
          label="Age"
          value={resource.age}
        />
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
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-[var(--text-muted)]">
        {label}
      </span>

      <div className="text-right text-sm text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}