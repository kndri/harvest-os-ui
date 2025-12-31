import { LoginForm } from '@/components/auth/LoginForm';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(params.redirect || '/en');
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-[#fafbfc] to-[#f2f4f6]">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-emerald-50 via-white to-[#fafbfc] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#cab3d9]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-20 max-w-lg px-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 backdrop-blur-xl shadow-lg">
              <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-[#1c1f24] mb-6 tracking-tight">
            Cultivate Growth. <br/>
            <span className="text-emerald-600">Nurture Community.</span>
          </h2>
          <p className="text-lg text-[#64748b] leading-relaxed">
            The all-in-one platform for modern churches to manage programs, engage members, and steward resources with excellence.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute top-8 right-8">
          <a href="/en" className="text-sm text-[#64748b] hover:text-[#1c1f24] transition-colors flex items-center gap-2 font-medium">
            Back to Home
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-[#1c1f24] tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-[#64748b]">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm redirectTo={params.redirect} />
          
          <div className="mt-6 text-center text-sm text-[#94a3b8]">
            Don't have an account?{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Contact your administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
