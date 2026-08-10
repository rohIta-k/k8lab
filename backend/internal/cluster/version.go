package cluster

import (
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
)

type kubectlVersionResponse struct {
	ServerVersion struct {
		GitVersion string `json:"gitVersion"`
	} `json:"serverVersion"`
}

func getClusterVersion(
	ctx context.Context,
	contextName string,
) (string, error) {
	cmd := exec.CommandContext(
		ctx,
		"kubectl",
		"version",
		"--context",
		contextName,
		"-o",
		"json",
	)

	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf(
			"failed to get cluster version: %w",
			err,
		)
	}

	var result kubectlVersionResponse

	if err := json.Unmarshal(
		out,
		&result,
	); err != nil {
		return "", fmt.Errorf(
			"failed to parse cluster version: %w",
			err,
		)
	}

	return result.ServerVersion.GitVersion, nil
}
