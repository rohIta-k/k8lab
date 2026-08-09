package cluster

import (
	"context"
	"fmt"
	"os/exec"
	"strings"
)

type KindProvider struct{}

func (KindProvider) Name() Provider {
	return ProviderKind
}

func (KindProvider) IsInstalled(
	ctx context.Context,
) bool {
	_, err := exec.LookPath("kind")

	return err == nil
}

func (KindProvider) List(
	ctx context.Context,
) ([]Cluster, error) {
	cmd := exec.CommandContext(
		ctx,
		"kind",
		"get",
		"clusters",
	)

	out, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf(
			"failed to list kind clusters: %w",
			err,
		)
	}

	var clusters []Cluster

	for _, name := range strings.Fields(
		string(out),
	) {
		clusters = append(
			clusters,
			Cluster{
				ID:       "kind-" + name,
				Name:     name,
				Provider: ProviderKind,
				Status:   StatusAvailable,
			},
		)
	}

	if clusters == nil {
		clusters = []Cluster{}
	}

	return clusters, nil
}

func (KindProvider) Create(
	ctx context.Context,
	name string,
) (Cluster, error) {
	cmd := exec.CommandContext(
		ctx,
		"kind",
		"create",
		"cluster",
		"--name",
		name,
	)

	out, err := cmd.CombinedOutput()
	if err != nil {
		return Cluster{}, fmt.Errorf(
			"failed to create kind cluster: %s",
			strings.TrimSpace(string(out)),
		)
	}

	version, _ := KindProvider{}.Version(ctx)

	return Cluster{
		ID:       "kind-" + name,
		Name:     name,
		Provider: ProviderKind,
		Version:  version,
		Status:   StatusConnected,
		Current:  true,
	}, nil
}

func (KindProvider) Delete(
	ctx context.Context,
	name string,
) error {
	cmd := exec.CommandContext(
		ctx,
		"kind",
		"delete",
		"cluster",
		"--name",
		name,
	)

	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf(
			"failed to delete kind cluster: %s",
			strings.TrimSpace(string(out)),
		)
	}

	return nil
}

func (KindProvider) Version(
	ctx context.Context,
) (string, error) {
	cmd := exec.CommandContext(
		ctx,
		"kind",
		"version",
	)

	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf(
			"failed to get kind version: %w",
			err,
		)
	}

	return strings.TrimSpace(string(out)), nil
}

func (KindProvider) Context(name string) string {
	return "kind-" + name
}
