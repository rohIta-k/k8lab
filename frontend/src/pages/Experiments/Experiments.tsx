import { useEffect } from "react";

import {
  ExperimentToolbar,
  ExperimentList,
  ExperimentDetails,
  ExperimentLogs,
} from "../../components/experiments";

import {
  useCluster,
  useExperiments,
} from "../../hooks";

export default function Experiments() {
  const { currentCluster } = useCluster();

  const {
    error,
    clearError,
    restoreActiveRun,
  } = useExperiments();

  useEffect(() => {
    if (!currentCluster) {
      return;
    }

    restoreActiveRun(currentCluster.id);
  }, [
    currentCluster?.id,
    restoreActiveRun,
  ]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
          <span>{error}</span>

          <button
            type="button"
            onClick={clearError}
            className="ml-4 text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {!currentCluster ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 text-sm text-[var(--text-secondary)]">
          No cluster connected.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="min-w-0">
            <ExperimentList />
          </div>

          <div className="min-w-0 space-y-6">
            <ExperimentDetails />

            <ExperimentToolbar />

            <ExperimentLogs />
          </div>
        </div>
      )}
    </div>
  );
}