import {
  Play,
  RefreshCw,
  Square,
} from "lucide-react";

import Button from "../common/Button";

import {
  useCluster,
  useExperiments,
} from "../../hooks";

export default function ExperimentToolbar() {
  const { currentCluster } = useCluster();

  const {
    selectedExperiment,
    experimentState,
    loading,
    startExperiment,
    stopExperiment,
    resetExperiment,
  } = useExperiments();

  const isRunning =
    experimentState === "Running" ||
    experimentState === "Pending";

  const handleStart = async () => {
    if (!currentCluster || !selectedExperiment) {
      return;
    }

    await startExperiment(
      currentCluster.id
    );
  };

  const handleStop = async () => {
    await stopExperiment();
  };

  const handleReset = async () => {
    await resetExperiment();
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="primary"
        disabled={
          !selectedExperiment ||
          !currentCluster ||
          isRunning ||
          loading
        }
        onClick={handleStart}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] py-3 text-base font-semibold text-white hover:bg-[var(--primary-hover)]"
      >
        <Play size={18} />

        <span>
          {experimentState === "Completed"
            ? "Run Again"
            : "Start Experiment"}
        </span>
      </Button>

      <Button
        variant="secondary"
        disabled={
          !isRunning ||
          loading
        }
        onClick={handleStop}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] py-3 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
      >
        <Square size={18} />

        <span>
          Stop Experiment
        </span>
      </Button>

      <Button
        variant="secondary"
        disabled={
          !selectedExperiment ||
          loading ||
          isRunning
        }
        onClick={handleReset}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] py-3 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--background-hover)]"
      >
        <RefreshCw size={18} />

        <span>
          Reset
        </span>
      </Button>
    </div>
  );
}