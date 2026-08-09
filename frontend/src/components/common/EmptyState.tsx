import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--background-card)] py-16 text-center">
      <div className="mb-5 text-[var(--text-muted)]">
        {icon ?? <Inbox size={52} strokeWidth={1.5} />}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="max-w-sm text-sm text-[var(--text-secondary)]">
        {description}
      </p>
    </div>
  );
}