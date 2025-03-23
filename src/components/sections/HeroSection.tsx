
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-32 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-smarttext-light mb-6 animate-fade-in-down">
          Texting that works as hard as you do.
        </h1>
        <p className="text-xl md:text-2xl text-smarttext-hover max-w-3xl mx-auto mb-10 animate-fade-in opacity-90">
          SmartText AI helps local businesses respond faster, save time, and never miss another customer.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          <Button 
            className="bg-smarttext-primary hover:bg-smarttext-hover w-full sm:w-auto px-8 py-6 text-lg button-hover" 
            asChild
          >
            <Link to="/auth/signup">Try it Now</Link>
          </Button>
          <Button 
            className="bg-smarttext-light text-smarttext-navy border border-smarttext-gray hover:bg-[#E2E8F0] w-full sm:w-auto px-8 py-6 text-lg font-bold button-hover"
            asChild
          >
            <a href="#contact">Book a Demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
