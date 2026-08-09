import Badge from "./Badge";

import type { ResourceStatus } from "../../types/resources";

interface StatusChipProps {
  status: ResourceStatus;
}

const STATUS_VARIANTS: Record<
  ResourceStatus,
  "primary" | "success" | "warning" | "danger" | "info"
> = {
  Running: "success",

  Pending: "warning",

  Active: "primary",

  Completed: "success",

  Failed: "danger",

  CrashLoopBackOff: "danger",

  ImagePullBackOff: "warning",

  OOMKilled: "danger",

  Bound: "info",
};

export default function StatusChip({
  status,
}: StatusChipProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {status}
    </Badge>
  );
}