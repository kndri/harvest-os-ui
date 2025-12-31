import { getDictionary } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as 'en' | 'fr';
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dict.programs.title}</h1>
          <LanguageSwitcher currentLocale={locale} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            {locale === 'fr' 
              ? 'Bienvenue sur HarvestOS. Les programmes seront affichés ici.'
              : 'Welcome to HarvestOS. Programs will be displayed here.'}
          </p>
        </div>
      </div>
    </div>
  );
}
