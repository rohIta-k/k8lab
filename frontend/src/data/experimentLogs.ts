import type {
  ExperimentLog,
  ExperimentState,
} from "../types/experiment";

export const experimentLogs: Record<
  ExperimentState,
  ExperimentLog[]
> = {
  "Not Running": [
    {
      id: "not-running-1",
      timestamp: "—",
      level: "INFO",
      message:
        "Waiting for experiment to start...",
    },
  ],

  Running: [
    {
      id: "running-1",
      timestamp: "10:32:01",
      level: "INFO",
      message: "Creating namespace...",
    },

    {
      id: "running-2",
      timestamp: "10:32:03",
      level: "INFO",
      message:
        "Deploying Kubernetes resources...",
    },

    {
      id: "running-3",
      timestamp: "10:32:07",
      level: "INFO",
      message:
        "Waiting for deployment rollout...",
    },

    {
      id: "running-4",
      timestamp: "10:32:11",
      level: "SUCCESS",
      message: "ReplicaSet created.",
    },

    {
      id: "running-5",
      timestamp: "10:32:15",
      level: "SUCCESS",
      message: "Pod scheduled successfully.",
    },

    {
      id: "running-6",
      timestamp: "10:32:20",
      level: "INFO",
      message:
        "Monitoring workload state...",
    },
  ],

  Completed: [
    {
      id: "completed-1",
      timestamp: "10:32:01",
      level: "INFO",
      message:
        "Creating namespace...",
    },

    {
      id: "completed-2",
      timestamp: "10:32:08",
      level: "SUCCESS",
      message:
        "Resources deployed successfully.",
    },

    {
      id: "completed-3",
      timestamp: "10:32:15",
      level: "SUCCESS",
      message:
        "Expected Kubernetes state reached.",
    },

    {
      id: "completed-4",
      timestamp: "10:32:18",
      level: "SUCCESS",
      message:
        "Experiment completed.",
    },
  ],

  Failed: [
    {
      id: "failed-1",
      timestamp: "10:32:01",
      level: "INFO",
      message:
        "Creating namespace...",
    },

    {
      id: "failed-2",
      timestamp: "10:32:05",
      level: "INFO",
      message:
        "Deploying Kubernetes resources...",
    },

    {
      id: "failed-3",
      timestamp: "10:32:09",
      level: "ERROR",
      message:
        "Failed to deploy experiment resources.",
    },

    {
      id: "failed-4",
      timestamp: "10:32:11",
      level: "WARNING",
      message:
        "Cleaning up partially created resources.",
    },
  ],
};