package resource

import (
	"context"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (s *Service) listPVCs(
	ctx context.Context,
	client *kubernetes.Clientset,
) ([]Resource, error) {
	items, err := client.CoreV1().
		PersistentVolumeClaims("").
		List(ctx, metav1.ListOptions{})

	if err != nil {
		return nil, fmt.Errorf(
			"failed to list persistent volume claims: %w",
			err,
		)
	}

	result := make(
		[]Resource,
		0,
		len(items.Items),
	)

	for _, item := range items.Items {
		capacity := "-"

		if value, ok :=
			item.Status.Capacity[corev1.ResourceStorage]; ok {
			capacity = value.String()
		}

		yamlData, err := objectYAML(&item)
		if err != nil {
			return nil, fmt.Errorf(
				"failed to convert persistent volume claim %q to yaml: %w",
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
				Type:      ResourcePersistentVolumeClaims,
				Status:    string(item.Status.Phase),
				YAML:      yamlData,
				Fields: map[string]interface{}{
					"capacity": capacity,
					"labels":   item.Labels,
				},
			},
		)
	}

	return result, nil
}

func (s *Service) createPVC(
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

	storage := req.Storage

	if storage == "" {
		storage = "1Gi"
	}

	quantity, err := resourceQuantity(storage)
	if err != nil {
		return Resource{}, fmt.Errorf(
			"invalid storage size %q: %w",
			storage,
			err,
		)
	}

	pvc := &corev1.PersistentVolumeClaim{
		ObjectMeta: metav1.ObjectMeta{
			Name:      req.Name,
			Namespace: namespace,
			Labels: map[string]string{
				ManagedLabel: "true",
			},
		},
		Spec: corev1.PersistentVolumeClaimSpec{
			AccessModes: []corev1.PersistentVolumeAccessMode{
				corev1.ReadWriteOnce,
			},
			Resources: corev1.VolumeResourceRequirements{
				Requests: corev1.ResourceList{
					corev1.ResourceStorage: quantity,
				},
			},
		},
	}

	created, err := client.CoreV1().
		PersistentVolumeClaims(namespace).
		Create(
			ctx,
			pvc,
			metav1.CreateOptions{},
		)

	if err != nil {
		return Resource{}, fmt.Errorf(
			"failed to create persistent volume claim: %w",
			err,
		)
	}

	return Resource{
		ID:        created.Name,
		Name:      created.Name,
		Namespace: created.Namespace,
		Type:      ResourcePersistentVolumeClaims,
		Status:    string(created.Status.Phase),
		Fields: map[string]interface{}{
			"capacity": storage,
			"labels":   created.Labels,
		},
	}, nil
}

func (s *Service) deletePVC(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
	name string,
) error {
	if namespace == "" {
		namespace = "default"
	}

	pvc, err := client.CoreV1().
		PersistentVolumeClaims(namespace).
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to get persistent volume claim: %w",
			err,
		)
	}

	if pvc.Labels[ManagedLabel] != "true" {
		return fmt.Errorf(
			"persistent volume claim %q is not managed by K8Lab",
			name,
		)
	}

	err = client.CoreV1().
		PersistentVolumeClaims(namespace).
		Delete(
			ctx,
			name,
			metav1.DeleteOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete persistent volume claim: %w",
			err,
		)
	}

	return nil
}
