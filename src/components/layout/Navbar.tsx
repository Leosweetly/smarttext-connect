
import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8',
        isScrolled 
          ? 'bg-smarttext-navy/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Logo variant="light" />

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="#features" className="nav-link text-smarttext-light">Features</Link>
          <Link to="#industries" className="nav-link text-smarttext-light">Industries</Link>
          <Link to="#pricing" className="nav-link text-smarttext-light">Pricing</Link>
          <Link to="/auth/login" className="nav-link text-smarttext-light">Login</Link>
          <Button asChild className="bg-smarttext-primary hover:bg-smarttext-hover button-hover">
            <Link to="/auth/signup">Try it Now</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-smarttext-light p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-smarttext-navy z-40 pt-20 pb-6 px-6 flex flex-col md:hidden',
          isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none',
          'transition-all duration-300 ease-in-out'
        )}
      >
        <nav className="flex flex-col space-y-6">
          <Link 
            to="#features" 
            className="text-xl text-smarttext-light border-b border-smarttext-primary/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="#industries" 
            className="text-xl text-smarttext-light border-b border-smarttext-primary/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Industries
          </Link>
          <Link 
            to="#pricing" 
            className="text-xl text-smarttext-light border-b border-smarttext-primary/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/auth/login" 
            className="text-xl text-smarttext-light border-b border-smarttext-primary/20 pb-4"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Button 
            className="bg-smarttext-primary hover:bg-smarttext-hover w-full mt-4 py-6 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
            asChild
          >
            <Link to="/auth/signup">Try it Now</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
