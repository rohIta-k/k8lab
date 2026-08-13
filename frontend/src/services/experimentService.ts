import { api } from "./api";

import type {
 LogsResponse,
  ExperimentRun,
  RunExperimentResponse,
} from "../types/experiment";

export const experimentService = {
  /*
   * Start an experiment.
   *
   * POST
   * /api/clusters/{clusterId}/experiments/{experimentId}/run
   */
  run(
    clusterId: string,
    experimentId: string
  ) {
    return api.post<RunExperimentResponse>(
      `/api/clusters/${clusterId}/experiments/${experimentId}/run`
    );
  },

  /*
   * Get the currently active experiment run
   * for a cluster.
   *
   * Returns null when there is no active run.
   *
   * GET
   * /api/clusters/{clusterId}/experiments/runs/active
   */
  getActiveRun(
    clusterId: string
  ) {
    return api.get<ExperimentRun | null>(
      `/api/clusters/${clusterId}/experiments/runs/active`
    );
  },

  /*
   * Get current experiment status and logs.
   *
   * GET
   * /api/clusters/{clusterId}/experiments/runs/{runId}/logs
   */
  getLogs(
    clusterId: string,
    runId: string
  ) {
    return api.get<LogsResponse>(
      `/api/clusters/${clusterId}/experiments/runs/${runId}/logs`
    );
  },

  /*
   * Stop a running experiment.
   *
   * POST
   * /api/clusters/{clusterId}/experiments/runs/{runId}/stop
   */
  stop(
    clusterId: string,
    runId: string
  ) {
    return api.post<void>(
      `/api/clusters/${clusterId}/experiments/runs/${runId}/stop`
    );
  },

  /*
   * Reset an experiment and remove
   * its Kubernetes resources.
   *
   * DELETE
   * /api/clusters/{clusterId}/experiments/runs/{runId}
   */
  reset(
    clusterId: string,
    runId: string
  ) {
    return api.delete<void>(
      `/api/clusters/${clusterId}/experiments/runs/${runId}`
    );
  },
};