interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-[var(--section-gap)] flex items-start justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}