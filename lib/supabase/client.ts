import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser/client-side operations.
 * Uses the publishable key which is safe to expose in the browser.
 * All queries respect Row Level Security (RLS) policies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
