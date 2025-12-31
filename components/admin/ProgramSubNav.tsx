'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Program } from '@/types';

interface ProgramSubNavProps {
  program: Program;
  currentSection: string;
}

export function ProgramSubNav({ program, currentSection }: ProgramSubNavProps) {
  const pathname = usePathname();
  const programId = program.id;

  const navItems = [
    { 
      href: `/admin/programs/${programId}`, 
      label: 'Settings', 
      icon: '⚙️',
      key: 'settings'
    },
    { 
      href: `/admin/programs/${programId}/days`, 
      label: 'Days', 
      icon: '📅',
      key: 'days'
    },
    { 
      href: `/admin/programs/${programId}/events`, 
      label: 'Events', 
      icon: '🎪',
      key: 'events'
    },
    { 
      href: `/admin/programs/${programId}/speakers`, 
      label: 'Speakers', 
      icon: '👤',
      key: 'speakers'
    },
    { 
      href: `/admin/programs/${programId}/resources`, 
      label: 'Resources', 
      icon: '📚',
      key: 'resources'
    },
    { 
      href: `/admin/programs/${programId}/prayer-requests`, 
      label: 'Prayer Requests', 
      icon: '🙏',
      key: 'prayer-requests'
    },
  ];

  const isActive = (key: string) => {
    if (key === 'settings') {
      return pathname === `/admin/programs/${programId}`;
    }
    return pathname.includes(`/admin/programs/${programId}/${key}`);
  };

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#64748b] mb-4">
        <Link 
          href="/admin/programs" 
          className="hover:text-[#1c1f24] transition-colors font-medium"
        >
          Programs
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <Link 
          href={`/admin/programs/${programId}`}
          className="hover:text-[#1c1f24] transition-colors font-medium"
        >
          {program.title_en}
        </Link>
        {currentSection !== 'settings' && (
          <>
            <span className="text-[#cbd5e1]">/</span>
            <span className="text-[#1c1f24] font-medium">{currentSection}</span>
          </>
        )}
      </div>

      {/* Program Title and Back Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-1">{program.title_en}</h1>
          <p className="text-[#64748b]">
            {currentSection === 'settings' 
              ? 'Manage program content and settings'
              : `Manage ${currentSection.toLowerCase()}`
            }
          </p>
        </div>
        <Link
          href={`/admin/programs/${programId}`}
          className="px-4 py-2 bg-[#f2f4f6] text-[#334e62] rounded-xl hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0] flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Program
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#e2e8f0] pb-4">
        {navItems.map((item) => {
          const active = isActive(item.key);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                active
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white border border-[#e2e8f0] text-[#334e62] hover:bg-[#f2f4f6] hover:border-emerald-500/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
