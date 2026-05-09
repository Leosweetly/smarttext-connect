import React from 'react';
import { ArrowRight, Star, PhoneCall, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(210 47% 50% / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, hsl(42 65% 54% / 0.15), transparent 40%)' }} />

      <div className="container-tight relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-primary-foreground">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--gold))]" />
              GoHighLevel Agency for Home Services
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Stop losing jobs to <span className="text-[hsl(var(--gold))]">missed calls</span> and <span className="text-[hsl(var(--gold))]">bad reviews</span>.
            </h1>

            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              SmartOps installs AI callback and review automation for pressure washers, mobile detailers, and home-service pros — so every lead gets answered and every happy customer becomes a 5-star review.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] hover:bg-[hsl(var(--gold))]/90 font-semibold text-base h-14 px-8 shadow-elegant">
                <a href="#scorecard">
                  Get My Free Scorecard <ArrowRight className="ml-1" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8 text-base">
                <a href="#process">See how it works</a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2"><div className="flex">{[...Array(5)].map((_,i) => <Star key={i} size={14} className="fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />)}</div>Built on GoHighLevel</div>
              <div>No long-term contracts</div>
              <div>Setup in under 14 days</div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative bg-primary-foreground rounded-2xl shadow-elegant p-6 md:p-7">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Your Local Business Scorecard</div>
              <div className="space-y-4">
                <ScoreRow icon={<PhoneCall size={18} />} label="Missed-call response" value="0 / 10" status="bad" />
                <ScoreRow icon={<Star size={18} />} label="Google review velocity" value="3 / 10" status="warn" />
                <ScoreRow icon={<MessageSquare size={18} />} label="Lead follow-up speed" value="2 / 10" status="bad" />
              </div>
              <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                  <div className="text-2xl font-extrabold text-primary">17 / 100</div>
                </div>
                <div className="text-xs text-muted-foreground text-right max-w-[140px]">
                  Most local businesses we audit score under 30.
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] text-xs font-bold px-3 py-1.5 rounded-full shadow-card-soft rotate-3">
              FREE AUDIT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRow({ icon, label, value, status }: { icon: React.ReactNode; label: string; value: string; status: 'bad' | 'warn' | 'good' }) {
  const color = status === 'bad' ? 'bg-destructive' : status === 'warn' ? 'bg-[hsl(var(--gold))]' : 'bg-green-500';
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-secondary">{icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: status === 'bad' ? '15%' : status === 'warn' ? '35%' : '85%' }} />
        </div>
      </div>
      <div className="text-sm font-bold text-foreground tabular-nums">{value}</div>
    </div>
  );
}
