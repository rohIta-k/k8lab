package activity

import "context"

type Service struct {
	repository *Repository
}

func NewService(
	repository *Repository,
) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) Record(
	ctx context.Context,
	a Activity,
) error {
	_, err := s.repository.Create(
		ctx,
		a,
	)

	return err
}

func (s *Service) Latest(
	ctx context.Context,
	limit int,
) ([]Activity, error) {
	return s.repository.Latest(
		ctx,
		limit,
	)
}

func (s *Service) LatestForCluster(
	ctx context.Context,
	clusterID string,
	limit int,
) ([]Activity, error) {
	return s.repository.LatestForCluster(
		ctx,
		clusterID,
		limit,
	)
}