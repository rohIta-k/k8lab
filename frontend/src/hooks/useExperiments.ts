import { useExperimentStore } from "../store";

export function useExperiments() {
  const {
    experiments,
    selectedExperiment,
    experimentState,
    setSelectedExperiment,
    setExperimentState,
    resetExperiment,
  } = useExperimentStore((state) => ({
    experiments: state.experiments,
    selectedExperiment: state.selectedExperiment,
    experimentState: state.experimentState,
    setSelectedExperiment: state.setSelectedExperiment,
    setExperimentState: state.setExperimentState,
    resetExperiment: state.resetExperiment,
  }));

  return {
    experiments,
    selectedExperiment,
    experimentState,
    setSelectedExperiment,
    setExperimentState,
    resetExperiment,
  };
}