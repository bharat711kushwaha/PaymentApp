// src/components/common/Header.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  title?: string; // Optional title, will be derived from path if not provided
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Animations on mount
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fadeIn');
    }
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-notification-toggle]')
      ) {
        setShowNotifications(false);
      }
      
      if (
        profileRef.current && 
        !profileRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-profile-toggle]')
      ) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset dropdowns on route change
  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location.pathname]);
  
  // Generate title from path if not provided
  const getPageTitle = () => {
    if (title) return title;
    
    // Extract page name from route
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    
    // Convert path to title (e.g., /savings => Savings)
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'Payment Successful', description: 'Your bill payment of ₹1,250 was successful.', time: '10 min ago', read: false },
    { id: 2, title: 'Offer Available', description: 'New cashback offer on UPI payments.', time: '2 hours ago', read: false },
    { id: 3, title: 'Account Statement', description: 'Your monthly account statement is ready.', time: '1 day ago', read: true },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-10 bg-white border-b border-gray-200 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Page Title with Animation */}
          <div className="flex items-center">
            <h1 
              ref={titleRef}
              className="text-xl font-bold text-gray-800 transition-all duration-500"
            >
              {getPageTitle()}
            </h1>
            
            {/* Breadcrumb - shown on paths other than home */}
            {location.pathname !== '/' && (
              <div className="hidden md:flex items-center ml-4 text-sm text-gray-500">
                <span className="hover:text-blue-600 transition-colors">Home</span>
                <span className="mx-2">/</span>
                <span className="text-blue-600 font-medium">{getPageTitle()}</span>
              </div>
            )}
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors">
              <span className="text-gray-500 mr-2">🔍</span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-32 lg:w-48"
              />
            </div>
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                data-notification-toggle
                className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div 
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-fadeInDown"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-2 ${
                              notification.read ? 'border-transparent' : 'border-blue-500'
                            }`}
                          >
                            <div className="flex justify-between">
                              <p className={`font-medium text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-gray-500">
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            {user && (
              <div className="relative">
                <button 
                  data-profile-toggle
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-full py-1 pl-1 pr-2 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-transform hover:scale-105">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium hidden md:inline">{user.name.split(' ')[0]}</span>
                  <span className="hidden md:inline text-gray-500">▼</span>
                </button>
                
                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div 
                    ref={profileRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-fadeInDown"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <span className="mr-2">👤</span> My Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <span className="mr-2">⚙️</span> Account Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <span className="mr-2">🔒</span> Privacy & Security
                      </button>
                    </div>
                    
                    <div className="py-1 border-t border-gray-100">
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                        <span className="mr-2">🚪</span> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* More Options Button (Mobile only) */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              ⋮
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Tailwind animation keyframes in a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </header>
  );
};

export default Header;