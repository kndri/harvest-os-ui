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
const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Test with anon key (simulating unauthenticated user)
const anonClient = createClient(supabaseUrl, anonKey);

async function testRLS() {
  console.log('🔍 Testing RLS Policies...\n');

  // Test 1: Query as anonymous user
  console.log('1. Querying as anonymous user (anon key)...');
  const { data: anonPrograms, error: anonError } = await anonClient
    .from('programs')
    .select('*')
    .eq('status', 'published');

  if (anonError) {
    console.error('❌ Anon Error:', anonError);
    console.error('   Message:', anonError.message);
    console.error('   Details:', anonError.details);
    console.error('   Hint:', anonError.hint);
  } else {
    console.log(`✅ Anon query: Found ${anonPrograms?.length || 0} programs`);
  }

  // Test 2: Try to sign in as admin and query
  console.log('\n2. Signing in as admin and querying...');
  const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
    email: 'admin@gracechurch.org',
    password: 'admin123',
  });

  if (authError) {
    console.error('❌ Auth Error:', authError.message);
    return;
  }

  console.log('✅ Signed in as:', authData.user.email);

  // Now query with authenticated session
  const { data: authPrograms, error: authQueryError } = await anonClient
    .from('programs')
    .select('*')
    .eq('status', 'published');

  if (authQueryError) {
    console.error('❌ Authenticated Query Error:', authQueryError);
    console.error('   Message:', authQueryError.message);
    console.error('   Details:', authQueryError.details);
    console.error('   Hint:', authQueryError.hint);
  } else {
    console.log(`✅ Authenticated query: Found ${authPrograms?.length || 0} programs`);
  }
}

testRLS().catch(console.error);
