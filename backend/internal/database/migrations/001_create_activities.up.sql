CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    cluster_id VARCHAR(255) NULL,

    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_activities_created_at (
        created_at
    ),

    INDEX idx_activities_cluster_created (
        cluster_id,
        created_at
    )
);