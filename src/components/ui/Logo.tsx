
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'light', className }) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "font-bold tracking-wider text-2xl flex items-center transition-opacity duration-200 hover:opacity-90", 
        variant === 'light' ? 'text-smarttext-white' : 'text-smarttext-navy',
        className
      )}
    >
      <span className="mr-1">SmartText</span>
      <span className={cn(
        variant === 'light' ? 'text-smarttext-hover' : 'text-smarttext-primary'
      )}>AI</span>
    </Link>
  );
};

export default Logo;
