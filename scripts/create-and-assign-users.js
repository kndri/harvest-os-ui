#!/usr/bin/env node
// Script to create test users and assign roles
// Uses Supabase Admin API to create users and then assign org memberships

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  { email: 'admin@gracechurch.org', password: 'admin123', role: 'admin' },
  { email: 'member@gracechurch.org', password: 'member123', role: 'member' },
  { email: 'moderator@gracechurch.org', password: 'moderator123', role: 'moderator' },
  { email: 'finance@gracechurch.org', password: 'finance123', role: 'finance' },
];

const orgId = '11111111-1111-1111-1111-111111111111';

async function createUsers() {
  console.log('🔐 Creating test users...\n');
  
  const userIds = {};

  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(u => u.email === user.email);
      
      if (existing) {
        console.log(`✓ User ${user.email} already exists (ID: ${existing.id})`);
        userIds[user.role] = existing.id;
      } else {
        // Create new user
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });

        if (error) {
          console.error(`✗ Error creating ${user.email}:`, error.message);
          continue;
        }

        console.log(`✓ Created user ${user.email} (ID: ${data.user.id})`);
        userIds[user.role] = data.user.id;
      }
    } catch (err) {
      console.error(`✗ Error processing ${user.email}:`, err.message);
    }
  }

  console.log('\n📝 Assigning roles to organization...\n');

  // Assign roles
  for (const user of testUsers) {
    const userId = userIds[user.role];
    if (!userId) {
      console.error(`✗ No user ID found for ${user.role}`);
      continue;
    }

    try {
      const { error } = await supabase
        .from('org_memberships')
        .upsert({
          org_id: orgId,
          user_id: userId,
          role: user.role,
        }, {
          onConflict: 'org_id,user_id'
        });

      if (error) {
        console.error(`✗ Error assigning role to ${user.email}:`, error.message);
      } else {
        console.log(`✓ Assigned ${user.role} role to ${user.email}`);
      }
    } catch (err) {
      console.error(`✗ Error assigning role to ${user.email}:`, err.message);
    }
  }

  console.log('\n✅ Done! User IDs:');
  console.log(JSON.stringify(userIds, null, 2));
  
  return userIds;
}

createUsers().catch(console.error);
