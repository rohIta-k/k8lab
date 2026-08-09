package cluster

import (
	"context"
	"os/exec"
)

func IsDockerInstalled() bool {
	_, err := exec.LookPath("docker")

	return err == nil
}

func IsDockerRunning(ctx context.Context) bool {
	if !IsDockerInstalled() {
		return false
	}

	cmd := exec.CommandContext(
		ctx,
		"docker",
		"info",
	)

	return cmd.Run() == nil
}
