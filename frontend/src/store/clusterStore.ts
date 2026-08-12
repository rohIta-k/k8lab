import { create } from "zustand";

import { clusterService } from "../services/clusterService";

import type {
  Cluster,
  ClusterProvider,
} from "../types/cluster";

interface CreateClusterRequest {
  name: string;
  provider: ClusterProvider;
}

interface ClusterStore {
  clusters: Cluster[];
  currentCluster: Cluster | null;

  loading: boolean;
  error: string | null;

  setCurrentCluster: (
    clusterId: string,
  ) => void;

  fetchClusters: () => Promise<void>;

  connectCluster: (
    clusterId: string,
  ) => Promise<void>;

  createCluster: (
    request: CreateClusterRequest,
  ) => Promise<void>;

  deleteCluster: (
    clusterId: string,
  ) => Promise<void>;

  clearError: () => void;
}

const STORAGE_KEY =
  "k8lab-current-cluster";

export const useClusterStore =
  create<ClusterStore>((set, get) => ({
    clusters: [],
    currentCluster: null,

    loading: false,
    error: null,

    setCurrentCluster: (clusterId) => {
      const cluster =
        get().clusters.find(
          (item) => item.id === clusterId,
        );

      if (!cluster) {
        return;
      }

      localStorage.setItem(
        STORAGE_KEY,
        cluster.id,
      );

      const clusters =
        get().clusters.map((item) => ({
          ...item,
          current:
            item.id === clusterId,
          status:
            item.id === clusterId
              ? "Connected"
              : item.status,
        }));

      set({
        clusters,
        currentCluster: {
          ...cluster,
          current: true,
          status: "Connected",
        },
      });
    },

    fetchClusters: async () => {
      set({
        loading: true,
        error: null,
      });

      try {
        const clusters =
          await clusterService.getClusters();

        const savedId =
          localStorage.getItem(
            STORAGE_KEY,
          );

        /*
         * Restore the cluster that was selected
         * before the browser was refreshed.
         */
        let currentCluster =
          savedId
            ? clusters.find(
                (cluster) =>
                  cluster.id === savedId,
              ) ?? null
            : null;

        /*
         * If there is no saved cluster,
         * fall back to the cluster marked
         * current by the backend.
         */
        if (!currentCluster) {
          currentCluster =
            clusters.find(
              (cluster) =>
                cluster.current,
            ) ?? null;
        }

        /*
         * If the saved cluster no longer exists,
         * remove the stale ID.
         */
        if (
          savedId &&
          !clusters.some(
            (cluster) =>
              cluster.id === savedId,
          )
        ) {
          localStorage.removeItem(
            STORAGE_KEY,
          );
        }

        /*
         * If we found a current cluster but
         * localStorage didn't have it, save it.
         */
        if (currentCluster) {
          localStorage.setItem(
            STORAGE_KEY,
            currentCluster.id,
          );
        }

        const updatedClusters =
          clusters.map((cluster) => ({
            ...cluster,
            current:
              cluster.id ===
              currentCluster?.id,
            status:
              cluster.id ===
              currentCluster?.id
                ? "Connected"
                : cluster.status,
          }));

        set({
          clusters: updatedClusters,

          currentCluster:
            currentCluster
              ? {
                  ...currentCluster,
                  current: true,
                  status: "Connected",
                }
              : null,

          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch clusters.",
        });
      }
    },

    connectCluster: async (
      clusterId,
    ) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const cluster =
          await clusterService.connectCluster(
            clusterId,
          );

        localStorage.setItem(
          STORAGE_KEY,
          cluster.id,
        );

        const clusters =
          get().clusters.map((item) => ({
            ...item,
            current:
              item.id === cluster.id,
            status:
              item.id === cluster.id
                ? "Connected"
                : item.status,
          }));

        set({
          clusters,

          currentCluster: {
            ...cluster,
            current: true,
            status: "Connected",
          },

          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to connect cluster.",
        });
      }
    },

    createCluster: async (
      request,
    ) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const cluster =
          await clusterService.createCluster(
            request,
          );

        localStorage.setItem(
          STORAGE_KEY,
          cluster.id,
        );

        const clusters =
          await clusterService.getClusters();

        const updatedClusters =
          clusters.map((item) => ({
            ...item,
            current:
              item.id === cluster.id,
            status:
              item.id === cluster.id
                ? "Connected"
                : item.status,
          }));

        const current =
          updatedClusters.find(
            (item) =>
              item.id === cluster.id,
          ) ?? cluster;

        set({
          clusters: updatedClusters,

          currentCluster: {
            ...current,
            current: true,
            status: "Connected",
          },

          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to create cluster.",
        });
      }
    },

    deleteCluster: async (
      clusterId,
    ) => {
      set({
        loading: true,
        error: null,
      });

      try {
        await clusterService.deleteCluster(
          clusterId,
        );

        const wasCurrent =
          localStorage.getItem(
            STORAGE_KEY,
          ) === clusterId;

        if (wasCurrent) {
          localStorage.removeItem(
            STORAGE_KEY,
          );
        }

        const clusters =
          await clusterService.getClusters();

        const savedId =
          localStorage.getItem(
            STORAGE_KEY,
          );

        const currentCluster =
          clusters.find(
            (cluster) =>
              cluster.id === savedId,
          ) ??
          clusters.find(
            (cluster) =>
              cluster.current,
          ) ??
          null;

        if (currentCluster) {
          localStorage.setItem(
            STORAGE_KEY,
            currentCluster.id,
          );
        }

        set({
          clusters: clusters.map(
            (cluster) => ({
              ...cluster,
              current:
                cluster.id ===
                currentCluster?.id,
              status:
                cluster.id ===
                currentCluster?.id
                  ? "Connected"
                  : cluster.status,
            }),
          ),

          currentCluster:
            currentCluster
              ? {
                  ...currentCluster,
                  current: true,
                  status: "Connected",
                }
              : null,

          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to delete cluster.",
        });
      }
    },

    clearError: () => {
      set({
        error: null,
      });
    },
  }));