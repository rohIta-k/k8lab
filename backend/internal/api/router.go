package api

import (
	"net/http"
	"github.com/rohIta-k/k8lab/backend/internal/api/handlers"
	"github.com/rohIta-k/k8lab/backend/internal/cluster"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()
	clusterService := cluster.NewService()
	clusterHandler :=handlers.NewClusterHandler(clusterService)
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

	return mux
}