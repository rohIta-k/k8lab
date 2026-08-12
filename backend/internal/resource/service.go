package resource

import (
	"context"
	"fmt"

	"github.com/rohIta-k/k8lab/backend/internal/activity"
	"github.com/rohIta-k/k8lab/backend/internal/cluster"
)

type Service struct {
	clusterService  *cluster.Service
	activityService *activity.Service
}

func NewService(
	clusterService *cluster.Service,
	activityService *activity.Service,
) *Service {
	return &Service{
		clusterService:  clusterService,
		activityService: activityService,
	}
}

func (s *Service) List(
	ctx context.Context,
	clusterID string,
	resourceType ResourceType,
) ([]Resource, error) {
	client, err := newClient(
		ctx,
		clusterID,
		s.clusterService,
	)
	if err != nil {
		return nil, err
	}

	switch resourceType {
	case ResourceNamespaces:
		return s.listNamespaces(ctx, client)

	case ResourceDeployments:
		return s.listDeployments(ctx, client)

	case ResourceReplicaSets:
		return s.listReplicaSets(ctx, client)

	case ResourcePods:
		return s.listPods(ctx, client)

	case ResourceServices:
		return s.listServices(ctx, client)

	case ResourceConfigMaps:
		return s.listConfigMaps(ctx, client)

	case ResourceIngresses:
		return s.listIngresses(ctx, client)

	case ResourcePersistentVolumeClaims:
		return s.listPVCs(ctx, client)

	case ResourceJobs:
		return s.listJobs(ctx, client)

	case ResourceCronJobs:
		return s.listCronJobs(ctx, client)

	default:
		return nil, fmt.Errorf(
			"unsupported resource type: %s",
			resourceType,
		)
	}
}

func (s *Service) Create(
	ctx context.Context,
	clusterID string,
	resourceType ResourceType,
	req CreateRequest,
) (Resource, error) {
	if req.Name == "" {
		return Resource{}, fmt.Errorf(
			"resource name is required",
		)
	}

	client, err := newClient(
		ctx,
		clusterID,
		s.clusterService,
	)
	if err != nil {
		s.recordActivity(
			ctx,
			clusterID,
			resourceType,
			"Resource creation failed",
			err.Error(),
			activity.StatusError,
		)

		return Resource{}, err
	}

	var result Resource

	switch resourceType {
	case ResourceNamespaces:
		result, err = s.createNamespace(
			ctx,
			client,
			req,
		)

	case ResourceDeployments:
		result, err = s.createDeployment(
			ctx,
			client,
			req,
		)

	case ResourceReplicaSets:
		result, err = s.createReplicaSet(
			ctx,
			client,
			req,
		)

	case ResourcePods:
		result, err = s.createPod(
			ctx,
			client,
			req,
		)

	case ResourceServices:
		result, err = s.createService(
			ctx,
			client,
			req,
		)

	case ResourceConfigMaps:
		result, err = s.createConfigMap(
			ctx,
			client,
			req,
		)

	case ResourceIngresses:
		result, err = s.createIngress(
			ctx,
			client,
			req,
		)

	case ResourcePersistentVolumeClaims:
		result, err = s.createPVC(
			ctx,
			client,
			req,
		)

	case ResourceJobs:
		result, err = s.createJob(
			ctx,
			client,
			req,
		)

	case ResourceCronJobs:
		result, err = s.createCronJob(
			ctx,
			client,
			req,
		)

	default:
		err = fmt.Errorf(
			"unsupported resource type: %s",
			resourceType,
		)
	}

	if err != nil {
		s.recordActivity(
			ctx,
			clusterID,
			resourceType,
			"Resource creation failed",
			fmt.Sprintf(
				"Failed to create %s %q: %v",
				resourceType,
				req.Name,
				err,
			),
			activity.StatusError,
		)

		return Resource{}, err
	}

	s.recordActivity(
		ctx,
		clusterID,
		resourceType,
		"Resource created",
		fmt.Sprintf(
			"%s %q created successfully.",
			resourceType,
			req.Name,
		),
		activity.StatusSuccess,
	)

	return result, nil
}

func (s *Service) Delete(
	ctx context.Context,
	clusterID string,
	resourceType ResourceType,
	namespace string,
	name string,
) error {
	if name == "" {
		return fmt.Errorf(
			"resource name is required",
		)
	}

	client, err := newClient(
		ctx,
		clusterID,
		s.clusterService,
	)
	if err != nil {
		s.recordActivity(
			ctx,
			clusterID,
			resourceType,
			"Resource deletion failed",
			err.Error(),
			activity.StatusError,
		)

		return err
	}

	switch resourceType {
	case ResourceNamespaces:
		err = s.deleteNamespace(
			ctx,
			client,
			name,
		)

	case ResourceDeployments:
		err = s.deleteDeployment(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceReplicaSets:
		err = s.deleteReplicaSet(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourcePods:
		err = s.deletePod(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceServices:
		err = s.deleteService(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceConfigMaps:
		err = s.deleteConfigMap(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceIngresses:
		err = s.deleteIngress(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourcePersistentVolumeClaims:
		err = s.deletePVC(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceJobs:
		err = s.deleteJob(
			ctx,
			client,
			namespace,
			name,
		)

	case ResourceCronJobs:
		err = s.deleteCronJob(
			ctx,
			client,
			namespace,
			name,
		)

	default:
		err = fmt.Errorf(
			"unsupported resource type: %s",
			resourceType,
		)
	}

	if err != nil {
		s.recordActivity(
			ctx,
			clusterID,
			resourceType,
			"Resource deletion failed",
			fmt.Sprintf(
				"Failed to delete %s %q: %v",
				resourceType,
				name,
				err,
			),
			activity.StatusError,
		)

		return err
	}

	s.recordActivity(
		ctx,
		clusterID,
		resourceType,
		"Resource deleted",
		fmt.Sprintf(
			"%s %q deleted successfully.",
			resourceType,
			name,
		),
		activity.StatusSuccess,
	)

	return nil
}

func (s *Service) recordActivity(
	ctx context.Context,
	clusterID string,
	resourceType ResourceType,
	title string,
	description string,
	status activity.Status,
) {
	if s.activityService == nil {
		return
	}

	err := s.activityService.Record(
		ctx,
		activity.Activity{
			ClusterID:   clusterID,
			Type:        string(resourceType),
			Title:       title,
			Description: description,
			Status:      status,
		},
	)

	if err != nil {
		fmt.Printf(
			"failed to record activity: %v\n",
			err,
		)
	}
}
