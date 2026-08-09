import {
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
} from "lucide-react";

import type {
  ExperimentCategory,
  ExperimentDifficulty,
  ExperimentExpectedState,
} from "../types/experiment";

export const EXPERIMENT_CATEGORIES: ExperimentCategory[] = [
  "Pod Lifecycle",
  "Scheduling",
  "Networking",
  "Health Checks",
  "Storage",
];

export const EXPERIMENT_DIFFICULTIES: ExperimentDifficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const EXPERIMENT_EXPECTED_STATES: ExperimentExpectedState[] = [
  "Running",
  "Pending",
  "CrashLoopBackOff",
  "ImagePullBackOff",
  "OOMKilled",
  "Restarting",
];

export const EXPERIMENT_FILTERS = [
  "All",
  ...EXPERIMENT_CATEGORIES,
] as const;

export const LOG_LEVEL_CONFIG = {
  INFO: {
    variant: "info",
    icon: Circle,
    color: "text-[var(--info)]",
  },

  SUCCESS: {
    variant: "success",
    icon: CheckCircle2,
    color: "text-[var(--success)]",
  },

  WARNING: {
    variant: "warning",
    icon: PlayCircle,
    color: "text-[var(--warning)]",
  },

  ERROR: {
    variant: "danger",
    icon: XCircle,
    color: "text-[var(--danger)]",
  },
} as const;

export const LOG_LEVEL_VARIANTS = {
  INFO: LOG_LEVEL_CONFIG.INFO.variant,
  SUCCESS: LOG_LEVEL_CONFIG.SUCCESS.variant,
  WARNING: LOG_LEVEL_CONFIG.WARNING.variant,
  ERROR: LOG_LEVEL_CONFIG.ERROR.variant,
} as const;