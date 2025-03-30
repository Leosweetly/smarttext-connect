import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-smarttext-navy mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-4">Last Updated: March 23, 2025</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you and SmartText AI, 
              concerning your access to and use of our website and services. You agree that by accessing the 
              Service, you have read, understood, and agree to be bound by all of these Terms of Service. If 
              you do not agree with all of these Terms of Service, then you are expressly prohibited from using 
              the Service and you must discontinue use immediately.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Subscriptions</h2>
            <p>
              The Service is billed on a subscription basis. You will be billed in advance on a recurring and 
              periodic basis, depending on the type of subscription plan you select when purchasing a subscription. 
              At the end of each period, your subscription will automatically renew under the exact same conditions 
              unless you cancel it or SmartText AI cancels it.
            </p>
            <p>
              You may cancel your subscription either through your online account management page or by contacting 
              our customer support team. You will receive a confirmation email upon cancellation, and your subscription 
              will continue until the end of your current billing period.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Free Trial</h2>
            <p>
              SmartText AI may, at its sole discretion, offer a subscription with a free trial for a limited period 
              of time. You may be required to enter your billing information to sign up for the free trial. If you 
              do enter your billing information when signing up for a free trial, you will not be charged by 
              SmartText AI until the free trial has expired. On the last day of the free trial period, unless you 
              cancelled your subscription, you will be automatically charged the applicable subscription fee for 
              the type of subscription you have selected.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive 
              property of SmartText AI and its licensors. The Service is protected by copyright, trademark, and 
              other laws of both the United States and foreign countries. Our trademarks and trade dress may not 
              be used in connection with any product or service without the prior written consent of SmartText AI.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

export default Terms;
