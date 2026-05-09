import React from 'react';
import { PhoneCall, Star, Globe, Settings } from 'lucide-react';

const hero = [
  {
    icon: PhoneCall,
    title: 'AI Missed-Call Text-Back',
    desc: 'Every missed call instantly gets a personalized text from your business — booking the job before your competitor picks up.',
    bullets: ['Replies in under 10 seconds', '24/7 — even after hours', 'Books straight into your calendar'],
  },
  {
    icon: Star,
    title: 'Review Automation',
    desc: 'Turn every completed job into a 5-star Google review. Automated requests, smart follow-ups, and reputation alerts.',
    bullets: ['Text + email review requests', 'Negative-feedback filter', 'More reviews = more local jobs'],
  },
];

const support = [
  { icon: Globe, title: 'Websites & Funnels', desc: 'Conversion-built sites that turn visitors into booked jobs.' },
  { icon: Settings, title: 'Full GHL Setup', desc: 'Pipelines, automations, and workflows tailored to your service.' },
];

export default function Services() {
  return (
    <section id="services" className="section-pad bg-background">
      <div className="container-tight">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">What we install</span>
          <h2 className="mt-3 text-3xl md:text-5xl text-primary">Two systems that pay for themselves on the first job.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Built on GoHighLevel. Configured for the way home-service businesses actually run.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {hero.map((s) => (
            <div key={s.title} className="group bg-card rounded-2xl p-8 border border-border shadow-card-soft hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl accent-bg flex items-center justify-center text-primary-foreground">
                <s.icon size={26} />
              </div>
              <h3 className="mt-6 text-2xl text-primary">{s.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))]" />
                    <span className="text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {support.map(s => (
            <div key={s.title} className="bg-muted/50 rounded-2xl p-6 border border-border flex gap-4 items-start">
              <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center text-primary-foreground shrink-0">
                <s.icon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-primary">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
