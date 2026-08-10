package cluster

import (
	"context"
	"fmt"
	"strings"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func GetHealth(
	ctx context.Context,
	contextName string,
) ([]ClusterHealth, error) {
	config, err := kubeConfig(contextName)
	if err != nil {
		return nil, err
	}

	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		return nil, fmt.Errorf(
			"failed to create kubernetes client: %w",
			err,
		)
	}

	health := make([]ClusterHealth, 0, 6)

	health = append(
		health,
		checkAPIServer(ctx, client),
	)

	health = append(
		health,
		checkControlPlaneComponent(
			ctx,
			client,
			"scheduler",
			"kube-scheduler",
		),
	)

	health = append(
		health,
		checkControlPlaneComponent(
			ctx,
			client,
			"controller-manager",
			"kube-controller-manager",
		),
	)

	health = append(
		health,
		checkControlPlaneComponent(
			ctx,
			client,
			"etcd",
			"etcd",
		),
	)

	health = append(
		health,
		checkCoreDNS(ctx, client),
	)

	health = append(
		health,
		checkNodes(ctx, client),
	)

	return health, nil
}

func checkAPIServer(
	ctx context.Context,
	client kubernetes.Interface,
) ClusterHealth {
	_, err := client.CoreV1().
		Namespaces().
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return ClusterHealth{
			ID:     "api-server",
			Name:   "API Server",
			Status: HealthUnhealthy,
			Reason: "Kubernetes API server is unreachable",
		}
	}

	return ClusterHealth{
		ID:     "api-server",
		Name:   "API Server",
		Status: HealthHealthy,
	}
}

func checkControlPlaneComponent(
	ctx context.Context,
	client kubernetes.Interface,
	id string,
	component string,
) ClusterHealth {
	pods, err := client.CoreV1().
		Pods("kube-system").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return ClusterHealth{
			ID:     id,
			Name:   componentName(id),
			Status: HealthUnhealthy,
			Reason: "Unable to query kube-system pods",
		}
	}

	for _, pod := range pods.Items {
		if !isComponentPod(
			pod.Labels,
			pod.Name,
			component,
		) {
			continue
		}

		if pod.Status.Phase != "Running" {
			return ClusterHealth{
				ID:     id,
				Name:   componentName(id),
				Status: HealthUnhealthy,
				Reason: fmt.Sprintf(
					"Pod is %s",
					pod.Status.Phase,
				),
			}
		}

		for _, container := range pod.Status.ContainerStatuses {
			if !container.Ready {
				return ClusterHealth{
					ID:     id,
					Name:   componentName(id),
					Status: HealthUnhealthy,
					Reason: fmt.Sprintf(
						"Container %s is not ready",
						container.Name,
					),
				}
			}
		}

		return ClusterHealth{
			ID:     id,
			Name:   componentName(id),
			Status: HealthHealthy,
		}
	}

	return ClusterHealth{
		ID:     id,
		Name:   componentName(id),
		Status: HealthUnhealthy,
		Reason: fmt.Sprintf(
			"%s pod was not found",
			component,
		),
	}
}

func isComponentPod(
	labels map[string]string,
	podName string,
	component string,
) bool {
	if labels["component"] == component {
		return true
	}

	if labels["k8s-app"] == component {
		return true
	}

	return strings.Contains(
		podName,
		component,
	)
}

func componentName(id string) string {
	switch id {
	case "scheduler":
		return "Scheduler"

	case "controller-manager":
		return "Controller Manager"

	case "etcd":
		return "etcd"

	default:
		return id
	}
}

func checkCoreDNS(
	ctx context.Context,
	client kubernetes.Interface,
) ClusterHealth {
	pods, err := client.CoreV1().
		Pods("kube-system").
		List(
			ctx,
			metav1.ListOptions{
				LabelSelector: "k8s-app=kube-dns",
			},
		)

	if err != nil {
		return ClusterHealth{
			ID:     "core-dns",
			Name:   "CoreDNS",
			Status: HealthUnhealthy,
			Reason: "Unable to query CoreDNS pods",
		}
	}

	if len(pods.Items) == 0 {
		return ClusterHealth{
			ID:     "core-dns",
			Name:   "CoreDNS",
			Status: HealthUnhealthy,
			Reason: "No CoreDNS pods found",
		}
	}

	for _, pod := range pods.Items {
		if pod.Status.Phase != "Running" {
			return ClusterHealth{
				ID:     "core-dns",
				Name:   "CoreDNS",
				Status: HealthUnhealthy,
				Reason: fmt.Sprintf(
					"CoreDNS pod %s is %s",
					pod.Name,
					pod.Status.Phase,
				),
			}
		}

		for _, container := range pod.Status.ContainerStatuses {
			if !container.Ready {
				return ClusterHealth{
					ID:     "core-dns",
					Name:   "CoreDNS",
					Status: HealthUnhealthy,
					Reason: fmt.Sprintf(
						"CoreDNS container %s is not ready",
						container.Name,
					),
				}
			}
		}
	}

	return ClusterHealth{
		ID:     "core-dns",
		Name:   "CoreDNS",
		Status: HealthHealthy,
	}
}

func checkNodes(
	ctx context.Context,
	client kubernetes.Interface,
) ClusterHealth {
	nodes, err := client.CoreV1().
		Nodes().
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return ClusterHealth{
			ID:     "nodes",
			Name:   "Nodes",
			Status: HealthUnhealthy,
			Reason: "Unable to query cluster nodes",
		}
	}

	if len(nodes.Items) == 0 {
		return ClusterHealth{
			ID:     "nodes",
			Name:   "Nodes",
			Status: HealthUnhealthy,
			Reason: "No nodes found",
		}
	}

	for _, node := range nodes.Items {
		ready := false

		for _, condition := range node.Status.Conditions {
			if condition.Type == "Ready" {
				ready = condition.Status == "True"
				break
			}
		}

		if !ready {
			return ClusterHealth{
				ID:     "nodes",
				Name:   "Nodes",
				Status: HealthUnhealthy,
				Reason: fmt.Sprintf(
					"Node %s is not ready",
					node.Name,
				),
			}
		}
	}

	return ClusterHealth{
		ID:     "nodes",
		Name:   "Nodes",
		Status: HealthHealthy,
	}
}