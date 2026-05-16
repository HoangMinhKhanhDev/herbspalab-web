#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# HerbSpaLab DB backup — chạy qua cron trên Hostinger
# Setup: crontab -e
#   0 2 * * * /home/$USER/scripts/backup-db.sh >> /home/$USER/scripts/backup.log 2>&1
# ----------------------------------------------------------------------------
set -euo pipefail

DB_PATH="${DB_PATH:-$HOME/private/herbspalab.db}"
BACKUP_DIR="${BACKUP_DIR:-$HOME/private/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/herbspalab-$TIMESTAMP.db"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

if [[ ! -f "$DB_PATH" ]]; then
  echo "[$(date)] ❌ DB not found: $DB_PATH"
  exit 1
fi

# SQLite hot backup using its own backup API (safe even if DB is being written to)
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"
chmod 600 "$BACKUP_FILE"

# Optional: gzip to save space
gzip "$BACKUP_FILE"

echo "[$(date)] ✅ Backup created: $BACKUP_FILE.gz ($(stat -c%s "$BACKUP_FILE.gz") bytes)"

# Cleanup old backups
DELETED=$(find "$BACKUP_DIR" -name "herbspalab-*.db.gz" -mtime +"$RETENTION_DAYS" -delete -print | wc -l)
if [[ "$DELETED" -gt 0 ]]; then
  echo "[$(date)] 🗑️  Pruned $DELETED backup(s) older than $RETENTION_DAYS days"
fi
