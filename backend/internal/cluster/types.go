package cluster

import (
	"fmt"

	"github.com/rohIta-k/k8lab/backend/internal/activity"
)

type Provider string

const (
	ProviderKind     Provider = "kind"
	ProviderMinikube Provider = "minikube"
)

type Status string
const (
	StatusConnected    Status = "Connected"
	StatusAvailable    Status = "Available"
	StatusConnecting   Status = "Connecting"
	StatusStopped      Status = "Stopped"
	StatusDisconnected Status = "Disconnected"
)

type ClusterStats struct {
	Nodes       int `json:"nodes"`
	Namespaces  int `json:"namespaces"`
	Pods        int `json:"pods"`
	Deployments int `json:"deployments"`
	Services    int `json:"services"`
}

type ClusterHealthStatus string

const (
	HealthHealthy   ClusterHealthStatus = "Healthy"
	HealthUnhealthy ClusterHealthStatus = "Unhealthy"
)

type ClusterHealth struct {
	ID     string              `json:"id"`
	Name   string              `json:"name"`
	Status ClusterHealthStatus `json:"status"`
	Reason string              `json:"reason,omitempty"`
}

type Cluster struct {
	ID       string          `json:"id"`
	Name     string          `json:"name"`
	Provider Provider        `json:"provider"`
	Version  string          `json:"version"`
	Status   Status          `json:"status"`
	Current  bool            `json:"current"`
	Stats    ClusterStats    `json:"stats"`
	Health   []ClusterHealth `json:"health"`
}

type CreateRequest struct {
	Name     string   `json:"name"`
	Provider Provider `json:"provider,omitempty"`
}

type ProviderInfo struct {
	Name      Provider `json:"name"`
	Available bool     `json:"available"`
}

func clusterID(provider Provider, name string) string {
	return fmt.Sprintf("%s:%s", provider, name)
}

type DashboardData struct {
	Cluster         Cluster          `json:"cluster"`
	Stats           ClusterStats     `json:"stats"`
	Health          []ClusterHealth  `json:"health"`
	RecentActivity  []activity.Activity `json:"recentActivity"`
}
