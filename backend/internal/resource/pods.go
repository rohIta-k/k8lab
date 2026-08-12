package resource

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listPods(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.CoreV1().
		Pods("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list pods: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		ready := 0

		for _, status := range item.Status.ContainerStatuses {
			if status.Ready {
				ready++
			}
		}

		restarts := int32(0)

		for _, status := range item.Status.ContainerStatuses {
			restarts += status.RestartCount
		}

		image := "-"

		if len(item.Spec.Containers) > 0 {
			image = item.Spec.Containers[0].Image
		}

		owner := ""

		if len(item.OwnerReferences) > 0 {
			owner = item.OwnerReferences[0].Name
		}

		status := string(item.Status.Phase)

		if status == "" {
			status = "Unknown"
		}

		for _, container := range item.Status.ContainerStatuses {
			if container.State.Waiting != nil &&
				container.State.Waiting.Reason != "" {
				status = container.State.Waiting.Reason
				break
			}

			if container.State.Terminated != nil &&
				container.State.Terminated.Reason != "" {
				status = container.State.Terminated.Reason
				break
			}
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert pod %q to yaml: %w",
				item.Name,
				err,
			)
		}

		result = append(
			result,
			Resource{
				ID:        item.Name,
				Name:      item.Name,
				Namespace: item.Namespace,
				Type:      ResourcePods,
				Status:    status,
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"ready": fmt.Sprintf(
						"%d/%d",
						ready,
						len(item.Spec.Containers),
					),
					"restartCount": restarts,
					"node":         item.Spec.NodeName,
					"ip":           item.Status.PodIP,
					"image":        image,
					"owner":        owner,
					"labels":       item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createPod(
	ctx context.Context,
	client *kubernetes.Clientset,
	req CreateRequest,
) (Resource, error) {
	if err := validateName(req.Name); err != nil {
		return Resource{}, err
	}

	namespace := req.Namespace

	if namespace == "" {
		namespace = "default"
	}

	if err := validateNamespaceExists(
		ctx,
		client,
		namespace,
	); err != nil {
		return Resource{}, err
	}

	if err := validateImage(req.Image); err != nil {
		return Resource{}, err
	}

	_, err := client.CoreV1().
		Pods(namespace).
		Get(
			ctx,
			req.Name,
			metav1.GetOptions{},
		)

	if err == nil {
		return Resource{}, fmt.Errorf(
			"pod %q already exists in namespace %q",
			req.Name,
			namespace,
		)
	}

	labels := map[string]string{
		"app":        req.Name,
		ManagedLabel: "true",
	}

	pod := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels:    labels,
		},

		Spec: corev1.PodSpec{
			Containers: []corev1.Container{
				{
					Name:  req.Name,
					Image: req.Image,
				},
			},
		},
	}

	created, err := client.CoreV1().
		Pods(namespace).
		Create(
			ctx,
			pod,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create pod: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourcePods,
		Status:    string(created.Status.Phase),
		Fields: map[string]interface{}{
			"ready":        "0/1",
			"restartCount": 0,
			"node":         created.Spec.NodeName,
			"ip":           created.Status.PodIP,
			"image":        req.Image,
			"owner":        "",
			"labels":       created.Labels,
		},
	}, nil
}

func (s *Service) deletePod(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
	name string,
) error {
	if err := validateName(name); err != nil {
		return err
	}

	if namespace == "" {
		namespace = "default"
	}

	if err := validateNamespaceName(
		namespace,
	); err != nil {
		return err
	}

	pod, err := client.CoreV1().
		Pods(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get pod: %w",
			err,
		)
	}

	if pod.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"pod %q is not managed by K8Lab",
			name,
		)
	}

	err = client.CoreV1().
		Pods(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete pod: %w",
			err,
		)
	}

	return nil
}
