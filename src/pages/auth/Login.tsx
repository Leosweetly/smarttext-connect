
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // This would be replaced with actual Auth0 integration
    toast({
      title: "Login Successful",
      description: "Redirecting to dashboard...",
    });
    
    // For demo purposes, simulate redirection after 2 seconds
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smarttext-navy to-smarttext-slate p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Logo variant="dark" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-smarttext-navy">
            Welcome Back
          </h1>
          <p className="text-smarttext-slate mt-2">
            Sign in to your SmartText AI account
          </p>
        </div>
        
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
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-smarttext-navy">
                Password
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-smarttext-primary hover:text-smarttext-hover">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full"
            />
          </div>
          
          <Button type="submit" className="w-full bg-smarttext-primary hover:bg-smarttext-hover">
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-smarttext-slate">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-smarttext-primary hover:text-smarttext-hover font-medium">
              Sign up
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

export default Login;
