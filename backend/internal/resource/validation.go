package resource

import (
	"context"
	"fmt"
	"strings"

	"github.com/robfig/cron/v3"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/validation"
	"k8s.io/client-go/kubernetes"
)

func validateName(name string) error {
	name = strings.TrimSpace(name)

	if name == "" {
		return fmt.Errorf(
			"resource name is required",
		)
	}

	errors := validation.IsDNS1123Subdomain(name)

	if len(errors) > 0 {
		return fmt.Errorf(
			"invalid resource name %q: %s",
			name,
			errors[0],
		)
	}

	return nil
}

func validateNamespaceName(
	namespace string,
) error {
	namespace = strings.TrimSpace(namespace)

	if namespace == "" {
		return fmt.Errorf(
			"namespace is required",
		)
	}

	errors := validation.IsDNS1123Label(
		namespace,
	)

	if len(errors) > 0 {
		return fmt.Errorf(
			"invalid namespace %q: %s",
			namespace,
			errors[0],
		)
	}

	return nil
}

func validateNamespaceExists(
	ctx context.Context,
	client *kubernetes.Clientset,
	namespace string,
) error {
	if err := validateNamespaceName(namespace); err != nil {
		return err
	}

	_, err := client.CoreV1().
		Namespaces().
		Get(
			ctx,
			namespace,
			metav1.GetOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"namespace %q does not exist",
			namespace,
		)
	}

	return nil
}

func validateImage(
	image string,
) error {
	image = strings.TrimSpace(image)

	if image == "" {
		return fmt.Errorf(
			"container image is required",
		)
	}

	return nil
}

func validateReplicas(
	replicas int32,
) error {
	if replicas <= 0 {
		return fmt.Errorf(
			"replicas must be greater than 0",
		)
	}

	return nil
}

func validateServiceType(
	serviceType string,
) error {
	switch corev1.ServiceType(serviceType) {
	case corev1.ServiceTypeClusterIP,
		corev1.ServiceTypeNodePort,
		corev1.ServiceTypeLoadBalancer,
		corev1.ServiceTypeExternalName:

		return nil

	default:
		return fmt.Errorf(
			"invalid service type %q",
			serviceType,
		)
	}
}

func validatePort(
	port int32,
) error {
	if port < 1 || port > 65535 {
		return fmt.Errorf(
			"port must be between 1 and 65535",
		)
	}

	return nil
}

func validateStorage(
	storage string,
) error {
	storage = strings.TrimSpace(storage)

	if storage == "" {
		return fmt.Errorf(
			"storage size is required",
		)
	}

	quantity, err :=
		resource.ParseQuantity(storage)

	if err != nil {
		return fmt.Errorf(
			"invalid storage size %q",
			storage,
		)
	}

	if quantity.Sign() <= 0 {
		return fmt.Errorf(
			"storage size must be greater than 0",
		)
	}

	return nil
}

func validateSchedule(
	schedule string,
) error {
	schedule = strings.TrimSpace(schedule)

	if schedule == "" {
		return fmt.Errorf(
			"cron schedule is required",
		)
	}

	_, err := cron.ParseStandard(
		schedule,
	)

	if err != nil {
		return fmt.Errorf(
			"invalid cron schedule %q",
			schedule,
		)
	}

	return nil
}

func validateNamespaceCreate(
	ctx context.Context,
	client *kubernetes.Clientset,
	name string,
) error {
	if err := validateName(name); err != nil {
		return err
	}

	_, err := client.CoreV1().
		Namespaces().
		Get(
			ctx,
			name,
			metav1.GetOptions{},
		)

	if err == nil {
		return fmt.Errorf(
			"namespace %q already exists",
			name,
		)
	}

	return nil
}
