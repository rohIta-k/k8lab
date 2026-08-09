import {
  Boxes,
  Box,
  Network,
  Server,
} from "lucide-react";

import { dashboardData } from "../../data/dashboard";

import StatCard from "../layout/StatCard";

export default function DashboardStats() {
  const { stats } = dashboardData;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Nodes"
        value={stats.nodes}
        icon={Server}
        variant="info"
      />

      <StatCard
        title="Namespaces"
        value={stats.namespaces}
        icon={Box}
        variant="success"
      />

      <StatCard
        title="Pods"
        value={stats.pods}
        icon={Boxes}
        variant="primary"
      />

      <StatCard
        title="Deployments"
        value={stats.deployments}
        icon={Network}
        variant="warning"
      />

      <StatCard
        title="Services"
        value={stats.services}
        icon={Server}
        variant="info"
      />
    </div>
  );
}