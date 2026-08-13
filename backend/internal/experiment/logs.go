package experiment

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	k8sclient "github.com/rohIta-k/k8lab/backend/internal/kubernetes"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
)

func (r *KubernetesRunner) Logs(
	ctx context.Context,
	clusterID string,
	experiment Experiment,
	runID string,
) ([]ExperimentLog, Status, error) {
	client, err := k8sclient.NewClient(
		ctx,
		clusterID,
		r.clusterService,
	)
	if err != nil {
		return nil, StatusFailed, err
	}

	selector := labels.SelectorFromSet(
		labels.Set{
			experimentLabel: experiment.ID,
			runLabel:        runID,
		},
	).String()

	pods, err := client.CoreV1().
		Pods(experiment.Namespace).
		List(
			ctx,
			metav1.ListOptions{
				LabelSelector: selector,
			},
		)

	if err != nil {
		return nil, StatusFailed, fmt.Errorf(
			"failed to list experiment pods: %w",
			err,
		)
	}

	logs := make([]ExperimentLog, 0)
	status := StatusRunning

	for _, pod := range pods.Items {
		podStatus := getPodStatus(pod)

		if isExpectedFailure(
			experiment.ExpectedState,
			pod,
		) {
			status = StatusCompleted
		}

		logs = append(
			logs,
			ExperimentLog{
				Timestamp: time.Now(),
				Source:    "kubernetes",
				Message: fmt.Sprintf(
					"Pod %s: %s",
					pod.Name,
					podStatus,
				),
			},
		)

		for _, container := range pod.Spec.Containers {
			request := client.CoreV1().
				Pods(pod.Namespace).
				GetLogs(
					pod.Name,
					&corev1.PodLogOptions{
						Container: container.Name,
						TailLines: int64Ptr(100),
					},
				)

			stream, err := request.Stream(ctx)
			if err != nil {
				continue
			}

			data, err := io.ReadAll(stream)
			stream.Close()

			if err != nil {
				continue
			}

			for _, line := range strings.Split(
				strings.TrimSpace(string(data)),
				"\n",
			) {
				if strings.TrimSpace(line) == "" {
					continue
				}

				logs = append(
					logs,
					ExperimentLog{
						Timestamp: time.Now(),
						Source:    "pod",
						Message:   line,
					},
				)
			}
		}
	}

	if len(pods.Items) == 0 {
		logs = append(
			logs,
			ExperimentLog{
				Timestamp: time.Now(),
				Source:    "system",
				Message:   "Waiting for experiment pod to be created...",
			},
		)
	}

	return logs, status, nil
}
