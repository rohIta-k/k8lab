import {
  ReactFlowProvider,
} from "reactflow";

import PageHeader from "../../components/layout/PageHeader";

import {
  TopologyCanvas,
  TopologyControls,
  TopologyLegend,
  TopologySidebar,
} from "../../components/topology";

export default function Topology() {
  return (
    <ReactFlowProvider>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Topology"
          description="Visualize relationships between Kubernetes resources."
        />

        <div className="mt-6 grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative min-h-[600px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)]">
            <TopologyCanvas />

            <TopologyControls />

            <TopologyLegend />
          </div>

          <TopologySidebar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}