package experiment

import (
	"context"
	"fmt"

	"github.com/rohIta-k/k8lab/backend/internal/cluster"
	k8sclient "github.com/rohIta-k/k8lab/backend/internal/kubernetes"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"

	autoscalingv1 "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
)

type KubernetesRunner struct {
	clusterService *cluster.Service
}

func NewRunner(
	clusterService *cluster.Service,
) *KubernetesRunner {
	return &KubernetesRunner{
		clusterService: clusterService,
	}
}

const (
	experimentLabel = "k8lab.io/experiment"
	runLabel        = "k8lab.io/run"
)

func (r *KubernetesRunner) Run(
	ctx context.Context,
	clusterID string,
	experiment Experiment,
	runID string,
) error {
	client, err := k8sclient.NewClient(
		ctx,
		clusterID,
		r.clusterService,
	)

	if err != nil {
		return fmt.Errorf(
			"failed to create kubernetes client: %w",
			err,
		)
	}

	switch experiment.ID {
	case "crashloopbackoff":
		return r.runCrashLoopBackOff(
			ctx,
			client,
			experiment,
			runID,
		)

	case "imagepullbackoff":
		return r.runImagePullBackOff(
			ctx,
			client,
			experiment,
			runID,
		)

	case "oomkilled":
		return r.runOOMKilled(
			ctx,
			client,
			experiment,
			runID,
		)

	case "pendingpod":
		return r.runPendingPod(
			ctx,
			client,
			experiment,
			runID,
		)

	case "livenessprobe":
		return r.runLivenessProbe(
			ctx,
			client,
			experiment,
			runID,
		)

	default:
		return fmt.Errorf(
			"unsupported experiment: %s",
			experiment.ID,
		)
	}
}

func (r *KubernetesRunner) runCrashLoopBackOff(
	ctx context.Context,
	client *kubernetes.Clientset,
	experiment Experiment,
	runID string,
) error {
	name := "crash-demo-" + shortRunID(runID)

	labels := experimentLabels(
		experiment.ID,
		runID,
	)

	replicas := int32(1)

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: experiment.Namespace,
			Labels:    labels,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,

			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},

			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},

				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "crash-demo",
							Image: "busybox",

							Command: []string{
								"sh",
								"-c",
								"exit 1",
							},
						},
					},
				},
			},
		},
	}

	_, err := client.AppsV1().
		Deployments(experiment.Namespace).
		Create(
			ctx,
			deployment,
			metav1.CreateOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to create CrashLoopBackOff deployment: %w",
			err,
		)
	}

	return nil
}

func (r *KubernetesRunner) runImagePullBackOff(
	ctx context.Context,
	client *kubernetes.Clientset,
	experiment Experiment,
	runID string,
) error {
	name := "image-demo-" + shortRunID(runID)

	labels := experimentLabels(
		experiment.ID,
		runID,
	)

	replicas := int32(1)

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: experiment.Namespace,
			Labels:    labels,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,

			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},

			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},

				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "image-demo",
							Image: "nginx:notfound",
						},
					},
				},
			},
		},
	}

	_, err := client.AppsV1().
		Deployments(experiment.Namespace).
		Create(
			ctx,
			deployment,
			metav1.CreateOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to create ImagePullBackOff deployment: %w",
			err,
		)
	}

	return nil
}

func (r *KubernetesRunner) runOOMKilled(
	ctx context.Context,
	client *kubernetes.Clientset,
	experiment Experiment,
	runID string,
) error {
	name := "oom-demo-" + shortRunID(runID)

	labels := experimentLabels(
		experiment.ID,
		runID,
	)

	replicas := int32(1)

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: experiment.Namespace,
			Labels:    labels,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,

			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},

			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},

				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "oom-demo",
							Image: "polinux/stress",

							Command: []string{
								"stress",
								"--vm",
								"1",
								"--vm-bytes",
								"128M",
								"--vm-hang",
								"0",
								"--timeout",
								"20s",
							},

							Resources: corev1.ResourceRequirements{
								Limits: corev1.ResourceList{
									"memory": resourceQuantity("64Mi"),
								},
							},
						},
					},
				},
			},
		},
	}

	_, err := client.AppsV1().
		Deployments(experiment.Namespace).
		Create(
			ctx,
			deployment,
			metav1.CreateOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to create OOMKilled deployment: %w",
			err,
		)
	}

	return nil
}

