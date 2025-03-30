
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const Signup: React.FC = () => {
  const { toast } = useToast();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    password: '',
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Show toast notification
      toast({
        title: "Account Created",
        description: "Welcome to SmartText AI! Redirecting to onboarding...",
      });
      
      // Sign up the user (this will redirect to onboarding)
      await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.businessName
      );
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smarttext-navy to-smarttext-slate p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Logo variant="dark" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-smarttext-navy">
            Create Your Account
          </h1>
          <p className="text-smarttext-slate mt-2">
            Start automating your customer communications
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-smarttext-navy">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Smith"
              required
              className="w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="businessName" className="block text-sm font-medium text-smarttext-navy">
              Business Name
            </label>
            <Input
              id="businessName"
              type="text"
              placeholder="Acme Inc."
              required
              className="w-full"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          
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
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-smarttext-navy">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              required
              className="w-full"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
            disabled={isSubmitting}
          >
            Create Account
          </Button>
          
          <p className="text-xs text-smarttext-slate text-center mt-4">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-smarttext-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-smarttext-primary hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-smarttext-slate">
            Already have an account?{' '}
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

export default Signup;
