package activity

import (
	"context"
	"database/sql"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

func (r *Repository) Create(
	ctx context.Context,
	a Activity,
) (Activity, error) {
	result, err := r.db.ExecContext(
		ctx,
		`
		INSERT INTO activities (
			cluster_id,
			type,
			title,
			description,
			status
		)
		VALUES (?, ?, ?, ?, ?)
		`,
		a.ClusterID,
		a.Type,
		a.Title,
		a.Description,
		a.Status,
	)
	if err != nil {
		return Activity{}, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return Activity{}, err
	}

	a.ID = id

	return a, nil
}

func (r *Repository) Latest(
	ctx context.Context,
	limit int,
) ([]Activity, error) {
	rows, err := r.db.QueryContext(
		ctx,
		`
		SELECT
			id,
			cluster_id,
			type,
			title,
			description,
			status,
			created_at
		FROM activities
		ORDER BY created_at DESC
		LIMIT ?
		`,
		limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	activities := make([]Activity, 0)

	for rows.Next() {
		var a Activity

		var clusterID sql.NullString

		err := rows.Scan(
			&a.ID,
			&clusterID,
			&a.Type,
			&a.Title,
			&a.Description,
			&a.Status,
			&a.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		if clusterID.Valid {
			a.ClusterID = clusterID.String
		}

		activities = append(
			activities,
			a,
		)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}

func (r *Repository) LatestForCluster(
	ctx context.Context,
	clusterID string,
	limit int,
) ([]Activity, error) {
	rows, err := r.db.QueryContext(
		ctx,
		`
		SELECT
			id,
			cluster_id,
			type,
			title,
			description,
			status,
			created_at
		FROM activities
		WHERE cluster_id = ?
		ORDER BY created_at DESC
		LIMIT ?
		`,
		clusterID,
		limit,
	)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	activities := make([]Activity, 0)

	for rows.Next() {
		var a Activity
		var clusterID sql.NullString

		err := rows.Scan(
			&a.ID,
			&clusterID,
			&a.Type,
			&a.Title,
			&a.Description,
			&a.Status,
			&a.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		if clusterID.Valid {
			a.ClusterID = clusterID.String
		}

		activities = append(
			activities,
			a,
		)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}
