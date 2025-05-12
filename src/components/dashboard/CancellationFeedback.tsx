import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cancelSubscription } from '@/services/stripe';
import { useAuth } from '@/hooks/use-auth';

interface CancellationFeedbackProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  customerId: string;
  onCancellationComplete?: () => void;
}

const CANCELLATION_REASONS = [
  { id: 'too_expensive', label: 'Too expensive' },
  { id: 'missing_features', label: 'Missing features I need' },
  { id: 'not_using', label: 'Not using it enough' },
  { id: 'switched', label: 'Switched to another solution' },
  { id: 'difficult', label: 'Too difficult to use' },
  { id: 'other', label: 'Other reason' },
];

const CancellationFeedback: React.FC<CancellationFeedbackProps> = ({
  open,
  onOpenChange,
  subscriptionId,
  customerId,
  onCancellationComplete,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User information not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedReason = CANCELLATION_REASONS.find(r => r.id === reason)?.label || reason;
      
      const result = await cancelSubscription(
        subscriptionId,
        customerId,
        user.id,
        {
          reason: selectedReason,
          feedback,
          sendFeedbackRequest: true,
          email: user.email,
          businessName: user.businessName,
        }
      );

      if (result.success) {
        toast({
          title: 'Subscription Canceled',
          description: 'Your subscription has been successfully canceled. Thank you for your feedback.',
        });
        
        onOpenChange(false);
        
        if (onCancellationComplete) {
          onCancellationComplete();
        }
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Error',
        description: 'There was a problem canceling your subscription. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Your Subscription</DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Please let us know why you're canceling so we can improve our service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Why are you canceling?</h3>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {CANCELLATION_REASONS.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.id} id={item.id} />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional feedback (optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Keep My Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!reason || isSubmitting}
            className="mt-2 sm:mt-0"
          >
            {isSubmitting ? 'Canceling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancellationFeedback;
