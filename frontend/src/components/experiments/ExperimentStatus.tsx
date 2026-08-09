import {
  Clock,
  PlayCircle,
  Server,
  Trash2,
} from "lucide-react";

import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";

import { useExperiments } from "../../hooks";

const STATUS_VARIANTS = {
  "Not Running": "secondary",
  Running: "info",
  Completed: "success",
  Failed: "danger",
} as const;

export default function ExperimentStatus() {
  const {
    experimentState,
    selectedExperiment,
  } = useExperiments();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Execution
          </h3>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Runtime information for the selected experiment.
          </p>
        </div>

        <Badge
          variant={
            STATUS_VARIANTS[
              experimentState
            ]
          }
        >
          {experimentState}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5">
        <StatusItem
          icon={PlayCircle}
          label="State"
          value={experimentState}
        />

        <StatusItem
          icon={Clock}
          label="Estimated Time"
          value={
            selectedExperiment?.estimatedTime ??
            "-"
          }
        />

        <StatusItem
          icon={Server}
          label="Resources"
          value={
            selectedExperiment
              ? selectedExperiment.resources.length.toString()
              : "-"
          }
        />

        <StatusItem
          icon={Clock}
          label="Duration"
          value="--"
        />
      </div>

      <div className="mt-8 flex gap-3">
        <Button
          variant="danger"
          className="flex-1"
        >
          <Trash2 size={16} />

          <span className="ml-2">
            Cleanup Resources
          </span>
        </Button>
      </div>
    </Card>
  );
}

interface StatusItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function StatusItem({
  icon: Icon,
  label,
  value,
}: StatusItemProps) {
  return (
    <div className="rounded-xl bg-[var(--background-hover)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon
          size={16}
          className="text-[var(--primary)]"
        />

        <span className="text-xs text-[var(--text-muted)]">
          {label}
        </span>
      </div>

      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}