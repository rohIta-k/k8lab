import {
  Handle,
  Position,
  type NodeProps,
} from "reactflow";

import {
  TOPOLOGY_NODE_CONFIG,
} from "../../../constants/topology";

export default function TopologyNode({
  type = "pod",
  data,
}: NodeProps) {
  const config =
    TOPOLOGY_NODE_CONFIG[
      type as keyof typeof TOPOLOGY_NODE_CONFIG
    ] ??
    TOPOLOGY_NODE_CONFIG.pod;

  const Icon = config.icon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
      />

      <div
        className="min-w-[160px] max-w-[240px] rounded-[var(--radius-lg)] border bg-[var(--background-card)] p-4 shadow-[var(--shadow-md)] transition-all hover:shadow-[var(--shadow-lg)]"
        style={{
          borderColor: config.color,
          borderWidth: config.borderWidth,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: `${config.color}20`,
            }}
          >
            <Icon
              size={18}
              style={{
                color: config.color,
              }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="break-words text-sm font-semibold text-[var(--text-primary)]"
              title={data.label}
            >
              {data.label}
            </p>

            {data.status && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {data.status}
              </p>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />
    </>
  );
}