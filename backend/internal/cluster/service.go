package cluster

import (
	"context"
	"fmt"
	"strings"

	"github.com/rohIta-k/k8lab/backend/internal/activity"
)

type Service struct {
	providers       []ProviderClient
	activityService *activity.Service
}

func NewService(
	activityService *activity.Service,
) *Service {
	return &Service{
		providers: []ProviderClient{
			KindProvider{},
			MinikubeProvider{},
		},
		activityService: activityService,
	}
}

func (s *Service) List(
	ctx context.Context,
) ([]Cluster, error) {
	if !IsDockerInstalled() {
		return nil, fmt.Errorf(
			"docker is not installed",
		)
	}

	if !IsDockerRunning(ctx) {
		return nil, fmt.Errorf(
			"docker is not running",
		)
	}

	var result []Cluster

	for _, provider := range s.providers {
		if !provider.IsInstalled(ctx) {
			continue
		}

		clusters, err := provider.List(ctx)
		if err != nil {
			continue
		}

		result = append(result, clusters...)
	}

	if result == nil {
		result = []Cluster{}
	}

	return result, nil
}

func (s *Service) DetectProviders(
	ctx context.Context,
) ([]ProviderInfo, error) {
	return DetectProviders(ctx), nil
}

func (s *Service) Create(
	ctx context.Context,
	req CreateRequest,
) (Cluster, error) {
	name := strings.TrimSpace(req.Name)

	if name == "" {
		return Cluster{}, fmt.Errorf(
			"cluster name is required",
		)
	}

	if !IsDockerInstalled() {
		err := fmt.Errorf(
			"docker is not installed",
		)

		s.recordActivity(
			ctx,
			"",
			"Cluster",
			"Cluster creation failed",
			err.Error(),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	if !IsDockerRunning(ctx) {
		err := fmt.Errorf(
			"docker is not running",
		)

		s.recordActivity(
			ctx,
			"",
			"Cluster",
			"Cluster creation failed",
			err.Error(),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	provider, err := s.getProvider(
		ctx,
		req.Provider,
	)

	if err != nil {
		s.recordActivity(
			ctx,
			"",
			"Cluster",
			"Cluster creation failed",
			err.Error(),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	cluster, err := provider.Create(
		ctx,
		name,
	)

	if err != nil {
		s.recordActivity(
			ctx,
			"",
			"Cluster",
			"Cluster creation failed",
			fmt.Sprintf(
				"Failed to create cluster %s.",
				name,
			),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	s.recordActivity(
		ctx,
		cluster.ID,
		"Cluster",
		"Cluster created",
		fmt.Sprintf(
			"%s cluster created successfully.",
			cluster.Name,
		),
		activity.StatusSuccess,
	)

	return cluster, nil
}

func (s *Service) Delete(
	ctx context.Context,
	id string,
) error {
	provider, name, err :=
		s.resolveCluster(ctx, id)

	if err != nil {
		s.recordActivity(
			ctx,
			id,
			"Cluster",
			"Cluster deletion failed",
			err.Error(),
			activity.StatusError,
		)

		return err
	}

	err = provider.Delete(
		ctx,
		name,
	)

	if err != nil {
		s.recordActivity(
			ctx,
			id,
			"Cluster",
			"Cluster deletion failed",
			fmt.Sprintf(
				"Failed to delete cluster %s.",
				name,
			),
			activity.StatusError,
		)

		return err
	}

	s.recordActivity(
		ctx,
		id,
		"Cluster",
		"Cluster deleted",
		fmt.Sprintf(
			"%s deleted successfully.",
			name,
		),
		activity.StatusSuccess,
	)

	return nil
}

func (s *Service) Connect(
	ctx context.Context,
	id string,
) (Cluster, error) {
	provider, name, err :=
		s.resolveCluster(ctx, id)

	if err != nil {
		s.recordActivity(
			ctx,
			id,
			"Cluster",
			"Cluster connection failed",
			err.Error(),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	clusters, err := provider.List(ctx)
	if err != nil {
		s.recordActivity(
			ctx,
			id,
			"Cluster",
			"Cluster connection failed",
			fmt.Sprintf(
				"Failed to list cluster %s.",
				name,
			),
			activity.StatusError,
		)

		return Cluster{}, err
	}

	for _, cluster := range clusters {
		if cluster.Name != name {
			continue
		}

		contextName := provider.Context(name)

		stats, err := GetStats(
			ctx,
			contextName,
		)

		if err != nil {
			s.recordActivity(
				ctx,
				cluster.ID,
				"Cluster",
				"Cluster connection failed",
				"Failed to get cluster statistics.",
				activity.StatusError,
			)

			return Cluster{}, fmt.Errorf(
				"failed to get cluster stats: %w",
				err,
			)
		}

		health, err := GetHealth(
			ctx,
			contextName,
		)

		if err != nil {
			s.recordActivity(
				ctx,
				cluster.ID,
				"Cluster",
				"Cluster connection failed",
				"Failed to get cluster health.",
				activity.StatusError,
			)

			return Cluster{}, fmt.Errorf(
				"failed to get cluster health: %w",
				err,
			)
		}

		cluster.Current = true
		cluster.Status = StatusConnected
		cluster.Stats = stats
		cluster.Health = health

		s.recordActivity(
			ctx,
			cluster.ID,
			"Cluster",
			"Cluster connected",
			fmt.Sprintf(
				"Connected to %s.",
				cluster.Name,
			),
			activity.StatusSuccess,
		)

		return cluster, nil
	}

	err = fmt.Errorf(
		"cluster %q not found",
		name,
	)

	s.recordActivity(
		ctx,
		id,
		"Cluster",
		"Cluster connection failed",
		err.Error(),
		activity.StatusError,
	)

	return Cluster{}, err
}

func (s *Service) Dashboard(
	ctx context.Context,
	id string,
) (DashboardData, error) {
	provider, name, err :=
		s.resolveCluster(ctx, id)

	if err != nil {
		return DashboardData{}, err
	}

	clusters, err := provider.List(ctx)
	if err != nil {
		return DashboardData{}, fmt.Errorf(
			"failed to list clusters: %w",
			err,
		)
	}

	var current Cluster

	for _, c := range clusters {
		if c.ID == id {
			current = c
			break
		}
	}

	if current.ID == "" {
		return DashboardData{}, fmt.Errorf(
			"cluster %q not found",
			id,
		)
	}

	contextName := provider.Context(name)

	stats, err := GetStats(
		ctx,
		contextName,
	)
	if err != nil {
		return DashboardData{}, fmt.Errorf(
			"failed to get cluster stats: %w",
			err,
		)
	}

	health, err := GetHealth(
		ctx,
		contextName,
	)
	if err != nil {
		return DashboardData{}, fmt.Errorf(
			"failed to get cluster health: %w",
			err,
		)
	}

	recentActivity := []activity.Activity{}

	if s.activityService != nil {
		recentActivity, err =
			s.activityService.LatestForCluster(
				ctx,
				id,
				5,
			)

		if err != nil {
			return DashboardData{}, fmt.Errorf(
				"failed to get recent activity: %w",
				err,
			)
		}
	}

	current.Current = true
	current.Status = StatusConnected
	current.Stats = stats
	current.Health = health

	return DashboardData{
		Cluster:        current,
		Stats:          stats,
		Health:         health,
		RecentActivity: recentActivity,
	}, nil
}

func (s *Service) getProvider(
	ctx context.Context,
	requested Provider,
) (ProviderClient, error) {
	if requested != "" {
		for _, provider := range s.providers {
			if provider.Name() != requested {
				continue
			}

			if !provider.IsInstalled(ctx) {
				return nil, fmt.Errorf(
					"%s is not installed",
					requested,
				)
			}

			return provider, nil
		}

		return nil, fmt.Errorf(
			"unsupported provider: %s",
			requested,
		)
	}

	for _, provider := range s.providers {
		if provider.IsInstalled(ctx) {
			return provider, nil
		}
	}

	return nil, fmt.Errorf(
		"no supported cluster provider is installed",
	)
}

func (s *Service) resolveCluster(
	ctx context.Context,
	id string,
) (ProviderClient, string, error) {
	id = strings.TrimSpace(id)

	if id == "" {
		return nil, "", fmt.Errorf(
			"cluster id is required",
		)
	}

	for _, provider := range s.providers {
		if !provider.IsInstalled(ctx) {
			continue
		}

		clusters, err := provider.List(ctx)
		if err != nil {
			continue
		}

		for _, cluster := range clusters {
			if cluster.ID == id {
				return provider, cluster.Name, nil
			}
		}
	}

	return nil, "", fmt.Errorf(
		"cluster %q not found",
		id,
	)
}

func (s *Service) recordActivity(
	ctx context.Context,
	clusterID string,
	activityType string,
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
			Type:        activityType,
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
