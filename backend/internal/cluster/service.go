package cluster
import (
	"context"
	"fmt"
	"strings"
)

type Service struct {
	providers []ProviderClient
}

func NewService() *Service {
	return &Service{
		providers: []ProviderClient{
			KindProvider{},
			MinikubeProvider{},
		},
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
		return Cluster{}, fmt.Errorf(
			"docker is not installed",
		)
	}

	if !IsDockerRunning(ctx) {
		return Cluster{}, fmt.Errorf(
			"docker is not running",
		)
	}

	provider, err := s.getProvider(
		ctx,
		req.Provider,
	)

	if err != nil {
		return Cluster{}, err
	}

	return provider.Create(ctx, name)
}

func (s *Service) Delete(
	ctx context.Context,
	id string,
) error {
	provider, name, err :=
		s.resolveCluster(ctx, id)

	if err != nil {
		return err
	}

	return provider.Delete(ctx, name)
}

func (s *Service) Connect(
	ctx context.Context,
	id string,
) (Cluster, error) {
	provider, name, err :=
		s.resolveCluster(ctx, id)

	if err != nil {
		return Cluster{}, err
	}

	clusters, err := provider.List(ctx)
	if err != nil {
		return Cluster{}, err
	}

	for _, cluster := range clusters {
		if cluster.Name != name {
			continue
		}

		stats, err := GetStats(
			ctx,
			provider.Context(name),
		)

		if err != nil {
			return Cluster{}, fmt.Errorf(
				"failed to get cluster stats: %w",
				err,
			)
		}

		cluster.Current = true
		cluster.Status = StatusConnected
		cluster.Stats = stats

		return cluster, nil
	}

	return Cluster{}, fmt.Errorf(
		"cluster %q not found",
		name,
	)
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
	if strings.TrimSpace(id) == "" {
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