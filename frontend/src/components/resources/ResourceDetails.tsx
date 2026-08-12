import { ChevronRight } from "lucide-react";

import EmptyState from "../common/EmptyState";

import type { Resource } from "../../types/resources";

import OverviewCard from "./OverviewCard";
import YAMLCard from "./ResourceYAML";

interface ResourceDetailsProps {
  resource: Resource | null;
  collapsed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

export default function ResourceDetails({
  resource,
  collapsed = false,
  onToggle,
  onDelete,
  deleting = false,
}: ResourceDetailsProps) {
  if (!resource) {
    return (
      <EmptyState
        title="No Resource Selected"
        description="Select a resource from the table to view its details."
      />
    );
  }

  /*
   * When collapsed, show nothing.
   *
   * The resource row is responsible for opening
   * the details again.
   */
  if (collapsed) {
    return null;
  }

  return (
    <aside className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-2 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] transition hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
            aria-label="Collapse resource details"
          >
            <ChevronRight size={18} />
          </button>

          <h2 className="truncate text-lg font-semibold text-[var(--text-primary)]">
            {resource.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger)]/15 px-3 py-1.5 text-sm font-medium text-[var(--danger)] transition hover:bg-[var(--danger)]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <OverviewCard resource={resource} />

        <YAMLCard resource={resource} />
      </div>
    </aside>
  );
}