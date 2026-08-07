export type ClusterProvider =
  | "kind"
  | "minikube"
  | "k3d";

export type ClusterStatus =
  | "Connected"
  | "Available"
  | "Stopped"
  | "Disconnected";

export type ClusterHealthStatus =
  | "Healthy"
  | "Warning"
  | "Error";

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
}

export interface ClusterAction {
  id: string;

  label: string;
}