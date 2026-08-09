package config

import (
	"os"
)

type Config struct {
	Port        string
	Environment string
	Kubeconfig  string
}

func Load() Config {
	return Config{
		Port: getEnv(
			"PORT",
			"8080",
		),
		Environment: getEnv(
			"APP_ENV",
			"development",
		),
		Kubeconfig: os.Getenv("KUBECONFIG"),
	}
}

func getEnv(
	key string,
	fallback string,
) string {
	value := os.Getenv(key)

	if value == "" {
		return fallback
	}

	return value
}
