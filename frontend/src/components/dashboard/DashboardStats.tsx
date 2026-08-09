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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Pods"
        value={stats.pods}
        icon={Box}
        variant="success"
      />

      <StatCard
        title="Deployments"
        value={stats.deployments}
        icon={Boxes}
        variant="primary"
      />

      <StatCard
        title="Services"
        value={stats.services}
        icon={Network}
        variant="warning"
      />

      <StatCard
        title="Namespaces"
        value={stats.namespaces}
        icon={Server}
        variant="info"
      />
    </div>
  );
}