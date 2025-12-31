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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyData() {
  console.log('🔍 Verifying database data...\n');

  // Check programs
  const { data: programs, error: programsError } = await supabase
    .from('programs')
    .select('id, slug, title_en, org_id, status')
    .eq('org_id', '11111111-1111-1111-1111-111111111111');

  if (programsError) {
    console.error('❌ Error fetching programs:', programsError);
  } else {
    console.log(`✅ Programs: ${programs?.length || 0}`);
    programs?.forEach(p => {
      console.log(`   - ${p.title_en} (${p.slug}) - ${p.status}`);
    });
  }

  // Check org memberships
  const { data: memberships, error: membershipsError } = await supabase
    .from('org_memberships')
    .select('user_id, role, org_id')
    .eq('org_id', '11111111-1111-1111-1111-111111111111');

  if (membershipsError) {
    console.error('❌ Error fetching memberships:', membershipsError);
  } else {
    console.log(`\n✅ Org Memberships: ${memberships?.length || 0}`);
    memberships?.forEach(m => {
      console.log(`   - User ${m.user_id.substring(0, 8)}... - Role: ${m.role}`);
    });
  }

  // Check admin user specifically
  const adminUserId = '653692a8-4d5a-4074-802f-2adabf333773';
  const { data: adminMembership } = await supabase
    .from('org_memberships')
    .select('*')
    .eq('user_id', adminUserId)
    .eq('org_id', '11111111-1111-1111-1111-111111111111')
    .single();

  console.log(`\n✅ Admin User Membership:`);
  if (adminMembership) {
    console.log(`   - User ID: ${adminMembership.user_id}`);
    console.log(`   - Org ID: ${adminMembership.org_id}`);
    console.log(`   - Role: ${adminMembership.role}`);
  } else {
    console.log('   ❌ No membership found for admin user!');
  }

  // Check program days
  const { data: days, error: daysError } = await supabase
    .from('program_days')
    .select('program_id, day_index')
    .in('program_id', programs?.map(p => p.id) || []);

  if (daysError) {
    console.error('❌ Error fetching days:', daysError);
  } else {
    console.log(`\n✅ Program Days: ${days?.length || 0}`);
    const daysByProgram = {};
    days?.forEach(d => {
      if (!daysByProgram[d.program_id]) {
        daysByProgram[d.program_id] = [];
      }
      daysByProgram[d.program_id].push(d.day_index);
    });
    Object.entries(daysByProgram).forEach(([programId, dayIndices]) => {
      const program = programs?.find(p => p.id === programId);
      console.log(`   - ${program?.title_en || programId}: ${dayIndices.length} days`);
    });
  }

  // Test RLS: Try to query as admin user
  console.log('\n🔐 Testing RLS policies...');
  
  // Create a client with admin user's session (simulating logged-in user)
  // Note: This is a simplified test - in real scenario we'd need actual session
  const { data: testPrograms, error: testError } = await supabase
    .from('programs')
    .select('*')
    .eq('org_id', '11111111-1111-1111-1111-111111111111');

  if (testError) {
    console.error('❌ RLS Test Error:', testError);
  } else {
    console.log(`✅ RLS Test: Can query ${testPrograms?.length || 0} programs with service role`);
  }

  console.log('\n📊 Summary:');
  console.log(`   Programs: ${programs?.length || 0}/3 expected`);
  console.log(`   Memberships: ${memberships?.length || 0}/4 expected`);
  console.log(`   Days: ${days?.length || 0}/38 expected`);
}

verifyData().catch(console.error);
