import { create } from "zustand";

import { experimentsData } from "../data/experiments";
import { experimentService } from "../services/experimentService";

import type {
  BackendExperimentLog,
  Experiment,
  ExperimentLog,
  ExperimentState,
} from "../types/experiment";

interface ExperimentStore {
  /*
   * Static experiment catalog.
   */
  experiments: Experiment[];

  /*
   * Currently selected experiment.
   */
  selectedExperiment: Experiment | null;

  /*
   * Current execution state.
   */
  experimentState: ExperimentState;

  /*
   * Active backend run.
   */
  runId: string | null;

  /*
   * Cluster on which the active run exists.
   */
  clusterId: string | null;

  /*
   * Logs displayed by the UI.
   */
  logs: ExperimentLog[];

  loading: boolean;

  logsLoading: boolean;

  error: string | null;

  setSelectedExperiment: (
    experiment: Experiment | null
  ) => void;

  startExperiment: (
    clusterId: string
  ) => Promise<void>;

  /*
   * Restore an experiment that is already
   * running on the backend.
   */
  restoreActiveRun: (
    clusterId: string
  ) => Promise<void>;

  fetchLogs: () => Promise<void>;

  stopExperiment: () => Promise<void>;

  resetExperiment: () => Promise<void>;

  clearError: () => void;
}

let pollingTimer:
  ReturnType<typeof setInterval> | null = null;

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

/*
 * Start polling only if there isn't already
 * a polling timer.
 */
function startPolling(
  fetchLogs: () => Promise<void>
) {
  if (pollingTimer) {
    return;
  }

  pollingTimer = setInterval(() => {
    fetchLogs();
  }, 30000);
}

/*
 * Convert backend logs into the format
 * expected by the frontend.
 */
function normalizeLogs(
  logs: BackendExperimentLog[]
): ExperimentLog[] {
  return logs.map((log, index) => ({
    id: `${log.timestamp}-${index}`,
    timestamp: log.timestamp,
    source: log.source,
    message: log.message,
    level: getLogLevel(log),
  }));
}

function sortLogsDescending(
  logs: ExperimentLog[]
): ExperimentLog[] {
  return [...logs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );
}

/*
 * The backend gives us source + message,
 * so infer a display level on the frontend.
 */
function getLogLevel(
  log: BackendExperimentLog
): ExperimentLog["level"] {
  const message =
    log.message.toLowerCase();

  const source =
    log.source.toLowerCase();

  if (
    message.includes("failed") ||
    message.includes("error") ||
    message.includes("failure") ||
    source === "error"
  ) {
    return "ERROR";
  }

  if (
    message.includes("completed") ||
    message.includes("success") ||
    message.includes("succeeded")
  ) {
    return "SUCCESS";
  }

  if (
    message.includes("warning") ||
    message.includes("waiting") ||
    message.includes("pending")
  ) {
    return "WARNING";
  }

  return "INFO";
}

