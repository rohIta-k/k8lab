package resource

import (
	"context"
	"fmt"

	networkingv1 "k8s.io/api/networking/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listIngresses(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.NetworkingV1().
		Ingresses("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list ingresses: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		hosts := make([]string, 0)

		for _, rule := range item.Spec.Rules {
			if rule.Host != "" {
				hosts = append(hosts, rule.Host)
			}
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert ingress %q to yaml: %w",
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
				Type:      ResourceIngresses,
				Status:    "Active",
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"hosts":  hosts,
					"labels": item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createIngress(
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

	ingress := &networkingv1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
		Spec: networkingv1.IngressSpec{},
	}

	created, err := client.NetworkingV1().
		Ingresses(namespace).
		Create(
			ctx,
			ingress,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create ingress: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceIngresses,
		Status:    "Active",
		Fields: map[string]interface{}{
			"hosts":  []string{},
			"labels": created.Labels,
		},
	}, nil
}

func (s *Service) deleteIngress(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
	name string,
) error {
	if namespace == "" {
		namespace = "default"
	}

	ingress, err := client.NetworkingV1().
		Ingresses(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get ingress: %w",
			err,
		)
	}

	if ingress.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"ingress %q is not managed by K8Lab",
			name,
		)
	}

	err = client.NetworkingV1().
		Ingresses(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete ingress: %w",
			err,
		)
	}

	return nil
}
