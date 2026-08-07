import type { ActivityItem } from "./activity";
import type { ConnectedCluster, ClusterHealth } from "./cluster";

export interface DashboardStats {
  nodes: number;
  namespaces: number;
  pods: number;
  deployments: number;
  services: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
}

export interface DashboardData {
  cluster: ConnectedCluster;

  stats: DashboardStats;

  health: ClusterHealth[];

  recentActivity: ActivityItem[];

  quickActions: QuickAction[];
}