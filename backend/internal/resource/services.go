package resource

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listServices(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.CoreV1().
		Services("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list services: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		ports := make([]string, 0)

		for _, port := range item.Spec.Ports {
			ports = append(
				ports,
				fmt.Sprintf("%d", port.Port),
			)
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert service %q to yaml: %w",
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
				Type:      ResourceServices,
				Status:    string(item.Spec.Type),
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"type":      string(item.Spec.Type),
					"clusterIP": item.Spec.ClusterIP,
					"ports":     ports,
					"selector":  item.Spec.Selector,
					"labels":    item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createService(
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

	serviceType := req.Type

	if serviceType == "" {
		serviceType = string(
			corev1.ServiceTypeClusterIP,
		)
	}

	if err := validateServiceType(
		serviceType,
	); err != nil {
		return Resource{}, err
	}

	if err := validatePort(req.Port); err != nil {
		return Resource{}, err
	}

	_, err := client.CoreV1().
		Services(namespace).
		Get(
			ctx,
			req.Name,
			metav1.GetOptions{},
		)

	if err == nil {
		return Resource{}, fmt.Errorf(
			"service %q already exists in namespace %q",
			req.Name,
			namespace,
		)
	}

	selector := map[string]string{
		"app": req.Name,
	}

	service := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
		Spec: corev1.ServiceSpec{
			Type:     corev1.ServiceType(serviceType),
			Selector: selector,
			Ports: []corev1.ServicePort{
				{
					Port: req.Port,
				},
			},
		},
	}

	created, err := client.CoreV1().
		Services(namespace).
		Create(
			ctx,
			service,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create service: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourceServices,
		Status:    string(created.Spec.Type),
		Fields: map[string]interface{}{
			"type":      string(created.Spec.Type),
			"clusterIP": created.Spec.ClusterIP,
			"ports": []string{
				fmt.Sprintf(
					"%d",
					req.Port,
				),
			},
			"selector": created.Spec.Selector,
			"labels":   created.Labels,
		},
	}, nil
}

func (s *Service) deleteService(
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

	service, err := client.CoreV1().
		Services(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get service: %w",
			err,
		)
	}

	if service.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"service %q is not managed by K8Lab",
			name,
		)
	}

	err = client.CoreV1().
		Services(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete service: %w",
			err,
		)
	}

	return nil
}
