import React from 'react';

const steps = [
  { n: '01', title: 'Free Scorecard & Audit', desc: 'We review your reviews, response time, and lead flow — and show you exactly where money is leaking.' },
  { n: '02', title: 'Build & Configure', desc: 'We install AI callback, review automation, and your GHL pipelines. You don\'t lift a finger.' },
  { n: '03', title: 'Launch & Optimize', desc: 'Go live in under 14 days. We monitor, tune, and report so the system keeps paying off.' },
];

export default function Process() {
  return (
    <section id="process" className="section-pad bg-secondary text-primary-foreground">
      <div className="container-tight">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--gold))]">How it works</span>
          <h2 className="mt-3 text-3xl md:text-5xl">From audit to automated in three steps.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="bg-primary/40 backdrop-blur border border-primary-foreground/10 rounded-2xl p-8">
              <div className="text-5xl font-extrabold text-[hsl(var(--gold))]">{s.n}</div>
              <h3 className="mt-4 text-xl text-primary-foreground">{s.title}</h3>
              <p className="mt-3 text-primary-foreground/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
