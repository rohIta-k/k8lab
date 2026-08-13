import Badge from "../common/Badge";
import Card from "../common/Card";

import { LOG_LEVEL_VARIANTS } from "../../constants/experiments";

import { useExperiments } from "../../hooks";

export default function ExperimentLogs() {
  const {
    logs,
    logsLoading,
    runId,
    experimentState,
  } = useExperiments();

  return (
    <Card>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Execution Logs
          </h3>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Live output from the experiment runtime.
          </p>
        </div>

        {logsLoading && (
          <span className="text-xs text-[var(--text-muted)]">
            Updating...
          </span>
        )}
      </div>

      <div className="h-[420px] space-y-3 overflow-y-auto rounded-[var(--radius-md)] bg-[var(--background-primary)] p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
        {!runId ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            Start an experiment to view logs.
          </div>
        ) : logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
            Waiting for experiment output...
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-[var(--border-color)] bg-[var(--background-hover)] p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        LOG_LEVEL_VARIANTS[
                          log.level
                        ]
                      }
                    >
                      {log.level}
                    </Badge>

                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      {log.source}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs text-[var(--text-muted)]">
                    {new Date(
                      log.timestamp
                    ).toLocaleTimeString()}
                  </span>
                </div>

                <p className="break-words text-[var(--text-primary)]">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {runId && (
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>
            Run: {runId}
          </span>

          <span>
            {experimentState}
          </span>
        </div>
      )}
    </Card>
  );
}