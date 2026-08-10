package database

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

func NewMySQL(dsn string) (*sql.DB, error) {
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf(
			"failed to open mysql: %w",
			err,
		)
	}

	if err := db.Ping(); err != nil {
		db.Close()

		return nil, fmt.Errorf(
			"failed to connect to mysql: %w",
			err,
		)
	}

	return db, nil
}