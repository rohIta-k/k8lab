import clsx from "clsx";

import { COLORS } from "../../constants/colors";

import { useTopology } from "../../hooks";

const items = [
  {
    label: "Nodes",
    type: "node",
    color: COLORS.resources.node,
  },
  {
    label: "Deployments",
    type: "deployment",
    color: COLORS.resources.deployment,
  },
  {
    label: "ReplicaSets",
    type: "replicaSet",
    color: COLORS.resources.replicaSet,
  },
  {
    label: "Pods",
    type: "pod",
    color: COLORS.resources.pod,
  },
  {
    label: "Services",
    type: "service",
    color: COLORS.resources.service,
  },
  {
    label: "Ingresses",
    type: "ingress",
    color: COLORS.resources.ingress,
  },
  {
    label: "ConfigMaps",
    type: "configMap",
    color: COLORS.resources.configMap,
  },
] as const;

export default function TopologyLegend() {
  const {
    displayFilters,
    setDisplayFilter,
  } = useTopology();

  return (
    <aside className="h-full min-h-[600px] w-[240px] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-4 shadow-sm">
      <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Display Filters
      </h3>

      <div className="space-y-4">
        {items.map((item) => {
          const enabled =
            displayFilters[item.type];

          return (
            <div
              key={item.type}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    background: item.color,
                  }}
                />

                <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {item.label}
                </span>
              </div>

              <button
                type="button"
                aria-label={`Toggle ${item.label}`}
                aria-pressed={enabled}
                onClick={() =>
                  setDisplayFilter(
                    item.type,
                    !enabled
                  )
                }
                className={clsx(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
                  enabled
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--background-hover)]"
                )}
              >
                <span
                  className={clsx(
                    "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200",
                    enabled
                      ? "left-6"
                      : "left-1"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}