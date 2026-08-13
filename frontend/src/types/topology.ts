import type {
  Edge,
  Node,
} from "reactflow";

export type TopologyNodeType =
  | "cluster"
  | "node"
  | "deployment"
  | "replicaSet"
  | "pod"
  | "service"
  | "ingress"
  | "configMap";

export interface TopologyNodeData {
  label: string;
  status?: string;
}

export type TopologyNode =
  Node<TopologyNodeData>;

export type TopologyEdge = Edge;

export interface TopologyGraph {
  clusterId: string;
  clusterName: string;
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

export type TopologyDisplayFilters =
  Record<TopologyNodeType, boolean>;