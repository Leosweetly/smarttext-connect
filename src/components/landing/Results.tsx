import React from 'react';

const stats = [
  { n: '< 10s', label: 'Average response to missed calls' },
  { n: '4.9★', label: 'Target review rating' },
  { n: '14 days', label: 'From audit to live system' },
  { n: '24/7', label: 'AI handles after-hours leads' },
];

export default function Results() {
  return (
    <section className="section-pad bg-muted/40">
      <div className="container-tight">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-4xl md:text-5xl font-extrabold text-primary">{s.n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
