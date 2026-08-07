import type { TopologyEdge } from "../types/topology";

export const topologyEdges: TopologyEdge[] = [
  {
    id: "cluster-node-1",
    source: "cluster",
    target: "worker-node-1",
    animated: true,
  },

  {
    id: "cluster-node-2",
    source: "cluster",
    target: "worker-node-2",
    animated: true,
  },

  {
    id: "node1-deployment",
    source: "worker-node-1",
    target: "frontend-deployment",
  },

  {
    id: "deployment-rs",
    source: "frontend-deployment",
    target: "frontend-rs",
    animated: true,
  },

  {
    id: "rs-pod-a",
    source: "frontend-rs",
    target: "frontend-pod-a",
    animated: true,
  },

  {
    id: "rs-pod-b",
    source: "frontend-rs",
    target: "frontend-pod-b",
    animated: true,
  },

  {
    id: "ingress-service",
    source: "frontend-ingress",
    target: "frontend-service",
    animated: true,
  },

  {
    id: "service-pod-a",
    source: "frontend-service",
    target: "frontend-pod-a",
    animated: true,
  },

  {
    id: "service-pod-b",
    source: "frontend-service",
    target: "frontend-pod-b",
    animated: true,
  },

  {
    id: "config-pod-a",
    source: "frontend-config",
    target: "frontend-pod-a",
  },

  {
    id: "config-pod-b",
    source: "frontend-config",
    target: "frontend-pod-b",
  },

  {
    id: "secret-pod-a",
    source: "frontend-secret",
    target: "frontend-pod-a",
  },

  {
    id: "secret-pod-b",
    source: "frontend-secret",
    target: "frontend-pod-b",
  },
];