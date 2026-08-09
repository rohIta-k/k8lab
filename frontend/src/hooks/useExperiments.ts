import { useExperimentStore } from "../store";

export function useExperiments() {
  const experiments = useExperimentStore(
    (state) => state.experiments
  );

  const selectedExperiment = useExperimentStore(
    (state) => state.selectedExperiment
  );

  const experimentState = useExperimentStore(
    (state) => state.experimentState
  );

  const setSelectedExperiment =
    useExperimentStore(
      (state) => state.setSelectedExperiment
    );

  const setExperimentState =
    useExperimentStore(
      (state) => state.setExperimentState
    );

  const resetExperiment =
    useExperimentStore(
      (state) => state.resetExperiment
    );

  return {
    experiments,
    selectedExperiment,
    experimentState,
    setSelectedExperiment,
    setExperimentState,
    resetExperiment,
  };
}