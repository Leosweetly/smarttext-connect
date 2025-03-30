import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

const MessageTemplates: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { progress, updateMessageTemplates } = useOnboarding();
  
  // Local state for form fields
  const [messageTemplates, setMessageTemplates] = useState({
    greeting: progress.messageTemplates.greeting || '',
    missedCall: progress.messageTemplates.missedCall || '',
    commonResponses: [...(progress.messageTemplates.commonResponses || [])],
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update missed call template with business name when it changes
  useEffect(() => {
    if (user?.businessName && messageTemplates.missedCall.includes('[Business Name]')) {
      setMessageTemplates(prev => ({
        ...prev,
        missedCall: prev.missedCall.replace('[Business Name]', user.businessName),
      }));
    }
  }, [user?.businessName, messageTemplates.missedCall]);
  
  // Handle text area changes
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageTemplates(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Handle common response changes
  const handleResponseChange = (index: number, value: string) => {
    const updatedResponses = [...messageTemplates.commonResponses];
    updatedResponses[index] = value;
    
    setMessageTemplates(prev => ({
      ...prev,
      commonResponses: updatedResponses,
    }));
  };
  
  // Add new common response
  const addCommonResponse = () => {
    setMessageTemplates(prev => ({
      ...prev,
      commonResponses: [...prev.commonResponses, ''],
    }));
  };
  
  // Remove common response
  const removeCommonResponse = (index: number) => {
    const updatedResponses = [...messageTemplates.commonResponses];
    updatedResponses.splice(index, 1);
    
    setMessageTemplates(prev => ({
      ...prev,
      commonResponses: updatedResponses,
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!messageTemplates.greeting.trim()) {
      newErrors.greeting = 'Greeting message is required';
    }
    
    if (!messageTemplates.missedCall.trim()) {
      newErrors.missedCall = 'Missed call message is required';
    }
    
    // Filter out empty common responses
    const filteredResponses = messageTemplates.commonResponses.filter(response => response.trim() !== '');
    setMessageTemplates(prev => ({
      ...prev,
      commonResponses: filteredResponses,
    }));
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    console.log('MessageTemplates: handleSubmit called');
    
    if (validateForm()) {
      console.log('MessageTemplates: form validation passed');
      try {
        console.log('MessageTemplates: calling updateMessageTemplates with:', messageTemplates);
        updateMessageTemplates(messageTemplates);
        console.log('MessageTemplates: updateMessageTemplates completed successfully');
        return true;
      } catch (error) {
        console.error('MessageTemplates: Error submitting message templates:', error);
        // Still return true to allow the user to continue even if there's an error
        return true;
      }
    } else {
      console.log('MessageTemplates: form validation failed');
      return false;
    }
  };
  
  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  // If loading, return null (loading state is handled by parent)
  if (isLoading) {
    return null;
  }
  
  // Industry-specific template suggestions based on the selected industry
  const getIndustrySuggestions = () => {
    const industry = progress.businessInfo.industry;
    
    switch (industry) {
      case 'automotive':
        return [
          "Your vehicle is ready for pickup! Total: $X. Questions? Reply to this message.",
          "We've diagnosed your vehicle. The issue is: [Issue]. Estimated cost: $X. Approve repairs?",
          "Just a reminder: Your appointment is tomorrow at [Time]. Reply C to confirm or R to reschedule.",
          "We have an opening for an oil change today at [Time]. Interested? Reply YES to book it.",
        ];
      case 'restaurant':
        return [
          "Your table is ready! Please come to the host stand.",
          "Your order is ready for pickup! Total: $X.",
          "Thanks for your reservation! We'll see you on [Date] at [Time]. Reply C to confirm.",
          "We have a last-minute opening tonight at [Time]. Would you like to book it? Reply YES.",
        ];
      case 'salon':
        return [
          "Just confirming your appointment tomorrow at [Time] with [Stylist]. Reply C to confirm or R to reschedule.",
          "We had a cancellation today at [Time]. Would you like to take this slot? Reply YES to book.",
          "It's been [X] weeks since your last appointment. Ready for a touch-up? Reply to book.",
          "How did you like your new style? We'd love to hear your feedback!",
        ];
      case 'healthcare':
        return [
          "Reminder: Your appointment with Dr. [Name] is tomorrow at [Time]. Reply C to confirm or R to reschedule.",
          "Your prescription is ready for pickup at our office.",
          "It's time for your annual check-up. Reply to schedule an appointment.",
          "Your lab results are in. Please call our office to discuss them.",
        ];
      default:
        return [
          "Thanks for your message! We'll get back to you within [Response Time].",
          "Just confirming your appointment for [Date] at [Time]. Reply C to confirm or R to reschedule.",
          "We've received your payment of $X. Thank you for your business!",
          "How would you rate your experience with us today? Reply with a number from 1-5.",
        ];
    }
  };
  
  const suggestions = getIndustrySuggestions();
  
  return (
    <OnboardingLayout
      title="Message Templates"
      description="Customize your automated messages to match your brand voice"
      currentStep={OnboardingStep.MESSAGE_TEMPLATES}
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="greeting">Greeting Message</Label>
          <Textarea
            id="greeting"
            name="greeting"
            value={messageTemplates.greeting}
            onChange={handleTextAreaChange}
            placeholder="Hi! Thanks for reaching out to us. How can we help you today?"
            className={`min-h-[80px] ${errors.greeting ? 'border-red-500' : ''}`}
          />
          {errors.greeting && (
            <p className="text-red-500 text-xs mt-1">{errors.greeting}</p>
          )}
          <p className="text-xs text-smarttext-slate mt-1">
            This is the first message customers will receive when they contact you
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="missedCall">Missed Call Message</Label>
          <Textarea
            id="missedCall"
            name="missedCall"
            value={messageTemplates.missedCall}
            onChange={handleTextAreaChange}
            placeholder={`Hi! Thanks for calling ${user?.businessName || '[Business Name]'}. We missed your call but will text you back ASAP.`}
            className={`min-h-[80px] ${errors.missedCall ? 'border-red-500' : ''}`}
          />
          {errors.missedCall && (
            <p className="text-red-500 text-xs mt-1">{errors.missedCall}</p>
          )}
          <p className="text-xs text-smarttext-slate mt-1">
            This message is sent automatically when you miss a call
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Common Responses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCommonResponse}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Add Response</span>
            </Button>
          </div>
          
          <div className="space-y-3">
            {messageTemplates.commonResponses.map((response, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={response}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  placeholder="Enter a common response..."
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCommonResponse(index)}
                  className="flex-shrink-0 h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            
            {messageTemplates.commonResponses.length === 0 && (
              <p className="text-sm text-smarttext-slate italic">
                No common responses added yet. Click "Add Response" to create one.
              </p>
            )}
          </div>
        </div>
        
        {/* Template suggestions */}
        <div className="space-y-4">
          <Label>Suggested Templates for Your Industry</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const updatedResponses = [...messageTemplates.commonResponses];
                  updatedResponses.push(suggestion);
                  setMessageTemplates(prev => ({
                    ...prev,
                    commonResponses: updatedResponses,
                  }));
                }}
              >
                <div className="flex items-start gap-2">
                  <Plus size={16} className="text-smarttext-primary mt-1 flex-shrink-0" />
                  <p className="text-sm">{suggestion}</p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-xs text-smarttext-slate">
            Click on a suggestion to add it to your common responses
          </p>
        </div>
        
        <StepNavigation onNext={handleSubmit} />
      </form>
    </OnboardingLayout>
  );
};

export default MessageTemplates;
