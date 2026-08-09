import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  Check,
  ChevronDown,
  Cpu,
} from "lucide-react";

import { CLUSTER_MENU_ACTIONS } from "../../constants/navigation";

import { useCluster } from "../../hooks";

export default function ClusterSelector() {
  const {
    clusters,
    currentCluster,
    setCurrentCluster,
  } = useCluster();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-[var(--radius-md)]
            border
            border-[var(--border-color)]
            bg-[var(--background-card)]
            px-4
            py-3
            transition
            hover:bg-[var(--background-hover)]
          "
        >
          <div className="flex items-center gap-3">
            <Cpu
              size={18}
              className="text-[var(--primary)]"
            />

            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {currentCluster.name}
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                {currentCluster.provider}
              </p>
            </div>
          </div>

          <ChevronDown
            size={18}
            className="text-[var(--text-secondary)]"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="
            z-50
            w-72
            rounded-[var(--radius-md)]
            border
            border-[var(--border-color)]
            bg-[var(--background-card)]
            p-2
            shadow-[var(--shadow-lg)]
          "
        >
          {clusters.map((cluster) => (
            <DropdownMenu.Item
              key={cluster.id}
              onClick={() =>
                setCurrentCluster(cluster.id)
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-lg
                px-3
                py-2
                outline-none
                transition
                hover:bg-[var(--background-hover)]
              "
            >
              <div>
                <p className="text-sm text-[var(--text-primary)]">
                  {cluster.name}
                </p>

                <p className="text-xs text-[var(--text-muted)]">
                  {cluster.provider}
                </p>
              </div>

              {cluster.current && (
                <Check
                  size={16}
                  className="text-[var(--primary)]"
                />
              )}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-2 h-px bg-[var(--border-color)]" />

          {CLUSTER_MENU_ACTIONS.map((action) => (
            <DropdownMenu.Item
              key={action.id}
              className={`
                cursor-pointer
                rounded-lg
                px-3
                py-2
                text-sm
                outline-none
                transition
                hover:bg-[var(--background-hover)]
                ${
                  action.destructive
                    ? "text-[var(--danger)]"
                    : "text-[var(--text-primary)]"
                }
              `}
            >
              {action.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}