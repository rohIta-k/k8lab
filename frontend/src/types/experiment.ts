export type ExperimentCategory =
  | "Pod Lifecycle"
  | "Scheduling"
  | "Networking"
  | "Health Checks"
  | "Storage";

export type ExperimentDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type ExperimentState =
  | "Not Running"
  | "Running"
  | "Completed"
  | "Failed";

export interface ExperimentConfiguration {
  deploymentName?: string;
  image?: string;
  replicas?: number;

  cpu?: string;
  memory?: string;
  memoryLimit?: string;

  command?: string[];

  initialDelaySeconds?: number;
  periodSeconds?: number;
}

export type ExperimentExpectedState =
  | "Running"
  | "Pending"
  | "CrashLoopBackOff"
  | "ImagePullBackOff"
  | "OOMKilled"
  | "Restarting";


export interface Experiment {
  id: string;

  name: string;

  category: ExperimentCategory;

  difficulty: ExperimentDifficulty;

  description: string;

  namespace: string;

  estimatedTime: string;

  resources: string[];

  configuration: ExperimentConfiguration;

  expectedState: ExperimentExpectedState;
}

export interface ExperimentLog {
  id: string;
  timestamp: string;

  level:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";

  message: string;
}

