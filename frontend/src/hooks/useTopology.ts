import { useTopologyStore } from "../store";

export function useTopology() {
  const {
    topology,
    selection,
    viewport,
    setSelectedNode,
    setSelectedEdge,
    setZoom,
    resetSelection,
  } = useTopologyStore((state) => ({
    topology: state.topology,
    selection: state.selection,
    viewport: state.viewport,
    setSelectedNode: state.setSelectedNode,
    setSelectedEdge: state.setSelectedEdge,
    setZoom: state.setZoom,
    resetSelection: state.resetSelection,
  }));

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