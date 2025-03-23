
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-smarttext-navy text-smarttext-light py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo variant="light" className="mb-4" />
            <p className="text-smarttext-hover mt-4 max-w-md">
              SmartText AI helps local businesses respond faster, save time, and never miss another customer.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Home</Link></li>
              <li><Link to="/#features" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Pricing</Link></li>
              <li><a href="mailto:info@getsmarttext.com" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-smarttext-hover hover:text-smarttext-light transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:info@getsmarttext.com" className="text-smarttext-hover hover:text-smarttext-light transition-colors">info@getsmarttext.com</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-smarttext-primary/20 mt-8 pt-8 text-center text-smarttext-hover">
          <p>© {new Date().getFullYear()} SmartText AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
