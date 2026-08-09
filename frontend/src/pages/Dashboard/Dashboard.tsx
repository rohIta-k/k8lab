import PageHeader from "../../components/layout/PageHeader";

import {
  DashboardStats,
  ClusterHealth,
  RecentActivity,
  QuickActions,
} from "../../components/dashboard";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your Kubernetes cluster."
      />

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <ClusterHealth />
        <RecentActivity />
      </div>

      <QuickActions />
    </div>
  );
}