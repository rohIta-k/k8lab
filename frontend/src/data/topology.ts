import type { TopologyGraph } from "../types/topology";

import { topologyNodes } from "./topologyNodes";
import { topologyEdges } from "./topologyEdges";

export const topologyData: TopologyGraph = {
  clusterName: "kind-dev",

  namespace: "frontend",

  nodes: topologyNodes,

  edges: topologyEdges,
};