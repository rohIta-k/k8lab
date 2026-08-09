import {
  Play,
  RefreshCw,
  Square,
} from "lucide-react";

import Button from "../common/Button";

import { useExperiments } from "../../hooks";

export default function ExperimentToolbar() {
  const {
    selectedExperiment,
    experimentState,
  } = useExperiments();

  const isRunning =
    experimentState === "Running";

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Experiments
        </h2>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Deploy Kubernetes debugging scenarios.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary">
          <RefreshCw size={16} />
          <span className="ml-2">Refresh</span>
        </Button>

        {isRunning ? (
          <Button variant="danger">
            <Square size={16} />
            <span className="ml-2">
              Stop Experiment
            </span>
          </Button>
        ) : (
          <Button
            disabled={!selectedExperiment}
          >
            <Play size={16} />
            <span className="ml-2">
              Run Experiment
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}