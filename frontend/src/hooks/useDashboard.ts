import { useDashboardStore } from "../store";

export function useDashboard() {
  const data =
    useDashboardStore(
      (state) => state.data
    );

  const loading =
    useDashboardStore(
      (state) => state.loading
    );

  const error =
    useDashboardStore(
      (state) => state.error
    );

  const fetchDashboard =
    useDashboardStore(
      (state) => state.fetchDashboard
    );

  const clearDashboard =
    useDashboardStore(
      (state) => state.clearDashboard
    );

  return {
    data,
    loading,
    error,
    fetchDashboard,
    clearDashboard,
  };
}