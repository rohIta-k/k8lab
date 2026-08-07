export type ID = string;

export type Status =
  | "Running"
  | "Pending"
  | "Failed"
  | "Completed"
  | "Active"
  | "Healthy"
  | "Connected"
  | "Available"
  | "Stopped"
  | "Disconnected"
  | "CrashLoopBackOff"
  | "ImagePullBackOff"
  | "OOMKilled";

export interface Option<T = string> {
  label: string;
  value: T;
}

export interface Badge {
  label: string;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface Timestamp {
  createdAt: string;
  updatedAt?: string;
}