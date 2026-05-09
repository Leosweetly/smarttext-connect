import React from 'react';
import { Droplets, Car, Wrench } from 'lucide-react';

const niches = [
  { icon: Droplets, name: 'Pressure Washing', desc: 'Capture every quote request — even the 7pm ones — and stack 5-star reviews after each job.' },
  { icon: Car, name: 'Mobile Detailing', desc: 'Book recurring detail clients on autopilot and keep your schedule full week after week.' },
  { icon: Wrench, name: 'Home Services', desc: 'Plumbers, HVAC, lawn care, handymen — anyone who lives or dies by the phone ringing.' },
];

export default function Niches() {
  return (
    <section id="niches" className="section-pad bg-background">
      <div className="container-tight">
        <div className="max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-wider text-accent">Who it's for</span>
          <h2 className="mt-3 text-3xl md:text-5xl text-primary">Built for the trades that win on speed.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {niches.map(n => (
            <div key={n.name} className="bg-card border border-border rounded-2xl p-7 hover:border-accent transition-colors">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-secondary">
                <n.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl text-primary">{n.name}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
