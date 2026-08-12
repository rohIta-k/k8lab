package resource

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listConfigMaps(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.CoreV1().
		ConfigMaps("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list config maps: %w",
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
				"failed to convert config map %q to yaml: %w",
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
				Type:      ResourceConfigMaps,
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"keys":   len(item.Data),
					"labels": item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createConfigMap(
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

	_, err := client.CoreV1().
		ConfigMaps(namespace).
		Get(
			ctx,
			req.Name,
			metav1.GetOptions{},
		)

	if err == nil {
		return Resource{}, fmt.Errorf(
			"config map %q already exists in namespace %q",
			req.Name,
			namespace,
		)
	}

	configMap := &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},

		Data: map[string]string{},
	}

	created, err := client.CoreV1().
		ConfigMaps(namespace).
		Create(
			ctx,
			configMap,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create config map: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceConfigMaps,
		Fields: map[string]interface{}{
			"keys":   len(created.Data),
			"labels": created.Labels,
		},
	}, nil
}

func (s *Service) deleteConfigMap(
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

	configMap, err := client.CoreV1().
		ConfigMaps(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get config map: %w",
			err,
		)
	}

	if configMap.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"config map %q is not managed by K8Lab",
			name,
		)
	}

	err = client.CoreV1().
		ConfigMaps(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete config map: %w",
			err,
		)
	}

	return nil
}
