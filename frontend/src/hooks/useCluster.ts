import { useClusterStore } from "../store";

export function useCluster() {
  const clusters = useClusterStore(
    (state) => state.clusters
  );

  const currentCluster = useClusterStore(
    (state) => state.currentCluster
  );

  const setCurrentCluster = useClusterStore(
    (state) => state.setCurrentCluster
  );

  const refreshClusters = useClusterStore(
    (state) => state.refreshClusters
  );

  return {
    clusters,
    currentCluster,
    setCurrentCluster,
    refreshClusters,
  };
}