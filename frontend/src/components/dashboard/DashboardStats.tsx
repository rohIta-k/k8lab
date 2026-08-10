import {
  Boxes,
  Box,
  Network,
  Server,
} from "lucide-react";

import StatCard from "../layout/StatCard";

import type { DashboardStats as DashboardStatsData } from "../../types/dashboard";

interface DashboardStatsProps {
  stats?: DashboardStatsData;
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Namespaces"
          value="—"
          icon={Box}
          variant="success"
        />

        <StatCard
          title="Pods"
          value="—"
          icon={Boxes}
          variant="primary"
        />

        <StatCard
          title="Deployments"
          value="—"
          icon={Network}
          variant="warning"
        />

        <StatCard
          title="Services"
          value="—"
          icon={Server}
          variant="info"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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