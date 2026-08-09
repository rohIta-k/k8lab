import Card from "../common/Card";

import { useExperiments } from "../../hooks";

export default function ExperimentConfiguration() {
  const { selectedExperiment } =
    useExperiments();

  if (!selectedExperiment) {
    return null;
  }

  return (
    <Card>
      <h3 className="mb-5 text-lg font-semibold text-[var(--text-primary)]">
        Configuration
      </h3>

      <div className="space-y-4">
        {Object.entries(
          selectedExperiment.configuration
        ).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 last:border-none"
          >
            <span className="text-sm text-[var(--text-muted)]">
              {key}
            </span>

            <span className="rounded-md bg-[var(--background-hover)] px-3 py-1 text-sm text-[var(--text-primary)]">
              {Array.isArray(value)
                ? value.join(" ")
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}