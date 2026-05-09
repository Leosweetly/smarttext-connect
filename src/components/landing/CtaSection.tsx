import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CtaSection() {
  return (
    <section id="scorecard" className="section-pad hero-bg">
      <div className="container-tight max-w-3xl text-center text-primary-foreground">
        <span className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--gold))]">See How You Rank Against Your Competitors</span>
        <h2 className="mt-4 text-3xl md:text-5xl">Get your free SmartOps Scorecard.</h2>
        <p className="mt-5 text-lg text-primary-foreground/80">
          We'll grade your missed-call response, review velocity, and lead follow-up — and show you the exact fixes that turn into more booked jobs. No pitch unless you ask for one.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] hover:bg-[hsl(var(--gold))]/90 font-semibold text-base h-14 px-10 shadow-elegant">
            <a href="#book">Get My Free Scorecard <ArrowRight className="ml-1" /></a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-primary-foreground/60">Takes 15 minutes. Built for home-service businesses.</p>
      </div>
    </section>
  );
}
