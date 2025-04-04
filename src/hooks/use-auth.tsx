
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  isFirstLogin: boolean;
  subscription: {
    status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | null;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
    plan: 'core' | 'pro' | 'growth' | null;
  };
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, businessName: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  refreshSubscriptionStatus: () => Promise<void>;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  completeOnboarding: () => {},
  skipOnboarding: () => {},
  refreshSubscriptionStatus: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('smarttext_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Refresh subscription status from API
  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    try {
      // This would be replaced with actual API call to get subscription details
      // For now, we'll simulate an API response
      const mockSubscriptionStatus = {
        status: 'trialing' as const,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        plan: 'pro' as const
      };

      // Update user with subscription info
      const updatedUser = {
        ...user,
        subscription: mockSubscriptionStatus
      };
      
      localStorage.setItem('smarttext_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh subscription status:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // This would be replaced with actual API call
      const mockUser: User = {
        id: 'user-123',
        name: 'John Smith',
        email,
        businessName: 'Acme Inc.',
        isFirstLogin: false,
        subscription: {
          status: 'active',
          trialEndsAt: null,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plan: 'pro'
        }
      };

      // Store user in localStorage
      localStorage.setItem('smarttext_user', JSON.stringify(mockUser));
      setUser(mockUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, businessName: string) => {
    try {
      // This would be replaced with actual API call
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name,
        email,
        businessName,
        isFirstLogin: true,
        subscription: {
          status: null,
          trialEndsAt: null,
          currentPeriodEnd: null,
          plan: null
        }
      };

      // Store user in localStorage
      localStorage.setItem('smarttext_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Redirect to checkout instead of onboarding
      const checkoutUrl = "/checkout/pro-trial";
      navigate(checkoutUrl);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('smarttext_user');
    localStorage.removeItem('onboarding_progress');
    setUser(null);
    navigate('/');
  };

  // Mark onboarding as complete
  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, isFirstLogin: false };
      localStorage.setItem('smarttext_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Skip onboarding but keep isFirstLogin true
  const skipOnboarding = () => {
    navigate('/dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        completeOnboarding,
        skipOnboarding,
        refreshSubscriptionStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
