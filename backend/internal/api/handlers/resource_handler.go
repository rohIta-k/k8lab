package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/rohIta-k/k8lab/backend/internal/resource"
)

type ResourceHandler struct {
	service *resource.Service
}

func NewResourceHandler(
	service *resource.Service,
) *ResourceHandler {
	return &ResourceHandler{
		service: service,
	}
}

func (h *ResourceHandler) GetResources(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	resourceType := r.PathValue("type")

	if clusterID == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)

		return
	}

	if resourceType == "" {
		Error(
			w,
			http.StatusBadRequest,
			"resource type is required",
		)

		return
	}

	result, err := h.service.List(
		r.Context(),
		clusterID,
		resource.ResourceType(resourceType),
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

func (h *ResourceHandler) CreateResource(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	resourceType := r.PathValue("type")

	if clusterID == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)

		return
	}

	if resourceType == "" {
		Error(
			w,
			http.StatusBadRequest,
			"resource type is required",
		)

		return
	}

	var req resource.CreateRequest

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

	result, err := h.service.Create(
		r.Context(),
		clusterID,
		resource.ResourceType(resourceType),
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

func (h *ResourceHandler) DeleteResource(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	resourceType := r.PathValue("type")
	name := r.PathValue("name")

	if clusterID == "" {
		Error(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	if resourceType == "" {
		Error(
			w,
			http.StatusBadRequest,
			"resource type is required",
		)
		return
	}

	if name == "" {
		Error(
			w,
			http.StatusBadRequest,
			"resource name is required",
		)
		return
	}

	namespace := r.URL.Query().Get("namespace")

	err := h.service.Delete(
		r.Context(),
		clusterID,
		resource.ResourceType(resourceType),
		namespace,
		name,
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
		map[string]string{
			"message": "resource deleted successfully",
		},
	)
}
