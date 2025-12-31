'use client';

import { useEffect, useRef, useState } from 'react';

const features = {
  en: [
    {
      icon: '📅',
      title: 'Program Management',
      description: 'Create flexible programs for any initiative—prayer, fasting, youth, conferences. Set custom durations and modular features.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: '🌍',
      title: 'Bilingual by Design',
      description: 'Seamlessly serve English and French communities with built-in translation support for all content.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🙏',
      title: 'Prayer Wall',
      description: 'Foster community through moderated prayer requests. Members can share, support, and track answered prayers.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: '📊',
      title: 'Smart Budgeting',
      description: 'Track expenses, revenue, and pledges with real-time variance analysis. Full audit trail for transparency.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description: 'Granular permissions for admins, finance teams, moderators, and members. Everyone sees what they need.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: '📱',
      title: 'Mobile-First',
      description: 'Beautiful experience on any device. Your community can engage from anywhere, anytime.',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ],
  fr: [
    {
      icon: '📅',
      title: 'Gestion de Programmes',
      description: 'Créez des programmes flexibles pour toute initiative—prière, jeûne, jeunesse, conférences.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: '🌍',
      title: 'Bilingue par Conception',
      description: 'Servez les communautés anglaises et françaises avec un support de traduction intégré.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🙏',
      title: 'Mur de Prière',
      description: 'Favorisez la communauté à travers des demandes de prière modérées et le suivi des prières exaucées.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: '📊',
      title: 'Budget Intelligent',
      description: 'Suivez les dépenses, revenus et promesses avec analyse des écarts en temps réel.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: '👥',
      title: 'Accès Basé sur les Rôles',
      description: 'Permissions granulaires pour admins, équipes finances, modérateurs et membres.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: '📱',
      title: 'Mobile-First',
      description: 'Belle expérience sur tout appareil. Votre communauté peut s\'engager de partout.',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ],
};

function FeatureCard({ 
  feature, 
  index 
}: { 
  feature: typeof features.en[0]; 
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* Gradient glow on hover */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-2xl mb-6 shadow-lg`}>
          {feature.icon}
        </div>

        <h3 className="text-xl font-semibold text-white mb-3">
          {feature.title}
        </h3>

        <p className="text-slate-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function Features({ locale }: { locale: 'en' | 'fr' }) {
  const content = {
    en: {
      tagline: 'Everything You Need',
      headline: 'Built for the Modern Church',
      subheadline: 'Powerful features designed to help your community thrive.',
    },
    fr: {
      tagline: 'Tout Ce Dont Vous Avez Besoin',
      headline: 'Conçu pour l\'Église Moderne',
      subheadline: 'Des fonctionnalités puissantes pour aider votre communauté à prospérer.',
    },
  };

  const t = content[locale];
  const featureList = features[locale];

  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium tracking-wide uppercase mb-6">
            {t.tagline}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.headline}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t.subheadline}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
