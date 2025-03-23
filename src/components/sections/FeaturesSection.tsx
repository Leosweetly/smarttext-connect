
import React from 'react';
import { MessageSquare, Zap, RefreshCcw, Database } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare size={48} className="text-smarttext-primary" />,
    title: 'Automated Responses',
    description: 'Smart AI responses that handle common customer questions without your input.'
  },
  {
    icon: <Zap size={48} className="text-smarttext-primary" />,
    title: 'Industry Templates',
    description: 'Pre-built templates for your specific industry, ready to use on day one.'
  },
  {
    icon: <RefreshCcw size={48} className="text-smarttext-primary" />,
    title: 'Easy Integration',
    description: 'Connect with your existing tools through our simple integration options.'
  },
  {
    icon: <Database size={48} className="text-smarttext-primary" />,
    title: 'Zapier + Airtable Sync',
    description: 'Keep all your customer data synchronized across your favorite platforms.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-smarttext-navy mb-4">
            What It Does
          </h2>
          <p className="text-lg text-smarttext-slate max-w-2xl mx-auto">
            Powerful tools designed specifically for local businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-smarttext-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-smarttext-slate">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
