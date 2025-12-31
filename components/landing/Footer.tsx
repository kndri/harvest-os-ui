'use client';

export function Footer({ locale }: { locale: 'en' | 'fr' }) {
  const content = {
    en: {
      description: 'Empowering churches to cultivate growth and nurture community through modern technology.',
      product: 'Product',
      company: 'Company',
      resources: 'Resources',
      legal: 'Legal',
      features: 'Features',
      pricing: 'Pricing',
      integrations: 'Integrations',
      changelog: 'Changelog',
      about: 'About',
      careers: 'Careers',
      press: 'Press',
      contact: 'Contact',
      docs: 'Documentation',
      guides: 'Guides',
      support: 'Support',
      api: 'API',
      privacy: 'Privacy',
      terms: 'Terms',
      cookies: 'Cookies',
      rights: 'All rights reserved.',
    },
    fr: {
      description: 'Permettre aux églises de cultiver la croissance et de nourrir la communauté grâce à la technologie moderne.',
      product: 'Produit',
      company: 'Entreprise',
      resources: 'Ressources',
      legal: 'Légal',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      integrations: 'Intégrations',
      changelog: 'Nouveautés',
      about: 'À Propos',
      careers: 'Carrières',
      press: 'Presse',
      contact: 'Contact',
      docs: 'Documentation',
      guides: 'Guides',
      support: 'Support',
      api: 'API',
      privacy: 'Confidentialité',
      terms: 'Conditions',
      cookies: 'Cookies',
      rights: 'Tous droits réservés.',
    },
  };

  const t = content[locale];

  return (
    <footer className="relative bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">HarvestOS</span>
            </div>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.product}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.features}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.pricing}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.integrations}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.changelog}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.company}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.about}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.careers}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.press}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.contact}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t.resources}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.docs}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.guides}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.support}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t.api}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} HarvestOS. {t.rights}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{t.privacy}</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{t.terms}</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">{t.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
