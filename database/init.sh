#!/bin/bash
# Database initialization script for Bio Green Wax
# Automatically runs schema.sql and seed.sql on first startup

set -e

if [ -z "$DATABASE_URL" ]; then
    echo "[DB Init] No DATABASE_URL found, skipping database initialization"
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

TABLE_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');" 2>/dev/null || echo "false")
TABLE_EXISTS=$(echo "$TABLE_EXISTS" | tr -d ' ')

if [ "$TABLE_EXISTS" = "t" ]; then
    USER_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    USER_COUNT=$(echo "$USER_COUNT" | tr -d ' ')

    if [ "$USER_COUNT" != "0" ] && [ "$USER_COUNT" != "" ]; then
        echo "[DB Init] Database already initialized ($USER_COUNT users found), skipping"
        exit 0
    fi
fi

echo "[DB Init] Initializing database..."

echo "[DB Init] Running schema_pg.sql..."
psql "$DATABASE_URL" -f "$SCRIPT_DIR/schema_pg.sql" 2>&1

echo "[DB Init] Running seed_pg.sql..."
psql "$DATABASE_URL" -f "$SCRIPT_DIR/seed_pg.sql" 2>&1

FINAL_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
FINAL_COUNT=$(echo "$FINAL_COUNT" | tr -d ' ')

if [ "$FINAL_COUNT" = "0" ] || [ "$FINAL_COUNT" = "" ]; then
    echo "[DB Init] WARNING: Seed may have failed - no users found after initialization"
    exit 1
fi

echo "[DB Init] Database initialization complete! ($FINAL_COUNT users seeded)"
