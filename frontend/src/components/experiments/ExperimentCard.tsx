import Badge from "../common/Badge";
import Card from "../common/Card";

import type { Experiment } from "../../types/experiment";

interface ExperimentCardProps {
  experiment: Experiment;

  selected: boolean;

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
  onClick,
}: ExperimentCardProps) {
  return (
    <Card
      onClick={onClick}
      className={
        selected
          ? "border-[var(--primary)]"
          : undefined
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
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

      <div className="mt-5 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>{experiment.estimatedTime}</span>

        <span>{experiment.expectedState}</span>
      </div>
    </Card>
  );
}