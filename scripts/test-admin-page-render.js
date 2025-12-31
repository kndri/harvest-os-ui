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

async function testAdminPageLogic() {
  console.log('🔍 Testing Admin Programs Page Logic...\n');

  const adminUserId = '653692a8-4d5a-4074-802f-2adabf333773';

  // Simulate what the page does
  console.log('1. Getting user...');
  const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(adminUserId);
  
  if (userError || !user) {
    console.error('❌ Error getting user:', userError);
    return;
  }
  console.log(`✅ User found: ${user.email}`);

  // Get user's org_id (what the page does)
  console.log('\n2. Getting membership...');
  const { data: membership, error: membershipError } = await supabase
    .from('org_memberships')
    .select('org_id, role')
    .eq('user_id', adminUserId)
    .single();

  if (membershipError) {
    console.error('❌ Error:', membershipError);
    return;
  }

  console.log(`✅ Membership found:`);
  console.log(`   - Org ID: ${membership.org_id}`);
  console.log(`   - Role: ${membership.role}`);

  // Query programs (what the page does)
  console.log('\n3. Querying programs...');
  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('*')
    .eq('org_id', membership.org_id)
    .order('created_at', { ascending: false });

  if (programsError) {
    console.error('❌ Error:', programsError);
    console.error('   Details:', JSON.stringify(programsError, null, 2));
    return;
  }

  console.log(`✅ Found ${programs?.length || 0} programs:`);
  if (programs && programs.length > 0) {
    programs.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title_en}`);
      console.log(`      - Slug: ${p.slug}`);
      console.log(`      - Status: ${p.status}`);
      console.log(`      - Days: ${p.duration_days || 'N/A'}`);
    });
  } else {
    console.log('   ⚠️  No programs found!');
    
    // Check if programs exist for this org
    const { data: allPrograms } = await supabase
      .from('programs')
      .select('id, title_en, org_id')
      .eq('org_id', membership.org_id);
    
    console.log(`\n   Checking all programs for org ${membership.org_id}:`);
    console.log(`   Found ${allPrograms?.length || 0} programs total`);
  }
}

testAdminPageLogic().catch(console.error);
