import type { DashboardData } from "../types/dashboard";

import {
  EXPERIMENTS_ROUTE,
  RESOURCES_ROUTE,
  TOPOLOGY_ROUTE,
} from "../constants/navigation";

export const dashboardData: DashboardData = {

  stats: {
    nodes: 2,
    namespaces: 5,
    pods: 18,
    deployments: 6,
    services: 7,
  },

  health: [
    {
      id: "api-server",
      name: "API Server",
      status: "Healthy",
    },

    {
      id: "scheduler",
      name: "Scheduler",
      status: "Healthy",
    },

    {
      id: "controller-manager",
      name: "Controller Manager",
      status: "Healthy",
    },

    {
      id: "core-dns",
      name: "CoreDNS",
      status: "Healthy",
    },
  ],

  recentActivity: [
    {
      id: 1,
      type: "Deployment",
      title: "Frontend deployment created",
      description: "frontend-deployment successfully created.",
      time: "2 min ago",
      status: "success",
    },

    {
      id: 2,
      type: "ReplicaSet",
      title: "ReplicaSet scaled",
      description: "frontend-rs scaled to 3 replicas.",
      time: "5 min ago",
      status: "success",
    },

    {
      id: 3,
      type: "Pod",
      title: "Backend pod restarted",
      description: "backend-pod entered CrashLoopBackOff.",
      time: "11 min ago",
      status: "warning",
    },

    {
      id: 4,
      type: "Service",
      title: "Frontend service exposed",
      description: "frontend-service created successfully.",
      time: "18 min ago",
      status: "success",
    },

    {
      id: 5,
      type: "Experiment",
      title: "CrashLoopBackOff experiment started",
      description: "Experiment resources deployed.",
      time: "32 min ago",
      status: "info",
    },
  ],

  quickActions: [
  {
    id: "create-resource",
    action: "resource",
    title: "Create Resource",
    description: "Deploy a new Kubernetes resource.",
    path: RESOURCES_ROUTE.path,
  },

  {
    id: "start-experiment",
    action: "experiment",
    title: "Start Experiment",
    description: "Launch a debugging experiment.",
    path: EXPERIMENTS_ROUTE.path,
  },

  {
    id: "view-topology",
    action: "topology",
    title: "View Topology",
    description: "Visualize resource relationships.",
    path: TOPOLOGY_ROUTE.path,
  },
]
};