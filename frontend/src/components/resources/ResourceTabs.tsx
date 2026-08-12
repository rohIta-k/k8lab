import clsx from "clsx";

import {
  RESOURCE_GROUPS,
} from "../../constants/resources";

import { useResources } from "../../hooks";

export default function ResourceTabs() {
  const {
    selectedResourceType,
    setResourceType,
    resources,
  } = useResources();

  return (
    <div className="flex min-h-[420px] flex-col rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-0 shadow-sm">
      <div className="space-y-5 px-2 pb-3 pt-3">
        {RESOURCE_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {group.title}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  selectedResourceType === item.id;
                const count =
                  resources[item.id]?.length ?? 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setResourceType(item.id)
                    }
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-all duration-200",
                      active
                        ? "bg-[var(--background-hover)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center text-[var(--text-secondary)]">
                        <Icon size={17} strokeWidth={1.8} />
                      </span>

                      <span className="truncate text-[15px] font-medium">
                        {item.label}
                      </span>
                    </span>

                    <span className="min-w-[26px] rounded-full bg-[var(--background-primary)] px-2 py-0.5 text-center text-[11px] text-[var(--text-secondary)]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}