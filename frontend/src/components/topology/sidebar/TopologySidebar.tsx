import Card from "../../common/Card";
import EmptyState from "../../common/EmptyState";

import { useTopology } from "../../../hooks";

import NodeDetails from "./NodeDetails";

export default function TopologySidebar() {
  const {
    selection,
  } = useTopology();

  if (!selection.node) {
    return (
      <Card className="h-full">
        <EmptyState
          title="No Node Selected"
          description="Select a node in the topology graph to inspect its details."
        />
      </Card>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <NodeDetails
        node={selection.node}
      />
    </div>
  );
}