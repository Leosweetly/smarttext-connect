import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { redirectToStripeCheckout } from '@/services/stripe';

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  isFirstLogin: boolean;
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

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // This would be replaced with actual API call
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: 'user-123',
        name: 'John Smith',
        email,
        businessName: 'Acme Inc.',
        isFirstLogin: false, // Existing users aren't on first login
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
      // For now, we'll simulate a successful signup
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name,
        email,
        businessName,
        isFirstLogin: true, // New users are on first login
      };

      // Store user in localStorage
      localStorage.setItem('smarttext_user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Show loading state while redirecting to Stripe
      const loadingElement = document.createElement('div');
      loadingElement.id = 'stripe-redirect-loader';
      loadingElement.style.position = 'fixed';
      loadingElement.style.top = '0';
      loadingElement.style.left = '0';
      loadingElement.style.width = '100%';
      loadingElement.style.height = '100%';
      loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingElement.style.display = 'flex';
      loadingElement.style.alignItems = 'center';
      loadingElement.style.justifyContent = 'center';
      loadingElement.style.zIndex = '9999';
      loadingElement.innerHTML = `
        <div style="text-align: center; color: white;">
          <div style="font-size: 24px; margin-bottom: 16px;">Setting up your account...</div>
          <div style="font-size: 16px;">Redirecting to payment...</div>
        </div>
      `;
      document.body.appendChild(loadingElement);
      
      // Redirect to Stripe checkout
      try {
        const baseUrl = window.location.origin;
        await redirectToStripeCheckout({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_business_pro',
          customerEmail: email,
          trialDays: 14,
          successUrl: `${baseUrl}/checkout/success`,
          cancelUrl: `${baseUrl}/checkout/cancel`,
          metadata: {
            userId: mockUser.id,
            businessName,
          },
        });
      } catch (stripeError) {
        console.error('Stripe redirect failed:', stripeError);
        // Remove loading element if there's an error
        document.body.removeChild(loadingElement);
        // Fallback to onboarding if Stripe redirect fails
        navigate('/onboarding');
        throw stripeError;
      }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth;
