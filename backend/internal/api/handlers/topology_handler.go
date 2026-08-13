package handlers

import (
	"net/http"

	"github.com/rohIta-k/k8lab/backend/internal/topology"
)

type TopologyHandler struct {
	service *topology.Service
}

func NewTopologyHandler(
	service *topology.Service,
) *TopologyHandler {
	return &TopologyHandler{
		service: service,
	}
}

func (h *TopologyHandler) GetTopology(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")

	if clusterID == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	result, err := h.service.Get(
		r.Context(),
		clusterID,
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
