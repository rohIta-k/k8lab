import type { TopologyNode } from "../types/topology";

export const topologyNodes: TopologyNode[] = [
  {
    id: "cluster",
    type: "cluster",
    position: { x: 500, y: 40 },
    data: {
      label: "kind-dev",
    },
  },

  {
    id: "worker-node-1",
    type: "node",
    position: { x: 180, y: 200 },
    data: {
      label: "worker-node-1",
    },
  },

  {
    id: "worker-node-2",
    type: "node",
    position: { x: 820, y: 200 },
    data: {
      label: "worker-node-2",
    },
  },

  {
    id: "frontend-deployment",
    type: "deployment",
    position: { x: 180, y: 380 },
    data: {
      label: "frontend-deployment",
    },
  },

  {
    id: "frontend-rs",
    type: "replicaSet",
    position: { x: 180, y: 540 },
    data: {
      label: "frontend-rs",
    },
  },

  {
    id: "frontend-pod-a",
    type: "pod",
    position: { x: 60, y: 720 },
    data: {
      label: "frontend-pod-a",
      status: "Running",
    },
  },

  {
    id: "frontend-pod-b",
    type: "pod",
    position: { x: 300, y: 720 },
    data: {
      label: "frontend-pod-b",
      status: "Running",
    },
  },

  {
    id: "frontend-service",
    type: "service",
    position: { x: 820, y: 380 },
    data: {
      label: "frontend-service",
    },
  },

  {
    id: "frontend-ingress",
    type: "ingress",
    position: { x: 820, y: 120 },
    data: {
      label: "frontend-ingress",
    },
  },

  {
    id: "frontend-config",
    type: "configMap",
    position: { x: 1040, y: 540 },
    data: {
      label: "frontend-config",
    },
  },

  {
    id: "frontend-secret",
    type: "secret",
    position: { x: 1040, y: 720 },
    data: {
      label: "db-secret",
    },
  },
];