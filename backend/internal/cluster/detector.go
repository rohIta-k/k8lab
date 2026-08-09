package cluster

import (
	"context"
	"os/exec"
)

func IsCommandAvailable(name string) bool {
	_, err := exec.LookPath(name)

	return err == nil
}

func DetectProviders(
	ctx context.Context,
) []ProviderInfo {
	dockerRunning := IsDockerRunning(ctx)

	providers := []ProviderInfo{
		{
			Name: ProviderKind,
			Available: dockerRunning &&
				IsCommandAvailable("kind"),
		},
		{
			Name: ProviderMinikube,
			Available: dockerRunning &&
				IsCommandAvailable("minikube"),
		},
	}

	return providers
}