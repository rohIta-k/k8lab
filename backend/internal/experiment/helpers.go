package experiment

import (
	"strings"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
)

func experimentLabels(
	experimentID string,
	runID string,
) map[string]string {
	return map[string]string{
		experimentLabel: experimentID,
		runLabel:        runID,
	}
}

func shortRunID(
	runID string,
) string {
	runID = strings.ReplaceAll(
		runID,
		"_",
		"-",
	)

	if len(runID) > 12 {
		return runID[len(runID)-12:]
	}

	return runID
}

func int64Ptr(
	value int64,
) *int64 {
	return &value
}

func resourceQuantity(
	value string,
) resource.Quantity {
	return resource.MustParse(value)
}

func getPodStatus(
	pod corev1.Pod,
) string {
	if pod.Status.Phase == corev1.PodPending {
		if pod.Status.Reason != "" {
			return pod.Status.Reason
		}

		return "Pending"
	}

	for _, container := range pod.Status.ContainerStatuses {
		if container.State.Waiting != nil {
			if container.State.Waiting.Reason != "" {
				return container.State.Waiting.Reason
			}

			return "Waiting"
		}

		if container.State.Terminated != nil {
			if container.State.Terminated.Reason != "" {
				return container.State.Terminated.Reason
			}

			return "Terminated"
		}
	}

	return string(pod.Status.Phase)
}

func isExpectedFailure(
	expected string,
	pod corev1.Pod,
) bool {
	expected = strings.ToLower(
		expected,
	)

	for _, container := range pod.Status.ContainerStatuses {
		if container.State.Waiting != nil {
			if strings.EqualFold(
				container.State.Waiting.Reason,
				expected,
			) {
				return true
			}
		}

		if container.State.Terminated != nil {
			if strings.EqualFold(
				container.State.Terminated.Reason,
				expected,
			) {
				return true
			}
		}
	}

	if strings.EqualFold(
		expected,
		string(pod.Status.Phase),
	) {
		return true
	}

	return false
}
