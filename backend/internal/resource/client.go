package resource

import (
	"context"
	"fmt"
	"os"

	"github.com/rohIta-k/k8lab/backend/internal/cluster"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func kubeConfig(
	ctx context.Context,
	clusterID string,
	clusterService *cluster.Service,
) (*rest.Config, error) {
	if clusterService == nil {
		return nil, fmt.Errorf(
			"cluster service is required",
		)
	}

	provider, name, err :=
		clusterService.Resolve(
			ctx,
			clusterID,
		)

	if err != nil {
		return nil, err
	}

	contextName := provider.Context(name)

	kubeconfig := os.Getenv("KUBECONFIG")

	if kubeconfig == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			return nil, fmt.Errorf(
				"failed to find home directory: %w",
				err,
			)
		}

		kubeconfig = home + "/.kube/config"
	}

	config, err :=
		clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			&clientcmd.ClientConfigLoadingRules{
				ExplicitPath: kubeconfig,
			},
			&clientcmd.ConfigOverrides{
				CurrentContext: contextName,
			},
		).ClientConfig()

	if err != nil {
		return nil, fmt.Errorf(
			"failed to create kubernetes config: %w",
			err,
		)
	}

	return config, nil
}

func newClient(
	ctx context.Context,
	clusterID string,
	clusterService *cluster.Service,
) (*kubernetes.Clientset, error) {
	if clusterService == nil {
		return nil, fmt.Errorf(
			"cluster service is required",
		)
	}

	provider, name, err :=
		clusterService.Resolve(ctx, clusterID)

	if err != nil {
		return nil, err
	}

	contextName := provider.Context(name)

	kubeconfig := os.Getenv("KUBECONFIG")

	if kubeconfig == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			return nil, fmt.Errorf(
				"failed to find home directory: %w",
				err,
			)
		}

		kubeconfig =
			home + "/.kube/config"
	}

	config, err :=
		clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
			&clientcmd.ClientConfigLoadingRules{
				ExplicitPath: kubeconfig,
			},
			&clientcmd.ConfigOverrides{
				CurrentContext: contextName,
			},
		).ClientConfig()

	if err != nil {
		return nil, fmt.Errorf(
			"failed to create kubernetes config: %w",
			err,
		)
	}

	client, err :=
		kubernetes.NewForConfig(config)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to create kubernetes client: %w",
			err,
		)
	}

	return client, nil
}
