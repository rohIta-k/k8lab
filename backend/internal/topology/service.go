package topology

import (
	"context"
	"fmt"

	"github.com/rohIta-k/k8lab/backend/internal/cluster"
	k8sclient "github.com/rohIta-k/k8lab/backend/internal/kubernetes"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
)

type Service struct {
	clusterService *cluster.Service
}

func NewService(
	clusterService *cluster.Service,
) *Service {
	return &Service{
		clusterService: clusterService,
	}
}

func (s *Service) Get(
	ctx context.Context,
	clusterID string,
) (Graph, error) {
	if s.clusterService == nil {
		return Graph{}, fmt.Errorf(
			"cluster service is required",
		)
	}

	_, clusterName, err :=
		s.clusterService.Resolve(
			ctx,
			clusterID,
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to resolve cluster: %w",
			err,
		)
	}

	client, err := k8sclient.NewClient(
		ctx,
		clusterID,
		s.clusterService,
	)
	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to create kubernetes client: %w",
			err,
		)
	}

	return s.buildGraph(
		ctx,
		client,
		clusterID,
		clusterName,
	)
}

func (s *Service) buildGraph(
	ctx context.Context,
	client *kubernetes.Clientset,
	clusterID string,
	clusterName string,
) (Graph, error) {
	graph := Graph{
		ClusterID:   clusterID,
		ClusterName: clusterName,
		Nodes:       []Node{},
		Edges:       []Edge{},
	}

	/*
	 * Cluster
	 */
	graph.Nodes = append(
		graph.Nodes,
		Node{
			ID:   "cluster",
			Type: "cluster",
			Position: Position{
				X: 500,
				Y: 40,
			},
			Data: NodeData{
				Label: clusterName,
			},
		},
	)

	/*
	 * Kubernetes nodes
	 */
	nodes, err := client.CoreV1().
		Nodes().
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list nodes: %w",
			err,
		)
	}

	for i, item := range nodes.Items {
		id := "node-" + item.Name

		graph.Nodes = append(
			graph.Nodes,
			Node{
				ID:   id,
				Type: "node",
				Position: Position{
					X: 200 + (i * 350),
					Y: 200,
				},
				Data: NodeData{
					Label: item.Name,
				},
			},
		)

		graph.Edges = append(
			graph.Edges,
			Edge{
				ID:       "cluster-" + id,
				Source:   "cluster",
				Target:   id,
				Animated: true,
			},
		)
	}

	/*
	 * Deployments
	 */
	deployments, err := client.AppsV1().
		Deployments("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list deployments: %w",
			err,
		)
	}

	/*
	 * Fetch all ReplicaSets once.
	 */
	replicaSets, err := client.AppsV1().
		ReplicaSets("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list replica sets: %w",
			err,
		)
	}

	/*
	 * Fetch all Pods once.
	 */
	pods, err := client.CoreV1().
		Pods("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list pods: %w",
			err,
		)
	}

	for i, deployment := range deployments.Items {
		deploymentID := resourceID(
			"deployment",
			deployment.Namespace,
			deployment.Name,
		)

		graph.Nodes = append(
			graph.Nodes,
			Node{
				ID:   deploymentID,
				Type: "deployment",
				Position: Position{
					X: 200 + (i * 350),
					Y: 380,
				},
				Data: NodeData{
					Label: deployment.Name,
				},
			},
		)

		for _, rs := range replicaSets.Items {
			if rs.Namespace != deployment.Namespace {
				continue
			}

			if !ownedBy(
				rs.OwnerReferences,
				deployment.UID,
			) {
				continue
			}

			rsID := resourceID(
				"replicaset",
				rs.Namespace,
				rs.Name,
			)

			graph.Nodes = append(
				graph.Nodes,
				Node{
					ID:   rsID,
					Type: "replicaSet",
					Position: Position{
						X: 200 + (i * 350),
						Y: 540,
					},
					Data: NodeData{
						Label: rs.Name,
					},
				},
			)

			graph.Edges = append(
				graph.Edges,
				Edge{
					ID:       deploymentID + "-" + rsID,
					Source:   deploymentID,
					Target:   rsID,
					Animated: true,
				},
			)

			/*
			 * ReplicaSet -> Pods
			 */
			for _, pod := range pods.Items {
				if pod.Namespace != rs.Namespace {
					continue
				}

				if !ownedBy(
					pod.OwnerReferences,
					rs.UID,
				) {
					continue
				}

				podID := resourceID(
					"pod",
					pod.Namespace,
					pod.Name,
				)

				graph.Nodes = append(
					graph.Nodes,
					Node{
						ID:   podID,
						Type: "pod",
						Position: Position{
							X: 100,
							Y: 700,
						},
						Data: NodeData{
							Label:  pod.Name,
							Status: string(pod.Status.Phase),
						},
					},
				)

				graph.Edges = append(
					graph.Edges,
					Edge{
						ID:       rsID + "-" + podID,
						Source:   rsID,
						Target:   podID,
						Animated: true,
					},
				)

				/*
				 * Node -> Pod
				 */
				if pod.Spec.NodeName != "" {
					nodeID :=
						"node-" + pod.Spec.NodeName

					graph.Edges = append(
						graph.Edges,
						Edge{
							ID:     nodeID + "-" + podID,
							Source: nodeID,
							Target: podID,
						},
					)
				}
			}
		}
	}

	/*
	 * Services
	 */
	services, err := client.CoreV1().
		Services("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list services: %w",
			err,
		)
	}

	for i, service := range services.Items {
		serviceID := resourceID(
			"service",
			service.Namespace,
			service.Name,
		)

		graph.Nodes = append(
			graph.Nodes,
			Node{
				ID:   serviceID,
				Type: "service",
				Position: Position{
					X: 850,
					Y: 380 + (i * 150),
				},
				Data: NodeData{
					Label: service.Name,
				},
			},
		)

		if len(service.Spec.Selector) == 0 {
			continue
		}

		selector := labels.Set(
			service.Spec.Selector,
		).AsSelector()

		for _, pod := range pods.Items {
			if pod.Namespace != service.Namespace {
				continue
			}

			if !selector.Matches(
				labels.Set(pod.Labels),
			) {
				continue
			}

			podID := resourceID(
				"pod",
				pod.Namespace,
				pod.Name,
			)

			graph.Edges = append(
				graph.Edges,
				Edge{
					ID:       serviceID + "-" + podID,
					Source:   serviceID,
					Target:   podID,
					Animated: true,
				},
			)
		}
	}

	/*
	 * Ingresses
	 */
	ingresses, err := client.NetworkingV1().
		Ingresses("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list ingresses: %w",
			err,
		)
	}

	for i, ingress := range ingresses.Items {
		ingressID := resourceID(
			"ingress",
			ingress.Namespace,
			ingress.Name,
		)

		graph.Nodes = append(
			graph.Nodes,
			Node{
				ID:   ingressID,
				Type: "ingress",
				Position: Position{
					X: 850,
					Y: 100 + (i * 120),
				},
				Data: NodeData{
					Label: ingress.Name,
				},
			},
		)

		for _, rule := range ingress.Spec.Rules {
			if rule.HTTP == nil {
				continue
			}

			for _, path := range rule.HTTP.Paths {
				if path.Backend.Service == nil {
					continue
				}

				serviceID := resourceID(
					"service",
					ingress.Namespace,
					path.Backend.Service.Name,
				)

				graph.Edges = append(
					graph.Edges,
					Edge{
						ID:       ingressID + "-" + serviceID,
						Source:   ingressID,
						Target:   serviceID,
						Animated: true,
					},
				)
			}
		}
	}

	/*
	 * ConfigMaps
	 */
	configMaps, err := client.CoreV1().
		ConfigMaps("").
		List(
			ctx,
			metav1.ListOptions{},
		)

	if err != nil {
		return Graph{}, fmt.Errorf(
			"failed to list config maps: %w",
			err,
		)
	}

	for i, configMap := range configMaps.Items {
		configID := resourceID(
			"configmap",
			configMap.Namespace,
			configMap.Name,
		)

		graph.Nodes = append(
			graph.Nodes,
			Node{
				ID:   configID,
				Type: "configMap",
				Position: Position{
					X: 1100,
					Y: 500 + (i * 120),
				},
				Data: NodeData{
					Label: configMap.Name,
				},
			},
		)

		addConfigMapEdges(
			&graph,
			ctx,
			pods.Items,
			configMap.Namespace,
			configMap.Name,
			configID,
		)
	}

	return graph, nil
}

func ownedBy(
	owners []metav1.OwnerReference,
	uid types.UID,
) bool {
	for _, owner := range owners {
		if owner.UID == uid {
			return true
		}
	}

	return false
}

func resourceID(
	kind string,
	namespace string,
	name string,
) string {
	return fmt.Sprintf(
		"%s-%s-%s",
		kind,
		namespace,
		name,
	)
}

func addConfigMapEdges(
	graph *Graph,
	ctx context.Context,
	pods []v1.Pod,
	namespace string,
	name string,
	configID string,
) {
	for _, pod := range pods {
		if pod.Namespace != namespace {
			continue
		}

		for _, volume := range pod.Spec.Volumes {
			if volume.ConfigMap == nil {
				continue
			}

			if volume.ConfigMap.Name != name {
				continue
			}

			podID := resourceID(
				"pod",
				namespace,
				pod.Name,
			)

			graph.Edges = append(
				graph.Edges,
				Edge{
					ID:     configID + "-" + podID,
					Source: configID,
					Target: podID,
				},
			)
		}
	}
}
