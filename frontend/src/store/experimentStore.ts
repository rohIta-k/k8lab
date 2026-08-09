import { create } from "zustand";

import { experimentsData } from "../data/experiments";

import type {
  Experiment,
  ExperimentState,
} from "../types/experiment";

interface ExperimentStore {
  experiments: Experiment[];

  selectedExperiment: Experiment | null;

  experimentState: ExperimentState;

  setSelectedExperiment: (
    experiment: Experiment | null
  ) => void;

  setExperimentState: (
    state: ExperimentState
  ) => void;

  resetExperiment: () => void;
}

export const useExperimentStore =
  create<ExperimentStore>((set) => ({
    experiments: experimentsData,

    selectedExperiment: null,

    experimentState: "Not Running",

    setSelectedExperiment: (experiment) =>
      set({
        selectedExperiment: experiment,
      }),

    setExperimentState: (state) =>
      set({
        experimentState: state,
      }),

    resetExperiment: () =>
      set({
        selectedExperiment: null,
        experimentState: "Not Running",
      }),
  }));