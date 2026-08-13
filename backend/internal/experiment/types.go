package experiment

import "time"

type Status string

const (
	StatusPending   Status = "Pending"
	StatusRunning   Status = "Running"
	StatusCompleted Status = "Completed"
	StatusFailed    Status = "Failed"
	StatusStopped   Status = "Stopped"
)

type Experiment struct {
	ID            string                 `json:"id"`
	Name          string                 `json:"name"`
	Category      string                 `json:"category"`
	Difficulty    string                 `json:"difficulty"`
	Description   string                 `json:"description"`
	Namespace     string                 `json:"namespace"`
	EstimatedTime string                 `json:"estimatedTime"`
	Resources     []string               `json:"resources"`
	Configuration map[string]interface{} `json:"configuration"`
	ExpectedState string                 `json:"expectedState"`
}

type ExperimentRun struct {
	ID           string    `json:"id"`
	ExperimentID string    `json:"experimentId"`
	ClusterID    string    `json:"clusterId"`
	Namespace    string    `json:"namespace"`
	Status       Status    `json:"status"`
	StartedAt    time.Time `json:"startedAt"`
	FinishedAt   time.Time `json:"finishedAt,omitempty"`
}

type ExperimentLog struct {
	Timestamp time.Time `json:"timestamp"`
	Source    string    `json:"source"`
	Message   string    `json:"message"`
}

type RunResponse struct {
	Run    ExperimentRun `json:"run"`
	Experiment Experiment  `json:"experiment"`
}

type LogsResponse struct {
	RunID  string          `json:"runId"`
	Status Status          `json:"status"`
	Logs   []ExperimentLog `json:"logs"`
}