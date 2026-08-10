import { api } from "./api";

import type {
  Cluster,
  ClusterProvider,
} from "../types/cluster";

import type {
  DashboardData,
} from "../types/dashboard";

export interface CreateClusterRequest {
  name: string;
  provider?: ClusterProvider;
}

export interface ProviderInfo {
  name: ClusterProvider;
  available: boolean;
}

export const clusterService = {
  getClusters() {
    return api.get<Cluster[]>(
      "/api/clusters",
    );
  },

  getProviders() {
    return api.get<ProviderInfo[]>(
      "/api/clusters/providers",
    );
  },

  createCluster(
    data: CreateClusterRequest,
  ) {
    return api.post<Cluster>(
      "/api/clusters",
      data,
    );
  },

  deleteCluster(id: string) {
    return api.delete<{
      message: string;
    }>(
      `/api/clusters/${encodeURIComponent(id)}`,
    );
  },

  connectCluster(id: string) {
    return api.post<Cluster>(
      `/api/clusters/${encodeURIComponent(id)}/connect`,
    );
  },

  getDashboard(id: string) {
    return api.get<DashboardData>(
      `/api/clusters/${encodeURIComponent(id)}/dashboard`,
    );
  },
};