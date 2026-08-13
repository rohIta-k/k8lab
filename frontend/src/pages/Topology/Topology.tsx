import {
  useCallback,
  useEffect,
} from "react";

import {
  ReactFlowProvider,
} from "reactflow";

import {
  TopologyCanvas,
  TopologyControls,
  TopologyLegend
} from "../../components/topology";

import {
  useCluster,
  useTopology,
} from "../../hooks";

import { topologyService } from "../../services/topologyService";

export default function Topology() {
  const { currentCluster } = useCluster();

  const {
    topology,
    loading,
    error,
    setTopology,
    setLoading,
    setError,
    resetSelection,
  } = useTopology();

  const fetchTopology = useCallback(
    async () => {
      if (!currentCluster) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await topologyService.getTopology(
            currentCluster.id
          );

        setTopology(data);
        resetSelection();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch topology."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      currentCluster?.id,
      setTopology,
      setLoading,
      setError,
      resetSelection,
    ]
  );

  useEffect(() => {
    fetchTopology();
  }, [fetchTopology]);

  if (!currentCluster) {
    return (
      <div className="space-y-6">

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 text-sm text-[var(--text-secondary)]">
          No cluster connected.
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col">

        {loading && (
          <div className="mt-4 text-sm text-[var(--text-secondary)]">
            Loading topology...
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="mt-6 grid min-h-0 flex-1 gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <TopologyLegend />

          <div className="relative min-h-[600px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)]">
            <TopologyCanvas />

            <TopologyControls />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}