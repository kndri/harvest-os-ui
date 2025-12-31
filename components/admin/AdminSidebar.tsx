'use client';

import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Type guard for Link vs anchor
function isNextLink(href: string): boolean {
  return !href.startsWith('/en/') && !href.startsWith('/fr/');
}

interface AdminSidebarProps {
  user?: User | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Update CSS variable for sidebar width
    document.documentElement.style.setProperty(
      '--admin-sidebar-width',
      isCollapsed ? '64px' : '256px'
    );
  }, [isCollapsed]);

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.relative')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/en');
    router.refresh();
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      section: 'Content',
      label: 'Programs',
      href: '/admin/programs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      section: 'Finance',
      label: 'Budgets',
      href: '/admin/budgets',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      section: 'Site',
      label: 'View Site',
      href: '/en/programs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-[#e2e8f0] transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden lg:flex`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#e2e8f0]">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1c1f24] truncate">HarvestOS</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md mx-auto flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[#f2f4f6] transition-colors text-[#64748b] hover:text-[#1c1f24] flex-shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Quick Search */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-[#e2e8f0]">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-10 pr-10 py-2 bg-[#f2f4f6] border border-[#e2e8f0] rounded-lg text-sm text-[#1c1f24] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-[#94a3b8]">
              <span className="px-1.5 py-0.5 bg-white border border-[#e2e8f0] rounded text-[10px] font-mono">⌘</span>
              <span className="text-[10px]">K</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            {!isCollapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  {section}
                </h3>
              </div>
            )}
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.href);
                const linkContent = (
                  <>
                    <span className={`flex-shrink-0 ${active ? 'text-emerald-600' : 'text-[#64748b]'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className={`font-medium flex-1 ${active ? 'text-emerald-700' : 'text-[#1c1f24]'}`}>
                          {item.label}
                        </span>
                        {!active && (
                          <svg className="w-4 h-4 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </>
                    )}
                  </>
                );

                if (isNextLink(item.href)) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all ${
                        active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-[#64748b] hover:bg-[#f2f4f6] hover:text-[#1c1f24]'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      {linkContent}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all ${
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-[#64748b] hover:bg-[#f2f4f6] hover:text-[#1c1f24]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {linkContent}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Menu */}
      {user && (
        <div className="border-t border-[#e2e8f0] p-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                showUserMenu
                  ? 'bg-[#f2f4f6]'
                  : 'hover:bg-[#f2f4f6]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-md flex-shrink-0">
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-[#1c1f24] truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-[#64748b]">Administrator</p>
                  </div>
                  <svg className={`w-4 h-4 text-[#64748b] flex-shrink-0 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {showUserMenu && !isCollapsed && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e2e8f0] rounded-lg shadow-xl overflow-hidden z-10">
                <div className="px-4 py-2 border-b border-[#e2e8f0]">
                  <p className="text-xs text-[#94a3b8] mb-1">Account</p>
                  <p className="text-sm font-medium text-[#1c1f24] truncate">{user.email}</p>
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
        </div>
      )}
    </aside>
  );
}
