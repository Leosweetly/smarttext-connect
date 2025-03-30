import { useState } from 'react';

/**
 * Custom hook for interacting with the onboarding API
 * @returns {Object} API methods and state
 */
export function useOnboardingApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  /**
   * Get onboarding data
   * @param {string} id - Business ID
   * @returns {Promise<Object>} Onboarding data
   */
  const getOnboardingData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
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
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  /**
   * Save onboarding data
   * @param {Object} data - Onboarding data to save
   * @returns {Promise<Object>} Result with success status
   */
  const saveOnboardingData = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setLoading(false);
      return {
        success: true,
        id: result.id || data.id,
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  };
  
  /**
   * Reset onboarding data
   * @returns {Promise<Object>} Result with success status
   */
  const resetOnboardingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/onboarding/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      await response.json();
      setLoading(false);
      return {
        success: true,
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return {
        success: false,
        error: err.message,
      };
    }
  };
  
  return {
    loading,
    error,
    getOnboardingData,
    saveOnboardingData,
    resetOnboardingData,
  };
}

export default useOnboardingApi;
