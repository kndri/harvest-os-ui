'use client';

import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCurrent(value);
              clearInterval(timer);
            } else {
              setCurrent(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {current.toLocaleString()}{suffix}
    </span>
  );
}

export function Stats({ locale }: { locale: 'en' | 'fr' }) {
  const stats = {
    en: [
      { value: 10, suffix: 'K+', label: 'Active Users' },
      { value: 500, suffix: '+', label: 'Churches Served' },
      { value: 50, suffix: 'K+', label: 'Programs Created' },
      { value: 99.9, suffix: '%', label: 'Uptime' },
    ],
    fr: [
      { value: 10, suffix: 'K+', label: 'Utilisateurs Actifs' },
      { value: 500, suffix: '+', label: 'Églises Servies' },
      { value: 50, suffix: 'K+', label: 'Programmes Créés' },
      { value: 99.9, suffix: '%', label: 'Disponibilité' },
    ],
  };

  const content = stats[locale];

  return (
    <section className="relative py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10 border border-white/5 p-12 md:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {content.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
