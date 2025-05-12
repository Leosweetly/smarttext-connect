import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const CheckoutCancel: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col items-center justify-center">
        <Logo variant="light" className="h-12 mb-6" />
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-smarttext-navy to-smarttext-slate flex flex-col">
      <header className="p-6">
        <Logo variant="light" className="h-8" />
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-smarttext-navy mb-2">
            Checkout Canceled
          </h1>
          
          <p className="text-smarttext-slate mb-6">
            Your payment was not processed. You need an active subscription to use SmartText AI.
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Button
              className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
              onClick={() => navigate('/auth/signup')}
            >
              Try Again
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-smarttext-primary text-smarttext-primary hover:bg-smarttext-primary/10"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;
