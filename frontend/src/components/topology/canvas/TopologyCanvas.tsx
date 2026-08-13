import {
  Background,
  Controls,
  ReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

import {
  TOPOLOGY_NODE_CONFIG,
} from "../../../constants/topology";

import { useTopology } from "../../../hooks";

import TopologyNode from "./TopologyNode";
import TopologyEdge from "./TopologyEdge";

const nodeTypes = Object.fromEntries(
  Object.keys(TOPOLOGY_NODE_CONFIG).map(
    (type) => [
      type,
      TopologyNode,
    ]
  )
);

const edgeTypes = {
  default: TopologyEdge,
};

function Canvas() {
  const {
    topology,
    displayFilters,
    setSelectedNode,
    setSelectedEdge,
    setZoom,
  } = useTopology();

  const visibleNodes =
    topology.nodes.filter((node) => {
      const type =
        node.type ?? "pod";

      // Cluster should always remain visible.
      if (type === "cluster") {
        return true;
      }

      return (
        displayFilters[
          type as keyof typeof displayFilters
        ] ?? true
      );
    });

  const visibleNodeIds =
    new Set(
      visibleNodes.map(
        (node) => node.id
      )
    );

  const visibleEdges =
    topology.edges.filter(
      (edge) =>
        visibleNodeIds.has(
          edge.source
        ) &&
        visibleNodeIds.has(
          edge.target
        )
    );

  return (
    <ReactFlow
      nodes={visibleNodes}
      edges={visibleEdges}
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
    </ReactFlow>
  );
}

export default function TopologyCanvas() {
  return <Canvas />;
}