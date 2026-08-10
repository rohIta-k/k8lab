import { useEffect } from "react";

import {
  DashboardStats,
  ClusterHealth,
  RecentActivity,
  QuickActions,
  ClusterSelector,
} from "../../components/dashboard";

import {
  useCluster,
  useDashboard,
} from "../../hooks";

export default function Dashboard() {
  const {
    currentCluster,
    fetchClusters,
  } = useCluster();

  const {
    data,
    loading,
    error,
    fetchDashboard,
  } = useDashboard();

  useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  useEffect(() => {
    if (!currentCluster) {
      return;
    }

    fetchDashboard(
      currentCluster.id
    );
  }, [
    currentCluster?.id,
    fetchDashboard,
  ]);

  if (!currentCluster) {
    return (
      <div className="space-y-6">
        <ClusterSelector />

        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 text-sm text-[var(--text-secondary)]">
          No cluster connected.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClusterSelector />

      {loading && (
        <div className="text-sm text-[var(--text-secondary)]">
          Loading cluster data...
        </div>
      )}

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <DashboardStats
        stats={data?.stats}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ClusterHealth
            health={data?.health ?? []}
          />
        </div>

        <div className="lg:col-span-8">
          <RecentActivity
            activities={
              data?.recentActivity ?? []
            }
          />
        </div>
      </div>

      <QuickActions />
    </div>
  );
}