package experiment

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/rohIta-k/k8lab/backend/internal/activity"
	"github.com/rohIta-k/k8lab/backend/internal/cluster"
)

type Runner interface {
	Run(
		ctx context.Context,
		clusterID string,
		experiment Experiment,
		runID string,
	) error

	Logs(
		ctx context.Context,
		clusterID string,
		experiment Experiment,
		runID string,
	) ([]ExperimentLog, Status, error)

	Stop(
		ctx context.Context,
		clusterID string,
		experiment Experiment,
		runID string,
	) error

	Reset(
		ctx context.Context,
		clusterID string,
		experiment Experiment,
		runID string,
	) error
}

type Service struct {
	clusterService  *cluster.Service
	activityService *activity.Service
	runner          Runner

	mu   sync.RWMutex
	runs map[string]ExperimentRun
}

func NewService(
	clusterService *cluster.Service,
	activityService *activity.Service,
	runner Runner,
) *Service {
	return &Service{
		clusterService:  clusterService,
		activityService: activityService,
		runner:          runner,
		runs:            make(map[string]ExperimentRun),
	}
}

func (s *Service) List() []Experiment {
	return GetExperiments()
}

func (s *Service) Get(
	id string,
) (Experiment, error) {
	experiment, ok := GetExperiment(id)

	if !ok {
		return Experiment{}, fmt.Errorf(
			"experiment %q not found",
			id,
		)
	}

	return experiment, nil
}

func (s *Service) Run(
	ctx context.Context,
	clusterID string,
	experimentID string,
) (RunResponse, error) {
	if s.clusterService == nil {
		return RunResponse{}, fmt.Errorf(
			"cluster service is required",
		)
	}

	if s.runner == nil {
		return RunResponse{}, fmt.Errorf(
			"experiment runner is required",
		)
	}

	experiment, ok :=
		GetExperiment(experimentID)

	if !ok {
		return RunResponse{}, fmt.Errorf(
			"experiment %q not found",
			experimentID,
		)
	}

	/*
	 * Make sure the cluster exists.
	 */
	_, _, err :=
		s.clusterService.Resolve(
			ctx,
			clusterID,
		)

	if err != nil {
		return RunResponse{}, err
	}

	runID := fmt.Sprintf(
		"%s-%d",
		experimentID,
		time.Now().UnixNano(),
	)

	run := ExperimentRun{
		ID:           runID,
		ExperimentID: experiment.ID,
		ClusterID:    clusterID,
		Namespace:    experiment.Namespace,
		Status:       StatusPending,
		StartedAt:    time.Now(),
	}

	s.recordActivity(
		ctx,
		clusterID,
		experiment.Name,
		"Experiment started",
		fmt.Sprintf(
			"Experiment %q started on cluster %s.",
			experiment.Name,
			clusterID,
		),
		activity.StatusInfo,
	)

	s.mu.Lock()
	s.runs[runID] = run
	s.mu.Unlock()

	/*
	 * Run asynchronously.
	 *
	 * The HTTP request should return immediately.
	 * Frontend will poll GetLogs().
	 */
	go func() {
		runErr :=
			s.runner.Run(
				context.Background(),
				clusterID,
				experiment,
				runID,
			)

		s.mu.Lock()
		defer s.mu.Unlock()

		current := s.runs[runID]

		if runErr != nil {
			current.Status = StatusFailed
			s.recordActivity(
				context.Background(),
				clusterID,
				experiment.Name,
				"Experiment failed",
				fmt.Sprintf(
					"Experiment %q failed to start: %s.",
					experiment.Name,
					runErr.Error(),
				),
				activity.StatusError,
			)
		} else {
			current.Status = StatusRunning
			s.recordActivity(
				context.Background(),
				clusterID,
				experiment.Name,
				"Experiment running",
				fmt.Sprintf(
					"Experiment %q is now running.",
					experiment.Name,
				),
				activity.StatusSuccess,
			)
		}

		s.runs[runID] = current
	}()

	return RunResponse{
		Run:        run,
		Experiment: experiment,
	}, nil
}

