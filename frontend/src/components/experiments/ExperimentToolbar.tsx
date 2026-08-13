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
    <div className="flex gap-3">
      <Button
        variant="primary"
        disabled={!selectedExperiment}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] py-3 text-base font-semibold text-white hover:bg-[var(--primary-hover)]"
      >
        {isRunning ? (
          <>
            <Square size={18} />
            <span>Stop Experiment</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>Start Experiment</span>
          </>
        )}
      </Button>

      <Button
        variant="secondary"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] py-3 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
      >
        <RefreshCw size={18} />
        <span>Reset</span>
      </Button>
    </div>
  );
}