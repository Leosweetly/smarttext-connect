
import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const SubscriptionBanner: React.FC = () => {
  const { user } = useAuth();
  
  if (!user?.subscription) return null;
  
  // If subscription is active but not in trial, don't show anything
  if (user.subscription.status === 'active' && !user.subscription.trialEndsAt) {
    return null;
  }
  
  // Trial banner
  if (user.subscription.status === 'trialing' && user.subscription.trialEndsAt) {
    const trialEndDate = parseISO(user.subscription.trialEndsAt);
    const daysRemaining = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    return (
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-blue-500 mr-2" />
          <AlertDescription className="text-blue-700">
            <span className="font-medium">Pro Trial Active</span>
            {' - '}
            {daysRemaining > 0 ? (
              <>Your trial ends in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} on {format(trialEndDate, 'MMMM d, yyyy')}.</>
            ) : (
              <>Your trial ends today.</>
            )}
            {' '}
            <Link to="/dashboard/settings#billing" className="text-blue-700 underline hover:text-blue-800">
              Manage subscription
            </Link>
          </AlertDescription>
        </div>
      </Alert>
    );
  }
  
  // Past due or canceled
  if (user.subscription.status === 'past_due' || user.subscription.status === 'canceled') {
    return (
      <Alert className="mb-6 bg-red-50 border-red-200">
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
          <AlertDescription className="text-red-700">
            <span className="font-medium">
              {user.subscription.status === 'past_due' ? 'Payment Past Due' : 'Subscription Canceled'}
            </span>
            {' - '}
            {user.subscription.status === 'past_due' ? (
              <>Please update your payment method to continue using Pro features.</>
            ) : (
              <>Your access to Pro features will end soon.</>
            )}
            {' '}
            <Link to="/dashboard/settings#billing" className="text-red-700 underline hover:text-red-800">
              Update payment method
            </Link>
          </AlertDescription>
        </div>
      </Alert>
    );
  }
  
  return null;
};

export default SubscriptionBanner;
