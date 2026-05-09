import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'What\'s in the free scorecard?', a: 'A 1-page report grading your missed-call response, review velocity, and lead follow-up speed — plus the top three fixes we\'d make first.' },
  { q: 'Do I need GoHighLevel already?', a: 'No. We provide everything inside our agency GHL account, or we can build into yours. You don\'t need to know anything technical.' },
  { q: 'How fast can I be live?', a: 'Most clients are fully launched within 14 days of the audit call.' },
  { q: 'Is there a contract?', a: 'No long-term contracts. Month-to-month after setup. If it doesn\'t pay for itself, we don\'t deserve to keep you.' },
  { q: 'What does it cost?', a: 'Pricing depends on what you need. The audit and scorecard are always free — book a call and we\'ll quote you on the spot.' },
];

export default function FAQ() {
  return (
    <section id="faq" className="section-pad bg-background">
      <div className="container-tight max-w-3xl">
        <span className="text-sm font-bold uppercase tracking-wider text-accent">FAQ</span>
        <h2 className="mt-3 text-3xl md:text-5xl text-primary">Questions, answered.</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-primary hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
