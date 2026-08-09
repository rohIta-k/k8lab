import { useClusterStore } from "../store";

export function useCluster() {
  const {
    clusters,
    currentCluster,
    setCurrentCluster,
    refreshClusters,
  } = useClusterStore((state) => ({
    clusters: state.clusters,
    currentCluster: state.currentCluster,
    setCurrentCluster: state.setCurrentCluster,
    refreshClusters: state.refreshClusters,
  }));

  return {
    clusters,
    currentCluster,
    setCurrentCluster,
    refreshClusters,
  };
}