package resource

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listNamespaces(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.CoreV1().
		Namespaces().
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list namespaces: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert namespace %q to yaml: %w",
				item.Name,
				err,
			)
		}

		result = append(
			result,
			Resource{
				ID:     item.Name,
				Name:   item.Name,
				Type:   ResourceNamespaces,
				Status: string(item.Status.Phase),
				YAML:   yamlData,
				Fields: map[string]interface{}{
					"labels": item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createNamespace(
	ctx context.Context,
	client *kubernetes.Clientset,
	req CreateRequest,
) (Resource, error) {
	if err := validateName(req.Name); err != nil {
		return Resource{}, err
	}

	if err := validateNamespaceCreate(
		ctx,
		client,
		req.Name,
	); err != nil {
		return Resource{}, err
	}

	namespace := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: req.Name,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
	}

	created, err := client.CoreV1().
		Namespaces().
		Create(
			ctx,
			namespace,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create namespace: %w",
			err,
		)
	}

	return Resource{
		ID:     created.Name,
		Name:   created.Name,
		Type:   ResourceNamespaces,
		Status: string(created.Status.Phase),
		Fields: map[string]interface{}{
			"labels": created.Labels,
		},
	}, nil
}

func (s *Service) deleteNamespace(
	ctx context.Context,
	client *kubernetes.Clientset,
	name string,
) error {
	if err := validateName(name); err != nil {
		return err
	}

	namespace, err := client.CoreV1().
		Namespaces().
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get namespace: %w",
			err,
		)
	}

	if namespace.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"namespace %q is not managed by K8Lab",
			name,
		)
	}

	err = client.CoreV1().
		Namespaces().
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete namespace: %w",
			err,
		)
	}

	return nil
}
