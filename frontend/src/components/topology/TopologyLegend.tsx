import Card from "../common/Card";

import { COLORS } from "../../constants/colors";

const items = [
  {
    label: "Cluster",
    color: COLORS.resources.cluster,
  },
  {
    label: "Node",
    color: COLORS.resources.node,
  },
  {
    label: "Deployment",
    color: COLORS.resources.deployment,
  },
  {
    label: "ReplicaSet",
    color: COLORS.resources.replicaSet,
  },
  {
    label: "Pod",
    color: COLORS.resources.pod,
  },
  {
    label: "Service",
    color: COLORS.resources.service,
  },
  {
    label: "Ingress",
    color: COLORS.resources.ingress,
  },
  {
    label: "ConfigMap",
    color: COLORS.resources.configMap,
  },
  {
    label: "Secret",
    color: COLORS.resources.secret,
  },
];

export default function TopologyLegend() {
  return (
    <Card className="absolute bottom-6 left-6 z-20 w-52">
      <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
        Legend
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{
                background: item.color,
              }}
            />

            <span className="text-sm text-[var(--text-secondary)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}