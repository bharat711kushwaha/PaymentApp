// src/components/auth/OtpVerification.tsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const OtpVerification = () => {
  const navigate = useNavigate();
  const { verifyOtp, logout } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minute countdown
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Setup countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  // Format timer as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle input change for OTP digits
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digits
    if (value && !/^\d+$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when typing
    if (error) setError('');
    
    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key press - for backspace and deletion
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if it's a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  // Submit OTP for verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all digits are filled
    if (otp.some(digit => !digit)) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const otpString = otp.join('');
      const success = await verifyOtp(otpString);
      
      if (success) {
        // Navigate to dashboard on success
        navigate('/');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle cancel/logout
  const handleCancel = () => {
    logout();
    navigate('/login');
  };
  
  // Handle resend OTP
  const handleResend = () => {
    // Reset OTP fields
    setOtp(['', '', '', '', '', '']);
    setError('');
    // Reset timer
    setTimer(120);
    // Focus first input
    inputRefs.current[0]?.focus();
    
    // Here you would call the API to resend OTP
    // For demo, we'll just show a success message
    setTimeout(() => {
      alert('New OTP sent successfully!');
    }, 1000);
  };

  // Check if OTP is complete
  const isOtpComplete = otp.every(digit => digit !== '');

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
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Verify Your Identity
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent a 6-digit verification code to your registered mobile number. 
              Enter the code below to continue.
            </p>
          </div>

          {/* OTP Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-fadeInUp">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Timer Display */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-3">
                  <div className={`text-2xl font-bold ${timer <= 30 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatTime()}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {timer > 0 ? 'Code expires in' : 'Code expired'}
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                        error 
                          ? 'border-red-300 bg-red-50' 
                          : focusedIndex === index
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-110'
                            : digit 
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                      } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                      disabled={isLoading || timer === 0}
                    />
                    {digit && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm text-gray-600">{otp.filter(d => d).length}/6</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(otp.filter(d => d).length / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-shake mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || !isOtpComplete || timer === 0}
                  className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform ${
                    isLoading || !isOtpComplete || timer === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">🔓</span>
                      Verify & Continue
                    </span>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-medium text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">←</span>
                    Back to Login
                  </span>
                </button>
              </div>
            </form>
            
            {/* Resend Section */}
            <div className="mt-6 text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-700 mb-2">Didn't receive the code?</p>
              {timer > 0 ? (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Resend available in {formatTime()}</span>
                </p>
              ) : (
                <button 
                  onClick={handleResend}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span className="mr-2">📱</span>
                  Resend Code
                </button>
              )}
            </div>

            {/* Security Info */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <span className="mr-1">🔐</span>
              Your verification is protected with bank-grade security
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
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OtpVerification;