import {
  useExperimentStore,
} from "../store";

export function useExperiments() {
  const experiments =
    useExperimentStore(
      (state) => state.experiments
    );

  const selectedExperiment =
    useExperimentStore(
      (state) =>
        state.selectedExperiment
    );

  const experimentState =
    useExperimentStore(
      (state) =>
        state.experimentState
    );

  const runId =
    useExperimentStore(
      (state) => state.runId
    );

  const clusterId =
    useExperimentStore(
      (state) => state.clusterId
    );

  const logs =
    useExperimentStore(
      (state) => state.logs
    );

  const loading =
    useExperimentStore(
      (state) => state.loading
    );

  const logsLoading =
    useExperimentStore(
      (state) => state.logsLoading
    );

  const error =
    useExperimentStore(
      (state) => state.error
    );

  const setSelectedExperiment =
    useExperimentStore(
      (state) =>
        state.setSelectedExperiment
    );

  const startExperiment =
    useExperimentStore(
      (state) =>
        state.startExperiment
    );

  const restoreActiveRun =
    useExperimentStore(
      (state) =>
        state.restoreActiveRun
    );

  const fetchLogs =
    useExperimentStore(
      (state) => state.fetchLogs
    );

  const stopExperiment =
    useExperimentStore(
      (state) =>
        state.stopExperiment
    );

  const resetExperiment =
    useExperimentStore(
      (state) =>
        state.resetExperiment
    );

  const clearError =
    useExperimentStore(
      (state) => state.clearError
    );

  return {
    experiments,

    selectedExperiment,

    experimentState,

    runId,

    clusterId,

    logs,

    loading,

    logsLoading,

    error,

    setSelectedExperiment,

    startExperiment,

    restoreActiveRun,

    fetchLogs,

    stopExperiment,

    resetExperiment,

    clearError,
  };
}