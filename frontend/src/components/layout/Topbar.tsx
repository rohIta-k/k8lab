import { useLocation } from "react-router-dom";

import { SIDEBAR_ITEMS } from "../../constants/navigation";

export default function Topbar() {
  const { pathname } = useLocation();

  const currentPage = SIDEBAR_ITEMS.find(
    (item) => item.path === pathname
  );

  return (
    <header className="flex h-[var(--topbar-height)] items-center justify-between border-b border-[var(--border-color)] bg-[var(--background-primary)] px-[var(--content-padding)]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {currentPage?.label ?? "K8Lab"}
        </h1>

        <p className="text-sm text-[var(--text-muted)]">
          Learn and experiment with Kubernetes locally.
        </p>
      </div>
    </header>
  );
}