import { useMemo } from "react";

import { useExperiments } from "../../hooks";

import ExperimentCard from "./ExperimentCard";
import type { Experiment, ExperimentCategory,
} from "../../types/experiment";

export default function ExperimentList() {
  const {
    experiments,
    selectedExperiment,
    setSelectedExperiment,
  } = useExperiments();

  const groupedExperiments = useMemo(() => {
  return experiments.reduce(
    (groups, experiment) => {
      const category = experiment.category;

      (groups[category] ??= []).push(experiment);

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

  return (
    <div className="space-y-6">
      {Object.entries(groupedExperiments).map(
        ([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {category}
            </h2>

            <div className="space-y-3">
              {items.map((experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={experiment}
                  selected={
                    selectedExperiment?.id ===
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