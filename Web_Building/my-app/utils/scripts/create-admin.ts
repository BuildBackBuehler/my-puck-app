// utils/scripts/create-admin.ts
import * as dotenv from 'dotenv';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env variables
const result = dotenv.config({ path: join(process.cwd(), '.env.local') });

if (result.error) {
  console.error('Error loading .env.local file:', result.error);
  process.exit(1);
}

// Verify environment variables are loaded
const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Required environment variables are missing:', {
    hasUrl: !!NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!SUPABASE_SERVICE_KEY
  });
  process.exit(1);
}

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY
);

async function createAdmin(email: string, password: string) {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists, updating admin status...');
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { app_metadata: { admin: true } }
      );

      if (updateError) throw updateError;
      console.log('User updated with admin privileges');
      return;
    }

    // Create new admin user
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { admin: true },
      user_metadata: { role: 'admin' }
    });

    if (error) throw error;

    console.log('Admin created successfully:', {
      id: user?.id,
      email: user?.email,
      metadata: user?.app_metadata
    });

  } catch (error) {
    console.error('Error creating/updating admin:', error);
    process.exit(1);
  }
}

// Get command line arguments
const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin email@example.com password123');
  process.exit(1);
}

// Run the script
createAdmin(email, password).catch(console.error);