package resource

import (
	"context"
	"fmt"

	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listCronJobs(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.BatchV1().
		CronJobs("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list cron jobs: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		status := "Active"

		if item.Spec.Suspend != nil &&
			*item.Spec.Suspend {
			status = "Suspended"
		}

		image := "-"

		if len(item.Spec.JobTemplate.Spec.Template.Spec.Containers) > 0 {
			image = item.Spec.JobTemplate.Spec.Template.Spec.
				Containers[0].Image
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert cron job %q to yaml: %w",
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
				Type:      ResourceCronJobs,
				Status:    status,
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"schedule": item.Spec.Schedule,
					"image":    image,
					"labels":   item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createCronJob(
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

	if req.Schedule == "" {
		return Resource{}, fmt.Errorf(
			"cron job schedule is required",
		)
	}

	cronJob := &batchv1.CronJob{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
		Spec: batchv1.CronJobSpec{
			Schedule: req.Schedule,
			JobTemplate: batchv1.JobTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: map[string]string{
						ManagedLabel: "true",
						"app":        req.Name,
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
			},
		},
	}

	created, err := client.BatchV1().
		CronJobs(namespace).
		Create(
			ctx,
			cronJob,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create cron job: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceCronJobs,
		Status:    "Active",
		Fields: map[string]interface{}{
			"schedule": created.Spec.Schedule,
			"image":    req.Image,
			"labels":   created.Labels,
		},
	}, nil
}

func (s *Service) deleteCronJob(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
	name string,
) error {
	if namespace == "" {
		namespace = "default"
	}

	cronJob, err := client.BatchV1().
		CronJobs(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get cron job: %w",
			err,
		)
	}

	if cronJob.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"cron job %q is not managed by K8Lab",
			name,
		)
	}

	err = client.BatchV1().
		CronJobs(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete cron job: %w",
			err,
		)
	}

	return nil
}
