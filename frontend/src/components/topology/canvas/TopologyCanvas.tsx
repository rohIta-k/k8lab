import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";

import { TOPOLOGY_NODE_CONFIG } from "../../../constants/topology";

import { useTopology } from "../../../hooks";

import TopologyMiniMap from "./TopologyMiniMap";
import TopologyNode from "./TopologyNode";
import TopologyEdge from "./TopologyEdge";

const nodeTypes = Object.fromEntries(
  Object.keys(TOPOLOGY_NODE_CONFIG).map((type) => [
    type,
    TopologyNode,
  ])
);

const edgeTypes = {
  default: TopologyEdge,
};

function Canvas() {
  const {
    topology,
    setSelectedNode,
    setSelectedEdge,
    setZoom,
  } = useTopology();

  return (
    <ReactFlow
      nodes={topology.nodes}
      edges={topology.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      onNodeClick={(_, node) =>
        setSelectedNode(node)
      }
      onEdgeClick={(_, edge) =>
        setSelectedEdge(edge)
      }
      onPaneClick={() => {
        setSelectedNode(null);
        setSelectedEdge(null);
      }}
      onMove={(_, viewport) =>
        setZoom(viewport.zoom)
      }
    >
      <Background />

      <Controls />

      <TopologyMiniMap />
    </ReactFlow>
  );
}

export default function TopologyCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}