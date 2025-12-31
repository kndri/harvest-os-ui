import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Program } from '@/types';

export default async function AdminProgramsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            Not authenticated
          </div>
        </div>
      );
  }

  // Get user's org_id
  const { data: membership } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('user_id', user.id)
    .single();

  if (!membership) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
            <p className="font-semibold mb-2">No Organization Membership</p>
            <p className="text-sm">You need to be assigned to an organization. Contact your administrator.</p>
          </div>
        </div>
      );
  }

  // Query programs for user's org
  const { data: programs, error } = await supabase
    .from('programs')
    .select('*')
    .eq('org_id', membership.org_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
      return (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-semibold mb-2">Error Loading Programs</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1c1f24] mb-2">Programs</h1>
          <p className="text-[#64748b]">Manage your church programs and content</p>
        </div>
        <Link 
          href="/admin/programs/new"
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
        >
          + New Program
        </Link>
      </div>

      {programs && programs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f2f4f6]">
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Title</th>
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Slug</th>
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Status</th>
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Days</th>
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Created</th>
                <th className="text-left p-4 text-[#64748b] font-semibold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b border-[#e2e8f0] hover:bg-[#fafbfc] transition-colors last:border-0">
                  <td className="p-4">
                    <div className="text-[#1c1f24] font-medium">{program.title_en}</div>
                    {program.title_fr && (
                      <div className="text-sm text-[#64748b] mt-1">{program.title_fr}</div>
                    )}
                  </td>
                  <td className="p-4 text-[#94a3b8] font-mono text-sm">{program.slug}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      program.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : program.status === 'draft'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-[#f2f4f6] text-[#64748b] border border-[#e2e8f0]'
                    }`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#64748b]">{program.duration_days || '—'}</td>
                  <td className="p-4 text-[#94a3b8] text-sm">
                    {new Date(program.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/programs/${program.id}`}
                        className="px-3 py-1.5 text-sm bg-[#f2f4f6] text-[#334e62] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
                      >
                        Edit
                      </Link>
                      <Link 
                        href={`/admin/programs/${program.id}/days`}
                        className="px-3 py-1.5 text-sm bg-[#f2f4f6] text-[#334e62] rounded-lg hover:bg-[#e2e8f0] transition-colors font-medium border border-[#e2e8f0]"
                      >
                        Days
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#f2f4f6] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1c1f24] mb-2">No programs yet</h3>
            <p className="text-[#64748b] mb-6">
              {error 
                ? 'There was an error loading programs. Please try again later.'
                : 'Get started by creating your first program.'}
            </p>
            {!error && (
              <Link 
                href="/admin/programs/new"
                className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 font-medium"
              >
                + Create Your First Program
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
