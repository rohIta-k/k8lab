import { create } from "zustand";

import { clusters } from "../data/clusters";

import type { Cluster } from "../types/cluster";

interface ClusterStore {
  clusters: Cluster[];

  currentCluster: Cluster;

  setCurrentCluster: (clusterId: string) => void;

  refreshClusters: () => void;
}

export const useClusterStore = create<ClusterStore>((set, get) => ({
  clusters,

  currentCluster:
    clusters.find((cluster) => cluster.current) ?? clusters[0],

  setCurrentCluster: (clusterId) => {
    const cluster = get().clusters.find(
      (item) => item.id === clusterId
    );

    if (!cluster) {
      return;
    }

    set({
      currentCluster: cluster,

      clusters: get().clusters.map((item) => ({
        ...item,
        current: item.id === clusterId,
      })),
    });
  },

  refreshClusters: () => {
    set({
      clusters: [...clusters],
    });
  },
}));