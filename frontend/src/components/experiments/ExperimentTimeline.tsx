import {
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
} from "lucide-react";

import Card from "../common/Card";

import { experimentLogs } from "../../data/experimentLogs";
import { useExperiments } from "../../hooks";

const icons = {
  INFO: Circle,
  SUCCESS: CheckCircle2,
  WARNING: PlayCircle,
  ERROR: XCircle,
} as const;

const colors = {
  INFO: "text-[var(--info)]",
  SUCCESS: "text-[var(--success)]",
  WARNING: "text-[var(--warning)]",
  ERROR: "text-[var(--danger)]",
} as const;

export default function ExperimentTimeline() {
  const { experimentState } =
    useExperiments();

  const logs =
    experimentLogs[experimentState];

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Timeline
        </h3>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Execution progress of the experiment.
        </p>
      </div>

      <div className="space-y-5">
        {logs.map((log, index) => {
          const Icon = icons[log.level];

          return (
            <div
              key={log.id}
              className="relative flex gap-4"
            >
              {index !== logs.length - 1 && (
                <div className="absolute left-[10px] top-6 h-full w-px bg-[var(--border-color)]" />
              )}

              <div
                className={`${colors[log.level]} relative z-10 rounded-full bg-[var(--background-card)]`}
              >
                <Icon size={20} />
              </div>

              <div className="pb-4">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {log.message}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {log.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}