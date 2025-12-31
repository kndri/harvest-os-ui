'use client';

import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminNavProps {
  user?: User | null;
}

export function AdminNav({ user }: AdminNavProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showMenu && !(e.target as Element).closest('.relative')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/admin/programs"
        className="text-[#64748b] hover:text-[#1c1f24] transition-colors text-sm font-medium"
      >
        Programs
      </Link>
      <Link
        href="/admin/budgets"
        className="text-[#64748b] hover:text-[#1c1f24] transition-colors text-sm font-medium"
      >
        Budgets
      </Link>
      <Link
        href="/en/programs"
        className="text-[#64748b] hover:text-[#1c1f24] transition-colors text-sm font-medium"
      >
        View Site
      </Link>
      
      {user && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f2f4f6] hover:bg-[#e2e8f0] transition-colors border border-[#e2e8f0]"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
              {user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-[#e2e8f0] shadow-xl py-2">
              <div className="px-4 py-2 border-b border-[#e2e8f0]">
                <p className="text-sm text-[#1c1f24] font-medium">{user.email}</p>
                <p className="text-xs text-[#64748b] mt-1">Administrator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-[#64748b] hover:text-[#1c1f24] hover:bg-[#f2f4f6] transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
