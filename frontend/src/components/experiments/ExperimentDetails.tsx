import {
  Box,
  Cog,
  Shield,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

import { useExperiments } from "../../hooks";

export default function ExperimentDetails() {
  const { selectedExperiment } = useExperiments();

  if (!selectedExperiment) {
    return (
      <EmptyState
        title="No Experiment Selected"
        description="Select an experiment to view its details."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 shadow-[0_16px_32px_rgba(0,0,0,0.18)]">
        <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          <Shield size={16} className="text-[var(--primary-light)]" />
          <span>Experiment Workspace</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
          {selectedExperiment.name}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
          {selectedExperiment.description}
        </p>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)] p-5">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <Box size={16} className="text-[var(--text-primary)]" />
            <span>Resources Created</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedExperiment.resources.map((resource, index) => (
              <div
                key={resource}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-primary)] text-[var(--text-primary)]">
                  {index === 0 ? <Sparkles size={18} /> : <Box size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-base font-medium text-[var(--text-primary)]">
                    {resource}
                  </div>
                  <div className="mt-1 text-xs text-[var(--text-muted)]">
                    {index === 0 ? "Ready" : index === 1 ? "Pending" : "Created"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)] p-5">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <Cog size={16} className="text-[var(--text-primary)]" />
            <span>Configuration</span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <DetailField label="Namespace" value={selectedExperiment.namespace} />
            <DetailField
              label="Container Image"
              value={selectedExperiment.configuration.image ?? "busybox:latest"}
            />
            <DetailField label="Category" value={selectedExperiment.category} />
            <DetailField label="Difficulty" value={selectedExperiment.difficulty} />
            <DetailField label="Expected State" value={selectedExperiment.expectedState} />
            <DetailField label="Estimated Time" value={selectedExperiment.estimatedTime} />
          </div>

          <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[#050b14] p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Failing Command
            </div>
            <code className="block whitespace-pre-wrap break-all text-sm text-[var(--text-primary)]">
              {selectedExperiment.configuration.command
                ? JSON.stringify(selectedExperiment.configuration.command)
                : "['/bin/sh', '-c', 'exit 1']"}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
}

function DetailField({
  label,
  value,
}: DetailFieldProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}