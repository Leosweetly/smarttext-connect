
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // This would be replaced with actual Auth0 integration
    toast({
      title: "Email Sent",
      description: "Check your inbox for password reset instructions",
    });
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smarttext-navy to-smarttext-slate p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Logo variant="dark" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-smarttext-navy">
            Reset Your Password
          </h1>
          <p className="text-smarttext-slate mt-2">
            {!submitted 
              ? "Enter your email and we'll send you instructions" 
              : "Check your email for a reset link"
            }
          </p>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-smarttext-navy">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>
            
            <Button type="submit" className="w-full bg-smarttext-primary hover:bg-smarttext-hover">
              Send Reset Instructions
            </Button>
          </form>
        ) : (
          <div className="text-center p-6 bg-smarttext-primary/10 rounded-lg">
            <p className="text-smarttext-primary mb-4">
              Reset instructions sent! Check your email and follow the link to reset your password.
            </p>
            <Button 
              variant="outline" 
              className="bg-white text-smarttext-primary border-smarttext-primary"
              onClick={() => setSubmitted(false)}
            >
              Try a different email
            </Button>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-smarttext-slate">
            Remember your password?{' '}
            <Link to="/auth/login" className="text-smarttext-primary hover:text-smarttext-hover font-medium">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <Link to="/" className="text-sm text-smarttext-slate hover:text-smarttext-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
