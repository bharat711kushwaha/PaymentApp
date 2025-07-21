// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isOtpVerified: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isOtpVerified: false,
  user: null,
  login: async () => false,
  logout: () => {},
  verifyOtp: async () => false,
});

// Sample user data
const demoUser = {
  id: "usr123",
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 9876543210",
};

// Auth Provider Component
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [user, setUser] = useState<typeof demoUser | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const otpVerified = localStorage.getItem('otp_verified');
    
    if (token) {
      setIsAuthenticated(true);
      
      if (otpVerified === 'true') {
        setIsOtpVerified(true);
        setUser(demoUser); // In a real app, you'd fetch user data from the token
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to verify credentials
    console.log('Login attempt with:', email, password);
    
    // For demo, we'll accept any non-empty values
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', 'demo_token');
      return true;
    }
    return false;
  };

  // Verify OTP function
  const verifyOtp = async (otp: string): Promise<boolean> => {
    // In a real app, this would verify the OTP with the backend
    console.log('OTP verification attempt with:', otp);
    
    // For demo purposes, accept any 6-digit OTP
    if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
      setIsOtpVerified(true);
      setUser(demoUser);
      localStorage.setItem('otp_verified', 'true');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setIsOtpVerified(false);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('otp_verified');
  };

  // Value object that will be passed to consumers of this context
  const contextValue: AuthContextType = {
    isAuthenticated,
    isOtpVerified,
    user,
    login,
    logout,
    verifyOtp,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;