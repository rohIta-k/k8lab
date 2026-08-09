package cluster

import "context"

type ProviderClient interface {
	Name() Provider

	IsInstalled(ctx context.Context) bool

	List(ctx context.Context) ([]Cluster, error)

	Create(ctx context.Context, name string) (Cluster, error)

	Delete(ctx context.Context, name string) error

	Version(ctx context.Context) (string, error)

	Context(name string) string
}
