import {
  Box,
  Cog,
  Shield,
  Sparkles,
} from "lucide-react";

import { useExperiments } from "../../hooks";

import EmptyState from "../common/EmptyState";

export default function ExperimentDetails() {
  const {
    selectedExperiment,
    experimentState,
  } = useExperiments();

  if (!selectedExperiment) {
    return (
      <EmptyState
        title="No Experiment Selected"
        description="Select an experiment to view its details."
      />
    );
  }

  const configuration =
    selectedExperiment.configuration;

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 shadow-[0_16px_32px_rgba(0,0,0,0.18)]">

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            <Shield
              size={16}
              className="text-[var(--primary-light)]"
            />

            <span>
              Experiment Workspace
            </span>
          </div>

          <StatusBadge
            status={experimentState}
          />
        </div>

        <h1 className="break-words text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
          {selectedExperiment.name}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-secondary)]">
          {selectedExperiment.description}
        </p>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)] p-5">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <Box
              size={16}
              className="text-[var(--text-primary)]"
            />

            <span>
              Resources
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedExperiment.resources.map(
              (resource, index) => (
                <div
                  key={resource}
                  className="flex min-w-0 items-center gap-4 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-primary)] text-[var(--text-primary)]">
                    {index === 0 ? (
                      <Sparkles size={18} />
                    ) : (
                      <Box size={18} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="break-words text-base font-medium text-[var(--text-primary)]">
                      {resource}
                    </div>

                    <div className="mt-1 text-xs text-[var(--text-muted)]">
                      Created by experiment
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-primary)] p-5">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            <Cog
              size={16}
              className="text-[var(--text-primary)]"
            />

            <span>
              Configuration
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <DetailField
              label="Namespace"
              value={
                selectedExperiment.namespace
              }
            />

            <DetailField
              label="Category"
              value={
                selectedExperiment.category
              }
            />

            <DetailField
              label="Difficulty"
              value={
                selectedExperiment.difficulty
              }
            />

            <DetailField
              label="Expected State"
              value={
                selectedExperiment.expectedState
              }
            />

            <DetailField
              label="Estimated Time"
              value={
                selectedExperiment.estimatedTime
              }
            />

            {configuration.deploymentName && (
              <DetailField
                label="Deployment"
                value={
                  configuration.deploymentName
                }
              />
            )}

            {configuration.image && (
              <DetailField
                label="Container Image"
                value={
                  configuration.image
                }
              />
            )}

            {configuration.replicas !==
              undefined && (
              <DetailField
                label="Replicas"
                value={String(
                  configuration.replicas
                )}
              />
            )}

            {configuration.cpu && (
              <DetailField
                label="CPU"
                value={configuration.cpu}
              />
            )}

            {configuration.memory && (
              <DetailField
                label="Memory"
                value={
                  configuration.memory
                }
              />
            )}

            {configuration.memoryLimit && (
              <DetailField
                label="Memory Limit"
                value={
                  configuration.memoryLimit
                }
              />
            )}

            {configuration.initialDelaySeconds !==
              undefined && (
              <DetailField
                label="Initial Delay"
                value={`${configuration.initialDelaySeconds}s`}
              />
            )}

            {configuration.periodSeconds !==
              undefined && (
              <DetailField
                label="Probe Period"
                value={`${configuration.periodSeconds}s`}
              />
            )}
          </div>

          {configuration.command &&
            configuration.command.length > 0 && (
              <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[#050b14] p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Command
                </div>

                <code className="block whitespace-pre-wrap break-all text-sm text-[var(--text-primary)]">
                  {JSON.stringify(
                    configuration.command
                  )}
                </code>
              </div>
            )}
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
    <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-medium text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  let className =
    "border-[var(--border-color)] bg-[var(--background-primary)] text-[var(--text-secondary)]";

  if (status === "Running") {
    className =
      "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary-light)]";
  }

  if (status === "Pending") {
    className =
      "border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]";
  }

  if (status === "Completed") {
    className =
      "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]";
  }

  if (status === "Failed") {
    className =
      "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]";
  }

  if (status === "Stopped") {
    className =
      "border-[var(--border-light)] bg-[var(--background-hover)] text-[var(--text-secondary)]";
  }

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {status}
    </span>
  );
}