import { useMemo } from "react";

import { useExperiments } from "../../hooks";

import ExperimentCard from "./ExperimentCard";

import type {
  Experiment,
  ExperimentCategory,
} from "../../types/experiment";

export default function ExperimentList() {
  const {
    experiments,
    selectedExperiment,
    experimentState,
    setSelectedExperiment,
  } = useExperiments();

  const groupedExperiments = useMemo(() => {
    return experiments.reduce(
      (groups, experiment) => {
        const category =
          experiment.category;

        (groups[category] ??= []).push(
          experiment
        );

        return groups;
      },
      {} as Partial<
        Record<
          ExperimentCategory,
          Experiment[]
        >
      >
    );
  }, [experiments]);

  if (experiments.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 text-sm text-[var(--text-secondary)]">
        No experiments available.
      </div>
    );
  }

  const runActive =
    experimentState === "Running" ||
    experimentState === "Pending";

  return (
    <div className="space-y-6">
      {Object.entries(groupedExperiments).map(
        ([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {category}
            </h2>

            <div className="space-y-3">
              {items?.map((experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={experiment}
                  selected={
                    selectedExperiment?.id ===
                    experiment.id
                  }
                  disabled={
                    runActive &&
                    selectedExperiment?.id !==
                      experiment.id
                  }
                  onClick={() =>
                    setSelectedExperiment(
                      experiment
                    )
                  }
                />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}