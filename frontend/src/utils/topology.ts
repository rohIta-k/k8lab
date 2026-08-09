import { COLORS } from "../constants/colors";

import type {
  TopologyEdge,
  TopologyNode,
  TopologyNodeType,
} from "../types/topology";

export function findNode(
  nodes: TopologyNode[],
  nodeId: string
): TopologyNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

export function getConnectedEdges(
  edges: TopologyEdge[],
  nodeId: string
): TopologyEdge[] {
  return edges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );
}

export function getChildNodes(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
  nodeId: string
): TopologyNode[] {
  const childIds = edges
    .filter((edge) => edge.source === nodeId)
    .map((edge) => edge.target);

  return nodes.filter((node) => childIds.includes(node.id));
}

export function getParentNodes(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
  nodeId: string
): TopologyNode[] {
  const parentIds = edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);

  return nodes.filter((node) => parentIds.includes(node.id));
}

const NODE_COLORS: Record<TopologyNodeType, string> = {
  cluster: COLORS.resources.cluster,
  node: COLORS.resources.node,
  deployment: COLORS.resources.deployment,
  replicaSet: COLORS.resources.replicaSet,
  pod: COLORS.resources.pod,
  service: COLORS.resources.service,
  ingress: COLORS.resources.ingress,
  configMap: COLORS.resources.configMap,
  secret: COLORS.resources.secret,
};

export function getNodeColor(type: TopologyNodeType): string {
  return NODE_COLORS[type];
}