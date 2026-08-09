import Card from "../../common/Card";

import type { TopologyNode } from "../../../types/topology";

interface NodeDetailsProps {
  node: TopologyNode;
}

export default function NodeDetails({
  node,
}: NodeDetailsProps) {
  return (
    <Card>
      <h3 className="mb-5 text-base font-semibold text-[var(--text-primary)]">
        Node Details
      </h3>

      <div className="space-y-4">
        <DetailRow
          label="Name"
          value={node.data.label}
        />

        <DetailRow
          label="Type"
          value={node.type ?? "-"}
        />

        {node.data.status && (
          <DetailRow
            label="Status"
            value={node.data.status}
          />
        )}

        <DetailRow
          label="Node ID"
          value={node.id}
        />
      </div>
    </Card>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-muted)]">
        {label}
      </span>

      <span className="text-sm font-medium text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}