'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export function LanguageSwitcher({ currentLocale }: { currentLocale: 'en' | 'fr' }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const switchLanguage = (newLocale: 'en' | 'fr') => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded ${currentLocale === 'en' ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('fr')}
        className={`px-3 py-1 rounded ${currentLocale === 'fr' ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        FR
      </button>
    </div>
  );
}
