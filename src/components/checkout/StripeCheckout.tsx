import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripe as useStripeContext } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import styles from './StripeCheckout.module.css';

function CheckoutForm({ userId, planId, onSuccess, onCancel }: { 
  userId: string, 
  planId: string, 
  onSuccess?: () => void, 
  onCancel?: () => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create checkout session
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/stripe/checkout-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planId,
          successUrl: window.location.origin + '/checkout/success',
          cancelUrl: window.location.origin + '/checkout/cancel',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();

      // Redirect to Checkout
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.stripeForm}>
      <div className={styles.formGroup}>
        <label>Card Information</label>
        <div className={styles.cardElementContainer}>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className={styles.submitButton}
      >
        {loading ? 'Processing...' : 'Start Your Free Trial'}
      </button>
      
      <div className={styles.secureBadge}>
        <Shield size={16} />
        <span>Secure payment with Stripe</span>
      </div>
    </form>
  );
}

export default function StripeCheckout({ userId, planId, onSuccess, onCancel }: { 
  userId: string, 
  planId: string, 
  onSuccess?: () => void, 
  onCancel?: () => void 
}) {
  const { stripePromise } = useStripeContext();

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        userId={userId} 
        planId={planId} 
        onSuccess={onSuccess} 
        onCancel={onCancel} 
      />
    </Elements>
  );
}
