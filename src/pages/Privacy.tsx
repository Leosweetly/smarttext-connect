import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-smarttext-navy mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: March 23, 2025</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              At SmartText AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our service. Please read this 
              privacy policy carefully. If you do not agree with the terms of this privacy policy, please 
              do not access the site.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            <p>
              We may collect information about you in various ways. The information we may collect via the 
              Service includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal Data: Personally identifiable information, such as your name, email address, and 
              telephone number, that you voluntarily give to us when you register with the Service or when 
              you choose to participate in various activities related to the Service.</li>
              <li>Derivative Data: Information our servers automatically collect when you access the Service, 
              such as your IP address, browser type, operating system, access times, and the pages you have viewed.</li>
              <li>Financial Data: Financial information, such as data related to your payment method (e.g., valid 
              credit card number, card brand, expiration date) that we may collect when you purchase, order, 
              return, exchange, or request information about our services.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and 
              customized experience. Specifically, we may use information collected about you via the Service to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create and manage your account.</li>
              <li>Process your transactions.</li>
              <li>Send you email marketing communications.</li>
              <li>Respond to your inquiries and customer service requests.</li>
              <li>Deliver targeted advertising, newsletters, and other information regarding promotions.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              SmartText AI<br />
              Email: info@getsmarttext.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
