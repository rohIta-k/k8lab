package activity

import "time"

type Status string

const (
	StatusSuccess Status = "success"
	StatusWarning Status = "warning"
	StatusError   Status = "error"
	StatusInfo    Status = "info"
)

type Activity struct {
	ID          int64     `json:"id"`
	ClusterID   string    `json:"clusterId,omitempty"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      Status    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}