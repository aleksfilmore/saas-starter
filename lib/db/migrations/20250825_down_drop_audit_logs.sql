-- Down migration: drop audit_logs (only for rollback)
DROP TABLE IF EXISTS audit_logs;
