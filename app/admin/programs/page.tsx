import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Program } from '@/types';

export default async function AdminProgramsPage() {
  const supabase = await createServerClient();
  
  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Programs</h1>
        <Link 
          href="/admin/programs/new"
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          + New Program
        </Link>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-slate-400 font-medium">Title</th>
              <th className="text-left p-4 text-slate-400 font-medium">Slug</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Days</th>
              <th className="text-left p-4 text-slate-400 font-medium">Created</th>
              <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs?.map((program) => (
              <tr key={program.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="text-white font-medium">{program.title_en}</div>
                  {program.title_fr && (
                    <div className="text-sm text-slate-500">{program.title_fr}</div>
                  )}
                </td>
                <td className="p-4 text-slate-400 font-mono text-sm">{program.slug}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    program.status === 'published' 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : program.status === 'draft'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {program.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{program.duration_days || '—'}</td>
                <td className="p-4 text-slate-400 text-sm">
                  {new Date(program.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/programs/${program.id}`}
                      className="px-3 py-1 text-sm bg-white/5 text-white rounded hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/admin/programs/${program.id}/days`}
                      className="px-3 py-1 text-sm bg-white/5 text-white rounded hover:bg-white/10 transition-colors"
                    >
                      Days
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {(!programs || programs.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No programs yet. Create your first program to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
