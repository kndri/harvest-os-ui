'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  role: string | null;
}

/**
 * Hook for managing authentication state.
 * Uses the publishable key - all queries respect RLS policies.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    role: null,
  });
  const supabase = createClient(); // Uses publishable key

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        role: null, // Will be fetched separately if needed
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        loading: false,
        role: null,
      });
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return state;
}
