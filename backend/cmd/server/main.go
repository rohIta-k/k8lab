package main

import (
	"log"
	"net/http"
	"time"
	"github.com/rohIta-k/k8lab/backend/internal/api"
)

func main() {
	router := api.NewRouter()

	server := &http.Server{
		Addr:              ":8080",
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println(
		"K8Lab backend running on http://localhost:8080",
	)

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}