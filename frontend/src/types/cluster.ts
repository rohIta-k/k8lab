export type ClusterProvider =
  | "kind"
  | "minikube"

export type ClusterStatus =
  | "Connected"
  | "Available"
  | "Connecting"
  | "Stopped"
  | "Disconnected";

export type ClusterHealthStatus =
  | "Healthy"
  | "Unhealthy";

export interface Cluster {
  id: string;

  name: string;

  provider: ClusterProvider;

  version: string;

  status: ClusterStatus;

  nodes: number;

  current: boolean;
}

export interface ConnectedCluster {
  id: string;

  name: string;

  provider: ClusterProvider;

  version: string;

  status: "Connected";
}

export interface ClusterHealth {
  id: string;
  name: string;
  status: ClusterHealthStatus;
  reason?: string;
}

export interface ClusterAction {
  id: string;

  label: string;
}