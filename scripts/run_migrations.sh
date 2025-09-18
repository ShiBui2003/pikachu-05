#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file"
  exit 1
fi

# Create a temporary migration file
echo "-- Generated migration script" > combined_migration.sql

# Add all SQL files in order
cat scripts/001_create_tables.sql >> combined_migration.sql
echo "" >> combined_migration.sql
cat scripts/002_create_policies.sql >> combined_migration.sql
echo "" >> combined_migration.sql
cat scripts/003_create_functions.sql >> combined_migration.sql
echo "" >> combined_migration.sql
cat scripts/005_fix_relationships.sql >> combined_migration.sql
echo "" >> combined_migration.sql
cat scripts/004_seed_data.sql >> combined_migration.sql

# Run the migration using psql
echo "Running database migrations..."
psql "$SUPABASE_DB_URL" -f combined_migration.sql

# Clean up
rm combined_migration.sql

echo "Database migrations completed successfully!"
