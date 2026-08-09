import {
  Box,
  FlaskConical,
  LayoutDashboard,
  Network,
} from "lucide-react";

import type {
  ClusterMenuAction,
  NavigationItem,
} from "../types/navigation";

export const DASHBOARD_ROUTE: NavigationItem = {
  id: "dashboard",
  label: "Dashboard",
  path: "/",
  icon: LayoutDashboard,
};

export const RESOURCES_ROUTE: NavigationItem = {
  id: "resources",
  label: "Resources",
  path: "/resources",
  icon: Box,
};

export const TOPOLOGY_ROUTE: NavigationItem = {
  id: "topology",
  label: "Topology",
  path: "/topology",
  icon: Network,
};

export const EXPERIMENTS_ROUTE: NavigationItem = {
  id: "experiments",
  label: "Experiments",
  path: "/experiments",
  icon: FlaskConical,
};

export const SIDEBAR_ITEMS: NavigationItem[] = [
  DASHBOARD_ROUTE,
  RESOURCES_ROUTE,
  TOPOLOGY_ROUTE,
  EXPERIMENTS_ROUTE,
];

export const CLUSTER_MENU_ACTIONS: ClusterMenuAction[] = [
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
    destructive: true,
  },
  {
    id: "refresh",
    label: "Refresh Connection",
  },
];