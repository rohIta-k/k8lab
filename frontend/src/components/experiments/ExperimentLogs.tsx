import Badge from "../common/Badge";
import Card from "../common/Card";

import { experimentLogs } from "../../data/experimentLogs";

import { LOG_LEVEL_VARIANTS } from "../../constants/experiments";

import { useExperiments } from "../../hooks";

export default function ExperimentLogs() {
  const { experimentState } =
    useExperiments();

  const logs =
    experimentLogs[experimentState];

  return (
    <Card>
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Execution Logs
        </h3>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Live output from the experiment runtime.
        </p>
      </div>

      <div className="h-72 space-y-3 overflow-y-auto rounded-[var(--radius-md)] bg-[var(--background-primary)] p-4 font-mono text-sm">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--background-hover)] p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant={
                  LOG_LEVEL_VARIANTS[
                    log.level
                  ]
                }
              >
                {log.level}
              </Badge>

              <span className="text-xs text-[var(--text-muted)]">
                {log.timestamp}
              </span>
            </div>

            <p className="text-[var(--text-primary)]">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}