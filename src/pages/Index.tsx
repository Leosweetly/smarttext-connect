import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { CtaSection } from '@/components/sections/CtaSection';

export default function Index() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
}