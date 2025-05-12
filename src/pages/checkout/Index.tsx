import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import StripeCheckout from '@/components/checkout/StripeCheckout';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import styles from './Checkout.module.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [planId, setPlanId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get plan from query params
    if (searchParams.get('plan')) {
      setPlanId(searchParams.get('plan'));
    }
  }, [searchParams]);
  
  // If no user or plan, redirect to pricing
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading || !isAuthenticated || !planId) {
    return (
      <div className={styles.loading}>
        <Logo variant="light" className="h-12 mb-6" />
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Logo className="h-8" />
        </div>
      </header>
      
      <div className={styles.checkoutPage}>
        <h1 className={styles.title}>
          Complete Your Subscription
        </h1>
        <p className={styles.subtitle}>
          You're signing up for the {planId.charAt(0).toUpperCase() + planId.slice(1)} plan
        </p>
        
        {user && (
          <StripeCheckout 
            userId={user.id} 
            planId={planId} 
          />
        )}
        
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}
