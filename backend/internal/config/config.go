package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	Environment string
	Kubeconfig  string
	MySQLDSN    string
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Port: getEnv(
			"PORT",
			"8080",
		),
		Environment: getEnv(
			"APP_ENV",
			"development",
		),
		Kubeconfig: os.Getenv(
			"KUBECONFIG",
		),
		MySQLDSN: os.Getenv(
			"K8LAB_MYSQL_DSN",
		),
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
