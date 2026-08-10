export type ActivityStatus =
  | "success"
  | "warning"
  | "danger"
  | "info";

export type ActivityType =
  | "Deployment"
  | "ReplicaSet"
  | "Pod"
  | "Service"
  | "Experiment";

export interface ActivityItem {
  id: number;

  type: ActivityType;

  title: string;

  description: string;

  createdAt: string;

  status: ActivityStatus;
}