#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "🚀 Starting Frontend Build Process..."

# Install dependencies
npm install

# Generate Prisma client
echo "💎 Generating Prisma Client..."
npx prisma generate

# Run database migrations
# Note: DATABASE_URL must be provided in the environment
if [ -n "$DATABASE_URL" ]; then
  echo "🗄️  Running Database Migrations..."
  npx prisma migrate deploy
else
  echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

# Build the application
echo "🏗️  Building Next.js App..."
npm run build

echo "✅ Build Complete!"
