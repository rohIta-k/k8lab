import type { Cluster, ClusterAction } from "../types/cluster";

export const clusters: Cluster[] = [
  {
    id: "kind-dev",
    name: "kind-dev",
    provider: "kind",
    version: "v1.34.0",
    status: "Connected",
    nodes: 2,
    current: true,
  },

  {
    id: "minikube",
    name: "minikube",
    provider: "minikube",
    version: "v1.34.0",
    status: "Available",
    nodes: 1,
    current: false,
  },

  {
    id: "demo-cluster",
    name: "demo-cluster",
    provider: "kind",
    version: "v1.33.4",
    status: "Stopped",
    nodes: 3,
    current: false,
  },
];

export const clusterActions: ClusterAction[] = [
  {
    id: "connect",
    label: "Connect Existing Cluster",
  },

  {
    id: "create",
    label: "Create Local Cluster",
  },

  {
    id: "delete",
    label: "Delete Current Cluster",
  },

  {
    id: "refresh",
    label: "Refresh Connection",
  },
];