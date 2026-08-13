import Badge from "../common/Badge";
import Card from "../common/Card";

import type { Experiment } from "../../types/experiment";

interface ExperimentCardProps {
  experiment: Experiment;

  selected: boolean;

  disabled?: boolean;

  onClick: () => void;
}

const difficultyVariant = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
} as const;

export default function ExperimentCard({
  experiment,
  selected,
  disabled = false,
  onClick,
}: ExperimentCardProps) {
  return (
    <Card
      onClick={disabled ? undefined : onClick}
      className={[
        selected
          ? "border-[var(--primary)]"
          : undefined,
        disabled
          ? "cursor-not-allowed opacity-60"
          : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold text-[var(--text-primary)]">
            {experiment.name}
          </h3>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {experiment.category}
          </p>
        </div>

        <Badge
          variant={
            difficultyVariant[
              experiment.difficulty
            ]
          }
        >
          {experiment.difficulty}
        </Badge>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-[var(--text-secondary)]">
        {experiment.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
        <span>{experiment.estimatedTime}</span>

        <span className="text-right">
          {experiment.expectedState}
        </span>
      </div>
    </Card>
  );
}