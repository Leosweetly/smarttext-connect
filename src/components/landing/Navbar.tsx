import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'How it works' },
  { href: '#niches', label: 'Who it\'s for' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
    )}>
      <div className="container-tight flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-primary-foreground">
          <div className="w-9 h-9 rounded-lg accent-bg flex items-center justify-center font-extrabold text-primary-foreground">S</div>
          <span className="font-extrabold text-lg tracking-tight">SmartOps</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              {l.label}
            </a>
          ))}
          <Button asChild size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <a href="#scorecard">Get My Free Scorecard</a>
          </Button>
        </nav>

        <button className="md:hidden text-primary-foreground p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10">
          <nav className="container-tight py-6 flex flex-col gap-4">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-primary-foreground/90 text-lg py-2">
                {l.label}
              </a>
            ))}
            <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 mt-2">
              <a href="#scorecard" onClick={() => setOpen(false)}>Get My Free Scorecard</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
