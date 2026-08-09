import { MiniMap } from "reactflow";

import { COLORS } from "../../../constants/colors";
import { TOPOLOGY_NODE_CONFIG } from "../../../constants/topology";

export default function TopologyMiniMap() {
  return (
    <MiniMap
      pannable
      zoomable
      nodeStrokeColor={(node) => {
        const config =
          TOPOLOGY_NODE_CONFIG[
            node.type as keyof typeof TOPOLOGY_NODE_CONFIG
          ];

        return (
          config?.color ??
          COLORS.border.default
        );
      }}
      nodeColor={() =>
        COLORS.background.card
      }
      nodeBorderRadius={12}
      maskColor="rgba(0,0,0,0.2)"
      className="rounded-[var(--radius-md)] border border-[var(--border-color)]"
    />
  );
}