import {
  DashboardStats,
  ClusterHealth,
  RecentActivity,
  QuickActions,
  ClusterSelector
} from "../../components/dashboard";

export default function Dashboard() {

  return (
    <div className="space-y-6">
      <ClusterSelector />

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ClusterHealth />
        </div>

        <div className="lg:col-span-8">
          <RecentActivity />
        </div>
      </div>

      <QuickActions />
    </div>
  );
}