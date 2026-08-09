import clsx from "clsx";

import { RESOURCE_TABS } from "../../constants/resources";

import { useResources } from "../../hooks";

export default function ResourceTabs() {
  const {
    selectedResourceType,
    setResourceType,
  } = useResources();

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {RESOURCE_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setResourceType(tab.id)}
          className={clsx(
            "rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium transition-all duration-200",
            selectedResourceType === tab.id
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border-color)] bg-[var(--background-card)] text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}