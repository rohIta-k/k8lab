import type { ActivityItem } from "./activity";
import type { ClusterHealth } from "./cluster";

export interface DashboardStats {
  nodes: number;
  namespaces: number;
  pods: number;
  deployments: number;
  services: number;
}

export interface DashboardData {
  stats: DashboardStats;

  health: ClusterHealth[];

  recentActivity: ActivityItem[];

  quickActions: QuickAction[];
}

export type QuickActionType =
  | "resource"
  | "experiment"
  | "topology";

export interface QuickAction {
  id: string;
  action: QuickActionType;
  title: string;
  description: string;
}