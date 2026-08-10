import { useClusterStore } from "../store";

export function useCluster() {
  const clusters =
    useClusterStore(
      (state) => state.clusters
    );

  const currentCluster =
    useClusterStore(
      (state) => state.currentCluster
    );

  const loading =
    useClusterStore(
      (state) => state.loading
    );

  const error =
    useClusterStore(
      (state) => state.error
    );

  const setCurrentCluster =
    useClusterStore(
      (state) => state.setCurrentCluster
    );

  const fetchClusters =
    useClusterStore(
      (state) => state.fetchClusters
    );

  const connectCluster =
    useClusterStore(
      (state) => state.connectCluster
    );

  const createCluster =
    useClusterStore(
      (state) => state.createCluster
    );

  const deleteCluster =
    useClusterStore(
      (state) => state.deleteCluster
    );

  const clearError =
    useClusterStore(
      (state) => state.clearError
    );

  return {
    clusters,
    currentCluster,
    loading,
    error,
    setCurrentCluster,
    fetchClusters,
    connectCluster,
    createCluster,
    deleteCluster,
    clearError,
  };
}