package cluster

import (
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
)

type MinikubeProvider struct{}

func (MinikubeProvider) Name() Provider {
	return ProviderMinikube
}

func (MinikubeProvider) IsInstalled(
	ctx context.Context,
) bool {
	_, err := exec.LookPath("minikube")

	return err == nil
}

type minikubeProfile struct {
	Name   string `json:"Name"`
	Status string `json:"Status"`
}

func (MinikubeProvider) List(
	ctx context.Context,
) ([]Cluster, error) {
	cmd := exec.CommandContext(
		ctx,
		"minikube",
		"profile",
		"list",
		"-o",
		"json",
	)

	out, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf(
			"failed to list minikube profiles: %w",
			err,
		)
	}

	var profiles map[string]struct {
		Name   string `json:"Name"`
		Status string `json:"Status"`
	}

	if err := json.Unmarshal(
		out,
		&profiles,
	); err != nil {
		return nil, fmt.Errorf(
			"failed to parse minikube profiles: %w",
			err,
		)
	}

	clusters := make([]Cluster, 0)

	for _, profile := range profiles {
		status := StatusDisconnected

		switch strings.ToLower(
			profile.Status,
		) {
		case "running":
			status = StatusAvailable

		case "stopped":
			status = StatusStopped

		case "nonexistent":
			status = StatusDisconnected
		}

		contextName :=
			MinikubeProvider{}.Context(
				profile.Name,
			)

		version := ""

		if status != StatusDisconnected {
			version, _ =
				getClusterVersion(
					ctx,
					contextName,
				)
		}

		clusters = append(
			clusters,
			Cluster{
				ID:       clusterID(ProviderMinikube, profile.Name),
				Name:     profile.Name,
				Provider: ProviderMinikube,
				Version:  version,
				Status:   status,
			},
		)
	}

	return clusters, nil
}

func (MinikubeProvider) Create(
	ctx context.Context,
	name string,
) (Cluster, error) {
	cmd := exec.CommandContext(
		ctx,
		"minikube",
		"start",
		"--profile",
		name,
		"--driver=docker",
	)

	out, err := cmd.CombinedOutput()
	if err != nil {
		return Cluster{}, fmt.Errorf(
			"failed to create minikube cluster: %s",
			strings.TrimSpace(string(out)),
		)
	}

	version, _ := MinikubeProvider{}.Version(ctx)

	return Cluster{
		ID:       clusterID(ProviderMinikube, name),
		Name:     name,
		Provider: ProviderMinikube,
		Version:  version,
		Status:   StatusConnected,
		Current:  true,
	}, nil
}

func (MinikubeProvider) Delete(
	ctx context.Context,
	name string,
) error {
	cmd := exec.CommandContext(
		ctx,
		"minikube",
		"delete",
		"--profile",
		name,
	)

	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf(
			"failed to delete minikube cluster: %s",
			strings.TrimSpace(string(out)),
		)
	}

	return nil
}

func (MinikubeProvider) Version(
	ctx context.Context,
) (string, error) {
	cmd := exec.CommandContext(
		ctx,
		"minikube",
		"version",
	)

	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf(
			"failed to get minikube version: %w",
			err,
		)
	}

	return strings.TrimSpace(string(out)), nil
}

func (MinikubeProvider) Context(name string) string {
	return name
}
