package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/rohIta-k/k8lab/backend/internal/experiment"
)

type ExperimentHandler struct {
	experimentService *experiment.Service
}

func NewExperimentHandler(
	experimentService *experiment.Service,
) *ExperimentHandler {
	return &ExperimentHandler{
		experimentService: experimentService,
	}
}

func (h *ExperimentHandler) Run(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	experimentID := r.PathValue("experimentId")

	if clusterID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	if experimentID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"experiment id is required",
		)
		return
	}

	run, err := h.experimentService.Run(
		r.Context(),
		clusterID,
		experimentID,
	)
	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err.Error(),
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		run,
	)
}

func (h *ExperimentHandler) GetActiveRun(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")

	if clusterID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	run, err :=
		h.experimentService.GetActiveRun(
			clusterID,
		)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err.Error(),
		)
		return
	}

	/*
	 * No active experiment.
	 */
	if run == nil {
		writeJSON(
			w,
			http.StatusOK,
			nil,
		)
		return
	}

	experimentData, err :=
		h.experimentService.Get(
			run.ExperimentID,
		)

	if err != nil {
		writeError(
			w,
			http.StatusNotFound,
			err.Error(),
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		experiment.RunResponse{
			Run:        *run,
			Experiment: experimentData,
		},
	)
}

func (h *ExperimentHandler) GetLogs(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	runID := r.PathValue("runId")

	if clusterID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	if runID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"run id is required",
		)
		return
	}

	logs, err :=
		h.experimentService.GetLogs(
			r.Context(),
			runID,
		)

	if err != nil {
		writeError(
			w,
			http.StatusNotFound,
			err.Error(),
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		logs,
	)
}

func (h *ExperimentHandler) Stop(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	runID := r.PathValue("runId")

	if clusterID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	if runID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"run id is required",
		)
		return
	}

	err := h.experimentService.Stop(
		r.Context(),
		runID,
	)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err.Error(),
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "experiment stopped successfully",
		},
	)
}

func (h *ExperimentHandler) Reset(
	w http.ResponseWriter,
	r *http.Request,
) {
	clusterID := r.PathValue("id")
	runID := r.PathValue("runId")

	if clusterID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"cluster id is required",
		)
		return
	}

	if runID == "" {
		writeError(
			w,
			http.StatusBadRequest,
			"run id is required",
		)
		return
	}

	err := h.experimentService.Reset(
		r.Context(),
		runID,
	)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err.Error(),
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "experiment reset successfully",
		},
	)
}

func writeJSON(
	w http.ResponseWriter,
	status int,
	data interface{},
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(data)
}

func writeError(
	w http.ResponseWriter,
	status int,
	message string,
) {
	writeJSON(
		w,
		status,
		map[string]string{
			"message": message,
		},
	)
}
