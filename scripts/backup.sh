#!/usr/bin/env bash
# FairHire AI - Automated Postgres & Configuration Backup Script
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/opt/fairhire/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DATE="$(date +'%Y%m%d_%H%M%S')"
BACKUP_FILE="${BACKUP_DIR}/fairhire_db_${DATE}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date -u)] Starting Postgres backup to ${BACKUP_FILE}..."

# Execute pg_dump inside postgres container safely without passing password in shell args
if ! docker compose -f /opt/fairhire/docker-compose.prod.yml exec -T postgres pg_dump -U fairhire fairhire | gzip > "${BACKUP_FILE}"; then
  echo "Error: Database backup failed!" >&2
  rm -f "${BACKUP_FILE}"
  exit 1
fi

chmod 600 "${BACKUP_FILE}"
BACKUP_SIZE="$(du -h "${BACKUP_FILE}" | cut -f1)"
echo "[$(date -u)] Database backup completed successfully (Size: ${BACKUP_SIZE})."

# Prune old backups exceeding retention days
echo "[$(date -u)] Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "fairhire_db_*.sql.gz" -mtime +"${RETENTION_DAYS}" -exec rm -f {} +

echo "[$(date -u)] Backup and retention cycle completed."
