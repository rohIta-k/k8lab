import type { LucideIcon } from "lucide-react";

export type RoutePath =
  | "/"
  | "/resources"
  | "/topology"
  | "/experiments";

export interface NavigationItem {
  id: string;

  label: string;

  path: RoutePath;

  icon: LucideIcon;
}

export interface ClusterMenuAction {
  id: string;

  label: string;

  destructive?: boolean;
}