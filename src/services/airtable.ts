// This service handles communication with the backend API for Airtable operations

import { OnboardingProgress } from '@/hooks/use-onboarding';

// Interface for business data to be saved to Airtable
interface BusinessData {
  id?: string;
  name: string;
  industry: string;
  size: string;
  website?: string;
  phone?: string;
  businessHours?: Record<string, { open: string; close: string; closed: boolean }>;
  responseTime?: string;
  templates?: {
    greeting?: string;
    missedCall?: string;
    commonResponses?: string[];
  };
}

// Function to save business data to Airtable via backend API
export const saveBusinessToAirtable = async (data: BusinessData): Promise<{ success: boolean; id?: string }> => {
  try {
    console.log('airtable.ts: saveBusinessToAirtable called with:', data);
    
    // Get record ID from localStorage if it exists
    const recordId = localStorage.getItem('airtable_business_id');
    console.log('airtable.ts: recordId from localStorage:', recordId);
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const apiUrl = `${baseUrl}/api/update-business-info`;
    console.log('airtable.ts: sending data to API at:', apiUrl);
    
    // Prepare request data
    const requestData = {
      name: data.name,
      industry: data.industry,
      size: data.size,
      website: data.website || '',
      recordId: recordId || data.id,
    };
    
    console.log('airtable.ts: request data:', requestData);
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    console.log('airtable.ts: API response status:', response.status);
    
    // Parse the response
    const result = await response.json();
    console.log('airtable.ts: API response data:', result);
    
    if (!response.ok) {
      console.error('airtable.ts: API error:', result.error || 'Unknown error');
      
      if (result.debug) {
        console.error('airtable.ts: API error details:', result.debug);
      }
      
      throw new Error(result.error || `API error: ${response.status}`);
    }
    
    // Save record ID to localStorage
    if (result.id) {
      localStorage.setItem('airtable_business_id', result.id);
      console.log('airtable.ts: saved recordId to localStorage:', result.id);
    }
    
    return {
      success: true,
      id: result.id || data.id,
    };
  } catch (error: any) {
    console.error('airtable.ts: Error saving business data to Airtable:', error.message || error);
    return {
      success: false,
    };
  }
};

// Function to convert onboarding progress to business data
export const onboardingToBusinessData = (progress: OnboardingProgress): BusinessData => {
  return {
    name: progress.businessInfo.name,
    industry: progress.businessInfo.industry,
    size: progress.businessInfo.size,
    website: progress.businessInfo.website,
    phone: progress.communicationSetup.phone,
    businessHours: progress.communicationSetup.businessHours,
    responseTime: progress.communicationSetup.responseTime,
    templates: {
      greeting: progress.messageTemplates.greeting,
      missedCall: progress.messageTemplates.missedCall,
      commonResponses: progress.messageTemplates.commonResponses,
    },
  };
};

// Function to get business data from Airtable via backend API
export const getBusinessFromAirtable = async (id: string): Promise<BusinessData | null> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/onboarding?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting business data from Airtable:', error);
    return null;
  }
};

// Function to reset business onboarding data via backend API
export const resetBusinessOnboarding = async (): Promise<{ success: boolean }> => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/onboarding/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error resetting business onboarding:', error);
    return {
      success: false,
    };
  }
};
