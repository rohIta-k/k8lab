import { useTopologyStore } from "../store";

export function useTopology() {
  const topology = useTopologyStore(
    (state) => state.topology
  );

  const selection = useTopologyStore(
    (state) => state.selection
  );

  const viewport = useTopologyStore(
    (state) => state.viewport
  );

  const setSelectedNode = useTopologyStore(
    (state) => state.setSelectedNode
  );

  const setSelectedEdge = useTopologyStore(
    (state) => state.setSelectedEdge
  );

  const setZoom = useTopologyStore(
    (state) => state.setZoom
  );

  const resetSelection = useTopologyStore(
    (state) => state.resetSelection
  );

  return {
    topology,
    selection,
    viewport,
    setSelectedNode,
    setSelectedEdge,
    setZoom,
    resetSelection,
  };
}