func (s *Service) GetLogs(
	ctx context.Context,
	runID string,
) (LogsResponse, error) {
	s.mu.RLock()

	run, ok := s.runs[runID]

	s.mu.RUnlock()

	if !ok {
		return LogsResponse{}, fmt.Errorf(
			"experiment run %q not found",
			runID,
		)
	}

	experiment, ok := GetExperiment(
		run.ExperimentID,
	)

	if !ok {
		return LogsResponse{}, fmt.Errorf(
			"experiment %q not found",
			run.ExperimentID,
		)
	}

	logs, status, err := s.runner.Logs(
		ctx,
		run.ClusterID,
		experiment,
		run.ID,
	)

	if err != nil {
		return LogsResponse{}, err
	}

	/*
	 * Keep our local run state synchronized
	 * with the Kubernetes state.
	 */
	s.mu.Lock()

	current, ok := s.runs[runID]

	if ok {
		current.Status = status

		if status == StatusCompleted ||
			status == StatusFailed ||
			status == StatusStopped {

			if current.FinishedAt.IsZero() {
				current.FinishedAt = time.Now()
			}
		}

		s.runs[runID] = current
	}

	s.mu.Unlock()

	return LogsResponse{
		RunID:  runID,
		Status: status,
		Logs:   logs,
	}, nil
}

func (s *Service) Stop(
	ctx context.Context,
	runID string,
) error {
	s.mu.RLock()

	run, ok := s.runs[runID]

	s.mu.RUnlock()

	if !ok {
		return fmt.Errorf(
			"experiment run %q not found",
			runID,
		)
	}

	experiment, ok := GetExperiment(
		run.ExperimentID,
	)

	if !ok {
		return fmt.Errorf(
			"experiment %q not found",
			run.ExperimentID,
		)
	}

	err := s.runner.Stop(
		ctx,
		run.ClusterID,
		experiment,
		run.ID,
	)

	if err != nil {
		s.recordActivity(
			ctx,
			run.ClusterID,
			experiment.Name,
			"Experiment stop failed",
			fmt.Sprintf(
				"Experiment %q stop failed: %s.",
				experiment.Name,
				err.Error(),
			),
			activity.StatusError,
		)
		return err
	}

	s.mu.Lock()

	current, ok := s.runs[runID]

	if ok {
		current.Status = StatusStopped
		current.FinishedAt = time.Now()
		s.runs[runID] = current
	}

	s.mu.Unlock()

	s.recordActivity(
		ctx,
		run.ClusterID,
		experiment.Name,
		"Experiment stopped",
		fmt.Sprintf(
			"Experiment %q was stopped successfully.",
			experiment.Name,
		),
		activity.StatusInfo,
	)

	return nil
}

func (s *Service) Reset(
	ctx context.Context,
	runID string,
) error {
	s.mu.RLock()

	run, ok := s.runs[runID]

	s.mu.RUnlock()

	if !ok {
		return fmt.Errorf(
			"experiment run %q not found",
			runID,
		)
	}

	experiment, ok := GetExperiment(
		run.ExperimentID,
	)

	if !ok {
		return fmt.Errorf(
			"experiment %q not found",
			run.ExperimentID,
		)
	}

	err := s.runner.Reset(
		ctx,
		run.ClusterID,
		experiment,
		run.ID,
	)

	if err != nil {
		s.recordActivity(
			ctx,
			run.ClusterID,
			experiment.Name,
			"Experiment reset failed",
			fmt.Sprintf(
				"Experiment %q reset failed: %s.",
				experiment.Name,
				err.Error(),
			),
			activity.StatusError,
		)
		return err
	}

	s.mu.Lock()
	delete(s.runs, runID)
	s.mu.Unlock()

	s.recordActivity(
		ctx,
		run.ClusterID,
		experiment.Name,
		"Experiment reset",
		fmt.Sprintf(
			"Experiment %q resources were reset successfully.",
			experiment.Name,
		),
		activity.StatusInfo,
	)

	return nil
}

func (s *Service) recordActivity(
	ctx context.Context,
	clusterID string,
	experimentName string,
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
			Type:        "Experiment",
			Title:       title,
			Description: description,
			Status:      status,
		},
	)

	if err != nil {
		fmt.Printf(
			"failed to record experiment activity for %s: %v\n",
			experimentName,
			err,
		)
	}
}

func (s *Service) GetActiveRun(
	clusterID string,
) (*ExperimentRun, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var activeRun *ExperimentRun

	for _, run := range s.runs {
		if run.ClusterID != clusterID {
			continue
		}

		if run.Status != StatusPending &&
			run.Status != StatusRunning {
			continue
		}

		/*
		 * There should normally be only one active
		 * experiment per cluster.
		 *
		 * If multiple runs somehow exist, return the
		 * most recently started one.
		 */
		if activeRun == nil ||
			run.StartedAt.After(activeRun.StartedAt) {

			runCopy := run
			activeRun = &runCopy
		}
	}

	if activeRun == nil {
		return nil, nil
	}

	return activeRun, nil
}
