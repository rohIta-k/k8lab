package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/rohIta-k/k8lab/backend/internal/cluster"
)

type ClusterHandler struct {
	service *cluster.Service
}

func NewClusterHandler(
	service *cluster.Service,
) *ClusterHandler {
	return &ClusterHandler{
		service: service,
	}
}

func (h *ClusterHandler) GetClusters(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusters, err := h.service.List(
		r.Context(),
	)

	if err != nil {
		Error(
			w,
			http.StatusServiceUnavailable,
			err.Error(),
		)

		return
	}

	JSON(
		w,
		http.StatusOK,
		clusters,
	)
}

func (h *ClusterHandler) GetProviders(
	w http.ResponseWriter,
	r *http.Request,
) {
	providers, err := h.service.DetectProviders(
		r.Context(),
	)

	if err != nil {
		Error(
			w,
			http.StatusServiceUnavailable,
			err.Error(),
		)

		return
	}

	JSON(
		w,
		http.StatusOK,
		providers,
	)
}

func (h *ClusterHandler) CreateCluster(
	w http.ResponseWriter,
	r *http.Request,
) {
	var req cluster.CreateRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&req); err != nil {
		Error(
			w,
			http.StatusBadRequest,
			"invalid request body",
		)

		return
	}

	if req.Name == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster name is required",
		)

		return
	}

	result, err := h.service.Create(
		r.Context(),
		req,
	)

	if err != nil {
		Error(
			w,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	JSON(
		w,
		http.StatusCreated,
		result,
	)
}

func (h *ClusterHandler) DeleteCluster(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := r.PathValue("id")

	if id == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)

		return
	}

	if err := h.service.Delete(
		r.Context(),
		id,
	); err != nil {
		Error(
			w,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	JSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "cluster deleted successfully",
		},
	)
}

func (h *ClusterHandler) ConnectCluster(
	w http.ResponseWriter,
	r *http.Request,
) {
	id := r.PathValue("id")

	if id == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)

		return
	}

	result, err := h.service.Connect(
		r.Context(),
		id,
	)

	if err != nil {
		Error(
			w,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	JSON(
		w,
		http.StatusOK,
		result,
	)
}
