import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { OnboardingStep, useOnboarding } from '@/hooks/use-onboarding';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import StepNavigation from '@/components/onboarding/StepNavigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BusinessInfo: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { progress, updateBusinessInfo } = useOnboarding();
  
  // Local state for form fields
  const [businessInfo, setBusinessInfo] = useState({
    name: progress.businessInfo.name || user?.businessName || '',
    industry: progress.businessInfo.industry || '',
    size: progress.businessInfo.size || '',
    website: progress.businessInfo.website || '',
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
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
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setBusinessInfo(prev => ({
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
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!businessInfo.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    
    if (!businessInfo.industry) {
      newErrors.industry = 'Please select an industry';
    }
    
    if (!businessInfo.size) {
      newErrors.size = 'Please select a business size';
    }
    
    // Website validation (optional field)
    if (businessInfo.website && !businessInfo.website.match(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      updateBusinessInfo(businessInfo);
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
  
  return (
    <OnboardingLayout
      title="Tell us about your business"
      description="This information helps us personalize your experience"
      currentStep={OnboardingStep.BUSINESS_INFO}
    >
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            name="name"
            value={businessInfo.name}
            onChange={handleChange}
            placeholder="Acme Inc."
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={businessInfo.industry}
            onValueChange={(value) => handleSelectChange('industry', value)}
          >
            <SelectTrigger id="industry" className={errors.industry ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automotive">Automotive</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="salon">Salon & Beauty</SelectItem>
              <SelectItem value="professional">Professional Services</SelectItem>
              <SelectItem value="home">Home Services</SelectItem>
              <SelectItem value="fitness">Fitness & Wellness</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">Business Size</Label>
          <Select
            value={businessInfo.size}
            onValueChange={(value) => handleSelectChange('size', value)}
          >
            <SelectTrigger id="size" className={errors.size ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your business size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo / Self-employed</SelectItem>
              <SelectItem value="2-10">Small (2-10 employees)</SelectItem>
              <SelectItem value="11-50">Medium (11-50 employees)</SelectItem>
              <SelectItem value="51-200">Large (51-200 employees)</SelectItem>
              <SelectItem value="201+">Enterprise (201+ employees)</SelectItem>
            </SelectContent>
          </Select>
          {errors.size && (
            <p className="text-red-500 text-xs mt-1">{errors.size}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            name="website"
            value={businessInfo.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className={errors.website ? 'border-red-500' : ''}
          />
          {errors.website && (
            <p className="text-red-500 text-xs mt-1">{errors.website}</p>
          )}
        </div>
        
        <StepNavigation
          onNext={() => handleSubmit()}
          isBackDisabled={true}
        />
      </form>
    </OnboardingLayout>
  );
};

export default BusinessInfo;
