import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

const CommunicationSetup: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { progress, updateCommunicationSetup } = useOnboarding();
  
  // Local state for form fields
  const [communicationSetup, setCommunicationSetup] = useState({
    phone: progress.communicationSetup.phone || '',
    businessHours: { ...progress.communicationSetup.businessHours },
    responseTime: progress.communicationSetup.responseTime || '1 hour',
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    // Format phone number as (XXX) XXX-XXXX
    let formattedPhone = value.replace(/\D/g, '');
    if (formattedPhone.length > 0) {
      formattedPhone = formattedPhone.substring(0, 10);
      const matches = formattedPhone.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (matches) {
        formattedPhone = '';
        if (matches[1]) {
          formattedPhone = `(${matches[1]}`;
        }
        if (matches[2]) {
          formattedPhone += `) ${matches[2]}`;
        }
        if (matches[3]) {
          formattedPhone += `-${matches[3]}`;
        }
      }
    }
    
    setCommunicationSetup(prev => ({
      ...prev,
      phone: formattedPhone,
    }));
    
    // Clear error when field is edited
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: '',
      }));
    }
  };
  
  // Handle business hours change
  const handleHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    setCommunicationSetup(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value,
        },
      },
    }));
  };
  
  // Handle closed day toggle
  const handleClosedToggle = (day: string, value: boolean) => {
    setCommunicationSetup(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          closed: value,
        },
      },
    }));
  };
  
  // Handle response time change
  const handleResponseTimeChange = (value: string) => {
    setCommunicationSetup(prev => ({
      ...prev,
      responseTime: value,
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Phone validation (must be in format (XXX) XXX-XXXX)
    if (!communicationSetup.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(communicationSetup.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      updateCommunicationSetup(communicationSetup);
      return true;
    }
    return false;
  };
  
  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  // If loading, return null (loading state is handled by parent)
  if (isLoading) {
    return null;
  }
  
  // Days of the week
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];
  
  // Time options (30-minute intervals)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      timeOptions.push(`${h}:${m}`);
    }
  }
  
  return (
    <OnboardingLayout
      title="Communication Setup"
      description="Configure your business hours and response preferences"
      currentStep={OnboardingStep.COMMUNICATION_SETUP}
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Business Phone Number</Label>
          <Input
            id="phone"
            value={communicationSetup.phone}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-smarttext-slate mt-1">
            This is the number customers will see when you contact them
          </p>
        </div>
        
        <div className="space-y-4">
          <Label>Business Hours</Label>
          <Card className="p-4">
            <div className="space-y-4">
              {days.map((day) => {
                const dayKey = day.id as keyof typeof communicationSetup.businessHours;
                const dayData = communicationSetup.businessHours[dayKey];
                
                return (
                  <div key={day.id} className="flex items-center space-x-4">
                    <div className="w-28">
                      <span className="text-sm font-medium">{day.label}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={!dayData.closed}
                        onCheckedChange={(checked) => handleClosedToggle(day.id, !checked)}
                      />
                      <span className="text-sm text-smarttext-slate">
                        {dayData.closed ? 'Closed' : 'Open'}
                      </span>
                    </div>
                    
                    {!dayData.closed && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={dayData.open}
                            onValueChange={(value) => handleHoursChange(day.id, 'open', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Open" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={`${day.id}-open-${time}`} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <span className="text-sm">to</span>
                          
                          <Select
                            value={dayData.close}
                            onValueChange={(value) => handleHoursChange(day.id, 'close', value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Close" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={`${day.id}-close-${time}`} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responseTime">Expected Response Time</Label>
          <Select
            value={communicationSetup.responseTime}
            onValueChange={handleResponseTimeChange}
          >
            <SelectTrigger id="responseTime">
              <SelectValue placeholder="Select response time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 minutes">Within 15 minutes</SelectItem>
              <SelectItem value="30 minutes">Within 30 minutes</SelectItem>
              <SelectItem value="1 hour">Within 1 hour</SelectItem>
              <SelectItem value="2 hours">Within 2 hours</SelectItem>
              <SelectItem value="same day">Same day</SelectItem>
              <SelectItem value="next business day">Next business day</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-smarttext-slate mt-1">
            This helps set customer expectations for your response time
          </p>
        </div>
        
        <StepNavigation onNext={() => handleSubmit()} />
      </form>
    </OnboardingLayout>
  );
};

export default CommunicationSetup;
