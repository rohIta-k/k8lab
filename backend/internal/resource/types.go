package resource

type ResourceType string

const (
	ResourceNamespaces             ResourceType = "namespaces"
	ResourceDeployments            ResourceType = "deployments"
	ResourceReplicaSets            ResourceType = "replicaSets"
	ResourcePods                   ResourceType = "pods"
	ResourceServices               ResourceType = "services"
	ResourceConfigMaps             ResourceType = "configMaps"
	ResourceIngresses              ResourceType = "ingresses"
	ResourcePersistentVolumeClaims ResourceType = "persistentVolumeClaims"
	ResourceJobs                   ResourceType = "jobs"
	ResourceCronJobs               ResourceType = "cronJobs"
)

const ManagedLabel = "k8lab.io/managed"

type Resource struct {
	ID        string                 `json:"id"`
	Name      string                 `json:"name"`
	Namespace string                 `json:"namespace,omitempty"`
	Type      ResourceType           `json:"type"`
	Status    string                 `json:"status,omitempty"`
	Fields    map[string]interface{} `json:"fields,omitempty"`
	YAML      string                 `json:"yaml,omitempty"`
}

type CreateRequest struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace,omitempty"`

	Image    string `json:"image,omitempty"`
	Replicas int32  `json:"replicas,omitempty"`

	Type     string `json:"type,omitempty"`
	Port     int32  `json:"port,omitempty"`
	Storage  string `json:"storage,omitempty"`
	Schedule string `json:"schedule,omitempty"`
}

type ResourceList struct {
	Type      ResourceType `json:"type"`
	Resources []Resource   `json:"resources"`
}
