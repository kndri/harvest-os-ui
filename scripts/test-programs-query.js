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

async function testProgramsQuery() {
  console.log('🔍 Testing Programs Query (Public Page)...\n');

  // Test 1: Query as anonymous (what public page does)
  console.log('1. Querying published programs (public query)...');
  const { data: programs, error } = await supabase
    .from('programs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    console.error('   Details:', JSON.stringify(error, null, 2));
  } else {
    console.log(`✅ Found ${programs?.length || 0} published programs:`);
    programs?.forEach(p => {
      console.log(`   - ${p.title_en} (${p.status})`);
    });
  }

  // Test 2: Check all programs
  console.log('\n2. Checking all programs (any status)...');
  const { data: allPrograms } = await supabase
    .from('programs')
    .select('id, title_en, status, org_id');

  console.log(`✅ Total programs: ${allPrograms?.length || 0}`);
  allPrograms?.forEach(p => {
    console.log(`   - ${p.title_en}: ${p.status} (org: ${p.org_id.substring(0, 8)}...)`);
  });
}

testProgramsQuery().catch(console.error);
