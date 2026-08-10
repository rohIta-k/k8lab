import { create } from "zustand";

import { clusterService } from "../services/clusterService";

import type {
  DashboardData,
} from "../types/dashboard";

interface DashboardStore {
  data: DashboardData | null;

  loading: boolean;
  error: string | null;

  fetchDashboard: (
    clusterId: string
  ) => Promise<void>;

  clearDashboard: () => void;
}

export const useDashboardStore =
  create<DashboardStore>((set) => ({
    data: null,

    loading: false,
    error: null,

    fetchDashboard: async (
      clusterId
    ) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const data =
          await clusterService.getDashboard(
            clusterId
          );

        set({
          data,
          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load dashboard",
        });
      }
    },

    clearDashboard: () => {
      set({
        data: null,
        error: null,
      });
    },
  }));