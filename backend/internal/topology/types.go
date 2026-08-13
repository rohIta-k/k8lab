package topology

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type NodeData struct {
	Label  string `json:"label"`
	Status string `json:"status,omitempty"`
}

type Node struct {
	ID       string   `json:"id"`
	Type     string   `json:"type"`
	Position Position `json:"position"`
	Data     NodeData `json:"data"`
}

type Edge struct {
	ID       string `json:"id"`
	Source   string `json:"source"`
	Target   string `json:"target"`
	Animated bool   `json:"animated,omitempty"`
}

type Graph struct {
	ClusterID   string `json:"clusterId"`
	ClusterName string `json:"clusterName"`
	Nodes       []Node `json:"nodes"`
	Edges       []Edge `json:"edges"`
}