package resource

import (
	"context"
	"fmt"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listDeployments(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.AppsV1().
		Deployments("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list deployments: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		replicas := int32(0)

		if item.Spec.Replicas != nil {
			replicas = *item.Spec.Replicas
		}

		image := "-"

		if len(item.Spec.Template.Spec.Containers) > 0 {
			image =
				item.Spec.Template.Spec.
					Containers[0].Image
		}

		status := "Pending"

		if replicas > 0 &&
			item.Status.ReadyReplicas == replicas {
			status = "Running"
		} else if item.Status.UnavailableReplicas > 0 {
			status = "Warning"
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert deployment %q to yaml: %w",
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
				Type:      ResourceDeployments,
				Status:    status,
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"ready": fmt.Sprintf(
						"%d/%d",
						item.Status.ReadyReplicas,
						replicas,
					),
					"replicas": replicas,
					"image":    image,
					"strategy": string(
						item.Spec.Strategy.Type,
					),
					"labels": item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createDeployment(
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

	if err := validateReplicas(req.Replicas); err != nil {
		return Resource{}, err
	}

	// Check whether the deployment already exists.
	_, err := client.AppsV1().
		Deployments(namespace).
		Get(
			ctx,
			req.Name,
			metav1.GetOptions{},
		)

	if err == nil {
		return Resource{}, fmt.Errorf(
			"deployment %q already exists in namespace %q",
			req.Name,
			namespace,
		)
	}

	labels := map[string]string{
		"app":        req.Name,
		ManagedLabel: "true",
	}

	replicas := req.Replicas

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels:    labels,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,

			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					"app": req.Name,
				},
			},

			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},

				Spec: corev1.PodSpec{
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

	created, err := client.AppsV1().
		Deployments(namespace).
		Create(
			ctx,
			deployment,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create deployment: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceDeployments,
		Status:    "Pending",
		Fields: map[string]interface{}{
			"ready": fmt.Sprintf(
				"0/%d",
				replicas,
			),
			"replicas": replicas,
			"image":    req.Image,
			"strategy": string(
				created.Spec.Strategy.Type,
			),
			"labels": created.Labels,
		},
	}, nil
}

func (s *Service) deleteDeployment(
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

	deployment, err := client.AppsV1().
		Deployments(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get deployment: %w",
			err,
		)
	}

	if deployment.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"deployment %q is not managed by K8Lab",
			name,
		)
	}

	err = client.AppsV1().
		Deployments(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete deployment: %w",
			err,
		)
	}

	return nil
}
