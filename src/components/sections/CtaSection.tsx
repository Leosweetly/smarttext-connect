
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection: React.FC = () => {
  return (
    <section id="contact" className="section-padding bg-smarttext-navy text-center">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-smarttext-light mb-6">
          Ready to never miss a customer again?
        </h2>
        <p className="text-xl text-smarttext-hover mb-10 max-w-2xl mx-auto">
          Join hundreds of local businesses using SmartText AI to automate their customer communications.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="bg-smarttext-primary hover:bg-smarttext-hover w-full sm:w-auto px-8 py-6 text-lg button-hover" 
            asChild
          >
            <Link to="/auth/signup">Try it Now</Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-smarttext-light text-smarttext-light hover:bg-smarttext-light/10 w-full sm:w-auto px-8 py-6 text-lg button-hover"
          >
            <a href="mailto:info@getsmarttext.com">Book a Demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