func (r *KubernetesRunner) runPendingPod(
	ctx context.Context,
	client *kubernetes.Clientset,
	experiment Experiment,
	runID string,
) error {
	name := "pending-demo-" + shortRunID(runID)

	labels := experimentLabels(
		experiment.ID,
		runID,
	)

	pod := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: experiment.Namespace,
			Labels:    labels,
		},

		Spec: corev1.PodSpec{
			Containers: []corev1.Container{
				{
					Name:  "pending-demo",
					Image: "nginx",

					Resources: corev1.ResourceRequirements{
						Requests: corev1.ResourceList{
							"cpu":    resourceQuantity("32"),
							"memory": resourceQuantity("64Gi"),
						},

						Limits: corev1.ResourceList{
							"cpu":    resourceQuantity("32"),
							"memory": resourceQuantity("64Gi"),
						},
					},
				},
			},
		},
	}

	_, err := client.CoreV1().
		Pods(experiment.Namespace).
		Create(
			ctx,
			pod,
			metav1.CreateOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to create pending pod: %w",
			err,
		)
	}

	return nil
}

func (r *KubernetesRunner) runLivenessProbe(
	ctx context.Context,
	client *kubernetes.Clientset,
	experiment Experiment,
	runID string,
) error {
	name := "liveness-demo-" + shortRunID(runID)

	labels := experimentLabels(
		experiment.ID,
		runID,
	)

	replicas := int32(1)

	deployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: experiment.Namespace,
			Labels:    labels,
		},

		Spec: appsv1.DeploymentSpec{
			Replicas: &replicas,

			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},

			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},

				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "liveness-demo",
							Image: "nginx",

							LivenessProbe: &corev1.Probe{
								ProbeHandler: corev1.ProbeHandler{
									HTTPGet: &corev1.HTTPGetAction{
										Path: "/does-not-exist",
										Port: intstr.FromInt(80),
									},
								},

								InitialDelaySeconds: 5,
								PeriodSeconds:       5,
								FailureThreshold:    1,
							},
						},
					},
				},
			},
		},
	}

	_, err := client.AppsV1().
		Deployments(experiment.Namespace).
		Create(
			ctx,
			deployment,
			metav1.CreateOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to create liveness probe deployment: %w",
			err,
		)
	}

	return nil
}

func (r *KubernetesRunner) Stop(
	ctx context.Context,
	clusterID string,
	experiment Experiment,
	runID string,
) error {
	client, err := k8sclient.NewClient(
		ctx,
		clusterID,
		r.clusterService,
	)

	if err != nil {
		return err
	}

	selector := labels.SelectorFromSet(
		labels.Set{
			experimentLabel: experiment.ID,
			runLabel:        runID,
		},
	).String()

	deployments, err := client.AppsV1().
		Deployments(experiment.Namespace).
		List(
			ctx,
			metav1.ListOptions{
				LabelSelector: selector,
			},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to list experiment deployments: %w",
			err,
		)
	}

	for _, deployment := range deployments.Items {
		replicas := int32(0)

		_, err := client.AppsV1().
			Deployments(experiment.Namespace).
			UpdateScale(
				ctx,
				deployment.Name,
				&autoscalingv1.Scale{
					ObjectMeta: metav1.ObjectMeta{
						Name:      deployment.Name,
						Namespace: deployment.Namespace,
					},
					Spec: autoscalingv1.ScaleSpec{
						Replicas: replicas,
					},
				},
				metav1.UpdateOptions{},
			)

		if err != nil {
			return fmt.Errorf(
				"failed to stop deployment %s: %w",
				deployment.Name,
				err,
			)
		}
	}

	return nil
}

func (r *KubernetesRunner) Reset(
	ctx context.Context,
	clusterID string,
	experiment Experiment,
	runID string,
) error {
	client, err := k8sclient.NewClient(
		ctx,
		clusterID,
		r.clusterService,
	)

	if err != nil {
		return err
	}

	selector := labels.SelectorFromSet(
		labels.Set{
			experimentLabel: experiment.ID,
			runLabel:        runID,
		},
	).String()

	deleteOptions := metav1.DeleteOptions{}

	/*
	 * Deployments
	 */
	err = client.AppsV1().
		Deployments(experiment.Namespace).
		DeleteCollection(
			ctx,
			deleteOptions,
			metav1.ListOptions{
				LabelSelector: selector,
			},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete experiment deployments: %w",
			err,
		)
	}

	/*
	 * Pods
	 */
	err = client.CoreV1().
		Pods(experiment.Namespace).
		DeleteCollection(
			ctx,
			deleteOptions,
			metav1.ListOptions{
				LabelSelector: selector,
			},
		)

	if err != nil {
		return fmt.Errorf(
			"failed to delete experiment pods: %w",
			err,
		)
	}

	return nil
}
