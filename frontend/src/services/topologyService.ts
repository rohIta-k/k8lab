import { api } from "./api";

import type {
  TopologyGraph,
} from "../types/topology";

export const topologyService = {
  getTopology(clusterId: string) {
    return api.get<TopologyGraph>(
      `/api/clusters/${encodeURIComponent(
        clusterId
      )}/topology`
    );
  },
};