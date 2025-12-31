const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testAdminQuery() {
  console.log('🔍 Testing admin programs query...\n');

  const adminUserId = '653692a8-4d5a-4074-802f-2adabf333773';
  const orgId = '11111111-1111-1111-1111-111111111111';

  // Step 1: Get user's org_id (simulating what the page does)
  console.log('1. Getting user membership...');
  const { data: membership, error: membershipError } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('user_id', adminUserId)
    .single();

  if (membershipError) {
    console.error('❌ Error:', membershipError);
    return;
  }

  console.log(`✅ Membership found: org_id = ${membership.org_id}`);

  // Step 2: Query programs for that org (simulating what the page does)
  console.log('\n2. Querying programs for org...');
  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('org_id', membership.org_id)
    .order('created_at', { ascending: false });

  if (programsError) {
    console.error('❌ Error:', programsError);
    return;
  }

  console.log(`✅ Found ${programs?.length || 0} programs:`);
  programs?.forEach(p => {
    console.log(`   - ${p.title_en} (${p.slug}) - Status: ${p.status}`);
  });

  // Step 3: Test with anon key (simulating browser client)
  console.log('\n3. Testing with anon key (browser simulation)...');
  const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anonClient = createClient(supabaseUrl, anonKey);

  // First, we'd need to sign in to get a session, but let's test the query structure
  const { data: anonPrograms, error: anonError } = await anonClient
    .from('programs')
    .select('*')
    .eq('org_id', orgId);

  if (anonError) {
    console.log(`⚠️  Anon key query error (expected without auth): ${anonError.message}`);
  } else {
    console.log(`✅ Anon key can see ${anonPrograms?.length || 0} programs`);
  }
}

testAdminQuery().catch(console.error);