export const useExperimentStore =
  create<ExperimentStore>((set, get) => ({
    /*
     * Experiments are frontend-defined.
     */
    experiments: experimentsData,

    selectedExperiment: null,

    experimentState: "Not Running",

    runId: null,

    clusterId: null,

    logs: [],

    loading: false,

    logsLoading: false,

    error: null,

    setSelectedExperiment: (
      experiment
    ) => {
      /*
       * Don't allow changing the experiment
       * while a run is active.
       */
      if (
        get().experimentState === "Running" ||
        get().experimentState === "Pending"
      ) {
        return;
      }

      stopPolling();

      set({
        selectedExperiment: experiment,
        experimentState: "Not Running",
        runId: null,
        clusterId: null,
        logs: [],
        error: null,
      });
    },

    startExperiment: async (
      clusterId
    ) => {
      const {
        selectedExperiment,
        experimentState,
      } = get();

      if (!selectedExperiment) {
        set({
          error: "Please select an experiment.",
        });

        return;
      }

      if (
        experimentState === "Running" ||
        experimentState === "Pending"
      ) {
        return;
      }

      stopPolling();

      set({
        loading: true,
        error: null,
        logs: [],
        runId: null,
        clusterId,
      });

      try {
        const response =
          await experimentService.run(
            clusterId,
            selectedExperiment.id
          );

        const run = response.run;

        set({
          runId: run.id,
          clusterId: run.clusterId,
          experimentState: run.status,
          loading: false,
        });

        /*
         * Fetch logs immediately.
         */
        await get().fetchLogs();

        const currentState =
          get().experimentState;

        if (
          currentState === "Running" ||
          currentState === "Pending"
        ) {
          startPolling(
            get().fetchLogs
          );
        }
      } catch (error) {
        set({
          loading: false,
          experimentState: "Failed",
          error:
            error instanceof Error
              ? error.message
              : "Failed to start experiment.",
        });
      }
    },

    /*
     * Recover an experiment that is still
     * active on the backend.
     *
     * This is called whenever the user
     * returns to the Experiments page.
     */
    restoreActiveRun: async (
      clusterId
    ) => {
      /*
       * Don't overwrite an already restored
       * or running experiment.
       */
      const currentRunId =
        get().runId;
      const currentClusterId =
        get().clusterId;

      if (
        currentRunId &&
        currentClusterId === clusterId &&
        get().selectedExperiment
      ) {
        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        const run =
          await experimentService.getActiveRun(
            clusterId
          );

        /*
         * No active experiment.
         */
        if (!run) {
          stopPolling();

          set({
            loading: false,
            experimentState: "Not Running",
            runId: null,
            clusterId: null,
            logs: [],
          });

          return;
        }

        /*
         * Find the experiment in our local
         * frontend experiment catalog.
         */
        const experiment =
          get().experiments.find(
            (item) =>
              item.id === run.experimentId
          );

        if (!experiment) {
          set({
            loading: false,
            error:
              `Active experiment "${run.experimentId}" ` +
              "is not available in the frontend catalog.",
          });

          return;
        }

        set({
          selectedExperiment: experiment,
          runId: run.id,
          clusterId: run.clusterId,
          experimentState: run.status,
          logs: [],
          loading: false,
          error: null,
        });

        /*
         * Get the latest Kubernetes state
         * and logs.
         */
        await get().fetchLogs();

        const currentState =
          get().experimentState;

        /*
         * Resume polling if the experiment
         * is still active.
         */
        if (
          currentState === "Running" ||
          currentState === "Pending"
        ) {
          startPolling(
            get().fetchLogs
          );
        }
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to restore active experiment.",
        });
      }
    },

    fetchLogs: async () => {
      const {
        runId,
        clusterId,
        logs,
      } = get();

      if (!runId || !clusterId) {
        return;
      }

      set({
        logsLoading: true,
      });

      try {
        const response =
          await experimentService.getLogs(
            clusterId,
            runId
          );

        const nextLogs = normalizeLogs(
          response.logs
        );

        const seenIds = new Set(
          logs.map((log) => log.id)
        );

        const mergedLogs =
          sortLogsDescending([
            ...nextLogs.filter(
              (log) =>
                !seenIds.has(log.id)
            ),
            ...logs,
          ]);

        set({
          logs: mergedLogs,
          experimentState:
            response.status,
          logsLoading: false,
        });

        /*
         * Stop polling once the experiment
         * reaches a terminal state.
         */
        if (
          response.status === "Completed" ||
          response.status === "Failed" ||
          response.status === "Stopped"
        ) {
          stopPolling();
        }
      } catch (error) {
        set({
          logsLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch experiment logs.",
        });
      }
    },

    stopExperiment: async () => {
      const {
        runId,
        clusterId,
      } = get();

      if (!runId || !clusterId) {
        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        stopPolling();

        await experimentService.stop(
          clusterId,
          runId
        );

        /*
         * Get final status and logs.
         */
        const response =
          await experimentService.getLogs(
            clusterId,
            runId
          );

        set({
          logs: sortLogsDescending(
            normalizeLogs(response.logs)
          ),
          experimentState: "Stopped",
          loading: false,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to stop experiment.",
        });
      }
    },

    resetExperiment: async () => {
      const {
        runId,
        clusterId,
      } = get();

      /*
       * Nothing exists on the backend.
       * Just clear local state.
       */
      if (!runId || !clusterId) {
        stopPolling();

        set({
          selectedExperiment: null,
          experimentState: "Not Running",
          runId: null,
          clusterId: null,
          logs: [],
          error: null,
        });

        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {
        stopPolling();

        await experimentService.reset(
          clusterId,
          runId
        );

        set({
          selectedExperiment: null,
          experimentState: "Not Running",
          runId: null,
          clusterId: null,
          logs: [],
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to reset experiment.",
        });
      }
    },

    clearError: () => {
      set({
        error: null,
      });
    },
  }));