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


/*
 * "Not Running" is a frontend state.
 *
 * "Pending", "Running", "Completed",
 * "Failed" and "Stopped" come from the backend.
 */
export type ExperimentState =
  | "Not Running"
  | "Pending"
  | "Running"
  | "Completed"
  | "Failed"
  | "Stopped";


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


/*
 * Static experiment definition.
 *
 * These come from experimentsData.ts.
 */
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


/*
 * Raw log returned by the backend.
 */
export interface BackendExperimentLog {
  timestamp: string;
  source: string;
  message: string;
}


/*
 * Log format consumed by the UI.
 *
 * The backend doesn't currently send "level",
 * so the frontend derives it from source/message.
 */
export interface ExperimentLog {
  id: string;

  timestamp: string;

  level:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";

  source: string;

  message: string;
}


/*
 * Backend ExperimentRun.
 */
export interface ExperimentRun {
  id: string;

  experimentId: string;

  clusterId: string;

  namespace: string;

  status: ExperimentState;

  startedAt: string;

  finishedAt?: string;
}


/*
 * POST /experiments/{experimentId}/run
 */
export interface RunExperimentResponse {
  run: ExperimentRun;

  experiment: Experiment;
}


/*
 * GET /experiments/runs/{runId}/logs
 */
export interface LogsResponse {
  runId: string;

  status: ExperimentState;

  logs: BackendExperimentLog[];
}