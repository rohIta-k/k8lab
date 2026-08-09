import type { ClusterProvider, ClusterStatus } from "../types/cluster";

export function formatClusterVersion(version: string): string {
  return `Kubernetes ${version}`;
}

export function getProviderLabel(provider: ClusterProvider): string {
  switch (provider) {
    case "kind":
      return "Kind";

    case "minikube":
      return "Minikube";

    case "k3d":
      return "K3d";

    default:
      return provider;
  }
}

export function isClusterConnected(status: ClusterStatus): boolean {
  return status === "Connected";
}

export function getClusterStatusColor(status: ClusterStatus): string {
  switch (status) {
    case "Connected":
      return "var(--success)";

    case "Available":
      return "var(--info)";

    case "Stopped":
      return "var(--warning)";

    case "Disconnected":
      return "var(--danger)";

    default:
      return "var(--text-muted)";
  }
}

export function getClusterDisplayName(
  name: string,
  provider: ClusterProvider
): string {
  return `${name} (${getProviderLabel(provider)})`;
}