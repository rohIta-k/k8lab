import type { Edge, Node } from "reactflow";

export type TopologyNodeType =
  | "cluster"
  | "node"
  | "deployment"
  | "replicaSet"
  | "pod"
  | "service"
  | "ingress"
  | "configMap"
  | "secret";

export interface TopologyNodeData {
  label: string;
  status?: string;
}

export type TopologyNode = Node<TopologyNodeData>;

export type TopologyEdge = Edge;

export interface TopologyGraph {
  clusterName: string;
  namespace: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
}

export interface TopologySelection {
  node: TopologyNode | null;
  edge: TopologyEdge | null;
}

export interface TopologyViewport {
  zoom: number;
  x: number;
  y: number;
}