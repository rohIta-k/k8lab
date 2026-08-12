package resource

import (
	"context"
	"fmt"

	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listJobs(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.BatchV1().
		Jobs("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list jobs: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		status := "Running"

		if item.Status.Failed > 0 {
			status = "Failed"
		} else if item.Status.Succeeded > 0 {
			status = "Completed"
		}

		completions := fmt.Sprintf(
			"%d/%d",
			item.Status.Succeeded,
			0,
		)

		if item.Spec.Completions != nil {
			completions = fmt.Sprintf(
				"%d/%d",
				item.Status.Succeeded,
				*item.Spec.Completions,
			)
		}

		image := "-"

		if len(item.Spec.Template.Spec.Containers) > 0 {
			image = item.Spec.Template.Spec.
				Containers[0].Image
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert job %q to yaml: %w",
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
				Type:      ResourceJobs,
				Status:    status,
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"completions": completions,
					"image":       image,
					"labels":      item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createJob(
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

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
		Spec: batchv1.JobSpec{
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						ManagedLabel: "true",
						"app":        req.Name,
					},
				},
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:  req.Name,
							Image: req.Image,
						},
					},
				},
			},
		},
	}

	created, err := client.BatchV1().
		Jobs(namespace).
		Create(
			ctx,
			job,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create job: %w",
			err,
		)
	}

	completions := "0/1"

	if created.Spec.Completions != nil {
		completions = fmt.Sprintf(
			"0/%d",
			*created.Spec.Completions,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceJobs,
		Status:    "Running",
		Fields: map[string]interface{}{
			"completions": completions,
			"image":       req.Image,
			"labels":      created.Labels,
		},
	}, nil
}

func (s *Service) deleteJob(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
	name string,
) error {
	if namespace == "" {
		namespace = "default"
	}

	job, err := client.BatchV1().
		Jobs(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get job: %w",
			err,
		)
	}

	if job.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"job %q is not managed by K8Lab",
			name,
		)
	}

	err = client.BatchV1().
		Jobs(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete job: %w",
			err,
		)
	}

	return nil
}
