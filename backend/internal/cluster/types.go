package cluster

type Provider string

const (
	ProviderKind     Provider = "kind"
	ProviderMinikube Provider = "minikube"
)

type Status string

const (
	StatusConnected Status = "Connected"
	StatusAvailable Status = "Available"
	StatusConnecting Status = "Connecting"
)

type ClusterStats struct {
	Nodes        int `json:"nodes"`
	Namespaces   int `json:"namespaces"`
	Pods         int `json:"pods"`
	Deployments  int `json:"deployments"`
	Services     int `json:"services"`
}

type Cluster struct {
	ID       string       `json:"id"`
	Name     string       `json:"name"`
	Provider Provider     `json:"provider"`
	Version  string       `json:"version"`
	Status   Status       `json:"status"`
	Current  bool         `json:"current"`
	Stats    ClusterStats `json:"stats"`
}

type CreateRequest struct {
	Name     string   `json:"name"`
	Provider Provider `json:"provider,omitempty"`
}

type ProviderInfo struct {
	Name      Provider `json:"name"`
	Available bool     `json:"available"`
}