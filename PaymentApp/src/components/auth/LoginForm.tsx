// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    
    // Simple validation - allow either email or mobile number
    if (!formData.email) {
      newErrors.email = 'Email or mobile number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const success = await login(formData.email, formData.password);
        
        if (success) {
          // Navigate to OTP verification page
          navigate('/verify-otp');
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
      } catch (error) {
        setErrors({ general: 'An error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">₹</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Banking App
            </h1>
            <p className="text-gray-600 text-sm">Welcome back! Please sign in to continue</p>
          </div>
          
          {/* Login Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-fadeInUp">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-shake">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Email/Mobile Input */}
              <div className="relative">
                <label 
                  htmlFor="email" 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedInput === 'email' || formData.email
                      ? '-top-2 left-3 text-xs bg-white px-1 text-blue-600 font-medium'
                      : 'top-4 text-gray-500'
                  }`}
                >
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : focusedInput === 'email'
                          ? 'border-blue-500 focus:border-blue-600 focus:ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300'
                    } focus:outline-none focus:ring-4`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                    <span className="mr-1">❌</span>
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password Input */}
              <div className="relative">
                <label 
                  htmlFor="password" 
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                    focusedInput === 'password' || formData.password
                      ? '-top-2 left-3 text-xs bg-white px-1 text-blue-600 font-medium'
                      : 'top-4 text-gray-500'
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : focusedInput === 'password'
                          ? 'border-blue-500 focus:border-blue-600 focus:ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300'
                    } focus:outline-none focus:ring-4`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                    <span className="mr-1">❌</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 ${
                      formData.remember 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {formData.remember && (
                        <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                    Remember me
                  </span>
                </label>
                
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Sign In
                  </span>
                )}
              </button>
            </form>
            
            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                  Create Account
                </button>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <span className="mr-1">🔐</span>
              Secured with 256-bit SSL encryption
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <p>© 2025 Banking App. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;