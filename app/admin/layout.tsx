import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminMobileNav } from '@/components/admin/AdminMobileNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Server-side authentication check
  if (!user) {
    redirect('/auth/login?redirect=' + encodeURIComponent('/admin'));
  }

  // Check if user is admin
  const { data: membership } = await supabase
    .from('org_memberships')
    .select('role, org_id')
    .eq('user_id', user.id)
    .single();

  if (membership?.role !== 'admin') {
    redirect('/en');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fafbfc] to-white flex">
      <AdminSidebar user={user} />
      <div 
        className="flex-1 lg:ml-64 transition-all duration-300 overflow-x-hidden flex flex-col"
        style={{ marginLeft: 'var(--admin-sidebar-width, 256px)' }}
      >
        <AdminMobileNav user={user} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
