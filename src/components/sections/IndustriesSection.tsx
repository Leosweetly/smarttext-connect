
import React from 'react';

const industries = [
  {
    name: 'Auto Shops',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Keep customers updated on repairs and maintenance schedules automatically.'
  },
  {
    name: 'Restaurants',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Manage reservations and takeout orders with ease through automated messaging.'
  },
  {
    name: 'Salons',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Schedule appointments and send reminders to reduce no-shows and keep clients happy.'
  },
  {
    name: 'Professionals',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Streamline client communications for lawyers, accountants, and consultants.'
  }
];

const IndustriesSection: React.FC = () => {
  return (
    <section id="industries" className="section-padding bg-smarttext-navy">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-smarttext-light mb-4">
            Who It's For
          </h2>
          <p className="text-lg text-smarttext-hover max-w-2xl mx-auto">
            Custom solutions for businesses that need to stay connected
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="industry-card overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="aspect-w-16 aspect-h-9 relative h-48 overflow-hidden">
                <img 
                  src={industry.image}
                  alt={industry.name}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-smarttext-light mb-3">
                  {industry.name}
                </h3>
                <p className="text-smarttext-hover">
                  {industry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
