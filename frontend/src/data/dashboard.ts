import type { DashboardData } from "../types/dashboard";

export const dashboardData: DashboardData = {
  cluster: {
    id: "kind-dev",
    name: "kind-dev",
    provider: "kind",
    version: "v1.34.0",
    status: "Connected",
  },

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
      title: "Create Resource",
      description: "Deploy a new Kubernetes resource.",
    },

    {
      id: "start-experiment",
      title: "Start Experiment",
      description: "Launch a debugging experiment.",
    },

    {
      id: "view-topology",
      title: "View Topology",
      description: "Visualize resource relationships.",
    },
  ],
};