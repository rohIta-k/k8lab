package api

import (
	"net/http"

	"github.com/rohIta-k/k8lab/backend/internal/api/handlers"
	"github.com/rohIta-k/k8lab/backend/internal/cluster"
	"github.com/rohIta-k/k8lab/backend/internal/experiment"
	"github.com/rohIta-k/k8lab/backend/internal/resource"
	"github.com/rohIta-k/k8lab/backend/internal/topology"
)

func NewRouter(
	clusterService *cluster.Service,
	resourceService *resource.Service,
	topologyService *topology.Service,
	experimentService *experiment.Service,
) http.Handler {
	mux := http.NewServeMux()

	clusterHandler :=
		handlers.NewClusterHandler(clusterService)
	resourceHandler := handlers.NewResourceHandler(resourceService)
	topologyHandler := handlers.NewTopologyHandler(topologyService)
	experimentHandler := handlers.NewExperimentHandler(experimentService)

	mux.HandleFunc(
		"GET /api/clusters",
		clusterHandler.GetClusters,
	)

	mux.HandleFunc(
		"GET /api/clusters/providers",
		clusterHandler.GetProviders,
	)

	mux.HandleFunc(
		"POST /api/clusters",
		clusterHandler.CreateCluster,
	)

	mux.HandleFunc(
		"DELETE /api/clusters/{id}",
		clusterHandler.DeleteCluster,
	)

	mux.HandleFunc(
		"POST /api/clusters/{id}/connect",
		clusterHandler.ConnectCluster,
	)

	mux.HandleFunc(
		"GET /api/clusters/{id}/dashboard",
		clusterHandler.GetDashboard,
	)

	mux.HandleFunc(
		"GET /api/clusters/{id}/resources/{type}",
		resourceHandler.GetResources,
	)

	mux.HandleFunc(
		"POST /api/clusters/{id}/resources/{type}",
		resourceHandler.CreateResource,
	)

	mux.HandleFunc(
		"DELETE /api/clusters/{id}/resources/{type}/{name}",
		resourceHandler.DeleteResource,
	)

	mux.HandleFunc(
		"GET /api/clusters/{id}/topology",
		topologyHandler.GetTopology,
	)

	// Experiments

	mux.HandleFunc(
		"GET /api/clusters/{id}/experiments/runs/active",
		experimentHandler.GetActiveRun,
	)

	mux.HandleFunc(
		"POST /api/clusters/{id}/experiments/{experimentId}/run",
		experimentHandler.Run,
	)

	mux.HandleFunc(
		"GET /api/clusters/{id}/experiments/runs/{runId}/logs",
		experimentHandler.GetLogs,
	)

	mux.HandleFunc(
		"POST /api/clusters/{id}/experiments/runs/{runId}/stop",
		experimentHandler.Stop,
	)

	mux.HandleFunc(
		"DELETE /api/clusters/{id}/experiments/runs/{runId}",
		experimentHandler.Reset,
	)

	return mux
}
