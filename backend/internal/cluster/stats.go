package cluster

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func GetStats(
	ctx context.Context,
	contextName string,
) (ClusterStats, error) {
	config, err := kubeConfig(contextName)
	if err != nil {
		return ClusterStats{}, err
	}

	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to create kubernetes client: %w",
			err,
		)
	}

	nodes, err := client.CoreV1().
		Nodes().
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to get nodes: %w",
			err,
		)
	}

	namespaces, err := client.CoreV1().
		Namespaces().
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to get namespaces: %w",
			err,
		)
	}

	pods, err := client.CoreV1().
		Pods("").
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to get pods: %w",
			err,
		)
	}

	deployments, err := client.AppsV1().
		Deployments("").
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to get deployments: %w",
			err,
		)
	}

	services, err := client.CoreV1().
		Services("").
		List(ctx, metav1.ListOptions{})
	if err != nil {
		return ClusterStats{}, fmt.Errorf(
			"failed to get services: %w",
			err,
		)
	}

	return ClusterStats{
		Nodes:       len(nodes.Items),
		Namespaces:  len(namespaces.Items),
		Pods:        len(pods.Items),
		Deployments: len(deployments.Items),
		Services:    len(services.Items),
	}, nil
}

func kubeConfig(
	contextName string,
) (*rest.Config, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf(
			"failed to find home directory: %w",
			err,
		)
	}

	kubeconfig := filepath.Join(
		home,
		".kube",
		"config",
	)

	overrides := &clientcmd.ConfigOverrides{}

	if contextName != "" {
		overrides.CurrentContext = contextName
	}

	clientConfig :=
		clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			&clientcmd.ClientConfigLoadingRules{
				ExplicitPath: kubeconfig,
			},
			overrides,
		)

	restConfig, err := clientConfig.ClientConfig()
	if err != nil {
		return nil, fmt.Errorf(
			"failed to create kubernetes config: %w",
			err,
		)
	}

	return restConfig, nil
}
