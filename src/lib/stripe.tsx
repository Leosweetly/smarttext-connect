import { createContext, useContext, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const StripeContext = createContext<{ stripePromise: Promise<any> | null }>({
  stripePromise: null
});

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const stripePromise = useMemo(() => 
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
    []
  );

  return (
    <StripeContext.Provider value={{ stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}
