package main

import (
	"log"
	"net/http"
	"time"

	"github.com/rohIta-k/k8lab/backend/internal/activity"
	"github.com/rohIta-k/k8lab/backend/internal/api"
	"github.com/rohIta-k/k8lab/backend/internal/cluster"
	"github.com/rohIta-k/k8lab/backend/internal/config"
	"github.com/rohIta-k/k8lab/backend/internal/database"
	"github.com/rohIta-k/k8lab/backend/internal/resource"
)

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set(
				"Access-Control-Allow-Origin",
				"http://localhost:5173",
			)

			w.Header().Set(
				"Access-Control-Allow-Methods",
				"GET, POST, DELETE, OPTIONS",
			)

			w.Header().Set(
				"Access-Control-Allow-Headers",
				"Content-Type",
			)

			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		},
	)
}

func main() {
	cfg := config.Load()

	if cfg.MySQLDSN == "" {
		log.Fatal(
			"K8LAB_MYSQL_DSN is not set",
		)
	}

	db, err := database.NewMySQL(
		cfg.MySQLDSN,
	)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	activityRepository :=
		activity.NewRepository(db)

	activityService :=
		activity.NewService(
			activityRepository,
		)

	clusterService :=
		cluster.NewService(
			activityService,
		)
	resourceService := resource.NewService(
		clusterService,
		activityService,
	)
	router := api.NewRouter(clusterService, resourceService)
	handler := cors(router)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println(
		"K8Lab backend running on http://localhost:8080",
	)

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
