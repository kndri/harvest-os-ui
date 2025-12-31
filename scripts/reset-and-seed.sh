#!/bin/bash
# Reset Database and Seed Demo Data
# This script resets the Supabase database and applies all migrations including demo data

set -e

echo "🔄 Resetting Supabase database..."
supabase db reset

echo ""
echo "✅ Database reset complete. Demo data seeded."
echo ""
echo "📝 Next steps:"
echo "   1. Create test users in Supabase Dashboard → Authentication → Users"
echo "   2. Run scripts/create-test-users.sql in Supabase SQL Editor to assign roles"
echo "   3. Start dev server: npm run dev"
echo ""
