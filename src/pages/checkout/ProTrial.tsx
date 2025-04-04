
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check } from 'lucide-react';

const ProTrial: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If user already has subscription, redirect to business info
    if (user?.subscription?.status) {
      navigate('/onboarding/business-info');
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Create a checkout session via API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: user?.id, // Send the user/business ID
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }
      
      // Get the checkout URL from the response
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-smarttext-navy to-smarttext-slate p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <Logo variant="dark" className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-smarttext-navy">
            Activate Your Pro Trial
          </h1>
          <p className="text-smarttext-slate mt-2">
            Get full access to SmartText AI Pro for 14 days
          </p>
        </div>
        
        <Card className="p-6 mb-6 border-2 border-smarttext-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-smarttext-primary mr-2" />
              <h2 className="text-xl font-bold text-smarttext-navy">Pro Plan</h2>
            </div>
            <div className="bg-smarttext-primary/10 text-smarttext-primary px-2 py-1 rounded text-sm font-medium">
              14-Day Trial
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Custom AI responses tailored to your business</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Lead capture form via text</p>
            </div>
            <div className="flex items-start mb-2">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Built-in lead qualification flows</p>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 bg-green-100 p-1 rounded-full">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm">Priority support</p>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-2xl font-bold text-smarttext-navy">$399</div>
            <div className="text-smarttext-slate text-sm">per month after trial</div>
          </div>
          
          <Button 
            onClick={handleCheckout}
            className="w-full bg-smarttext-primary hover:bg-smarttext-hover"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Start 14-Day Free Trial"}
          </Button>
          
          <p className="text-xs text-center text-smarttext-slate mt-4">
            You won't be charged during your trial. You can cancel anytime.
          </p>
        </Card>
        
        <div className="text-center text-sm text-smarttext-slate">
          By starting your trial, you agree to our{' '}
          <a href="/terms" className="text-smarttext-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="text-smarttext-primary hover:underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default ProTrial;
