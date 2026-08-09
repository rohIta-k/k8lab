import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

import { useExperiments } from "../../hooks";

import ExperimentConfiguration from "./ExperimentConfiguration";
import ExperimentStatus from "./ExperimentStatus";

export default function ExperimentDetails() {
  const { selectedExperiment } =
    useExperiments();

  if (!selectedExperiment) {
    return (
      <EmptyState
        title="No Experiment Selected"
        description="Select an experiment to view its details."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          {selectedExperiment.name}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {selectedExperiment.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-5">
          <DetailRow
            label="Category"
            value={selectedExperiment.category}
          />

          <DetailRow
            label="Difficulty"
            value={selectedExperiment.difficulty}
          />

          <DetailRow
            label="Namespace"
            value={selectedExperiment.namespace}
          />

          <DetailRow
            label="Estimated Time"
            value={
              selectedExperiment.estimatedTime
            }
          />

          <DetailRow
            label="Expected State"
            value={
              selectedExperiment.expectedState
            }
          />

          <DetailRow
            label="Resources"
            value={selectedExperiment.resources.join(
              ", "
            )}
          />
        </div>
      </Card>

      <ExperimentConfiguration />

      <ExperimentStatus />
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div>
      <p className="text-xs text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}