import { useTopologyStore } from "../store";

export function useTopology() {
  const topology = useTopologyStore(
    (state) => state.topology
  );

  const loading = useTopologyStore(
    (state) => state.loading
  );

  const error = useTopologyStore(
    (state) => state.error
  );

  const selection = useTopologyStore(
    (state) => state.selection
  );

  const viewport = useTopologyStore(
    (state) => state.viewport
  );

  const displayFilters = useTopologyStore(
    (state) => state.displayFilters
  );

  const setTopology = useTopologyStore(
    (state) => state.setTopology
  );

  const setLoading = useTopologyStore(
    (state) => state.setLoading
  );

  const setError = useTopologyStore(
    (state) => state.setError
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

  const setDisplayFilter = useTopologyStore(
    (state) => state.setDisplayFilter
  );

  const resetSelection = useTopologyStore(
    (state) => state.resetSelection
  );

  return {
    topology,
    loading,
    error,
    selection,
    viewport,
    displayFilters,

    setTopology,
    setLoading,
    setError,

    setSelectedNode,
    setSelectedEdge,
    setZoom,
    setDisplayFilter,
    resetSelection,
  };
}