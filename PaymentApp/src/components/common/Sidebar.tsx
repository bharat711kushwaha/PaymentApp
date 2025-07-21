// src/components/common/Sidebar.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Icons would be imported from lucide-react in a real implementation
// import { Home, CreditCard, Send, FileText, Car, Shield, TrendingUp, Gift, Users, HelpCircle, LogOut } from 'lucide-react';

interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  category?: string; // Optional category for grouping
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', title: 'Dashboard', path: '/', icon: 'home', category: 'main' },
  { id: 'savings', title: 'Savings Account', path: '/savings', icon: 'wallet', category: 'accounts' },
  { id: 'wallet', title: 'Airtel Wallet', path: '/wallet', icon: 'credit-card', category: 'accounts' },
  { id: 'payments', title: 'UPI/IMPS/NEFT', path: '/payments', icon: 'send', category: 'payments' },
  { id: 'bills', title: 'Bill Payment', path: '/bills', icon: 'file-text', category: 'payments' },
  { id: 'fastag', title: 'FASTag Services', path: '/fastag', icon: 'car', category: 'services' },
  { id: 'cards', title: 'Card Services', path: '/cards', icon: 'credit-card', category: 'services' },
  { id: 'insurance', title: 'Insurance', path: '/insurance', icon: 'shield', category: 'investments' },
  { id: 'investments', title: 'Investments', path: '/investments', icon: 'trending-up', category: 'investments' },
  { id: 'rewards', title: 'Rewards', path: '/rewards', icon: 'gift', category: 'more' },
  { id: 'aeps', title: 'Agent Banking', path: '/aeps', icon: 'users', category: 'more' },
  { id: 'support', title: 'Support', path: '/support', icon: 'help-circle', category: 'more' },
];

// Group sidebar items by category
const groupedItems = sidebarItems.reduce((acc, item) => {
  const category = item.category || 'other';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item);
  return acc;
}, {} as Record<string, SidebarItem[]>);

// Category titles mapping
const categoryTitles: Record<string, string> = {
  main: 'Main',
  accounts: 'Accounts',
  payments: 'Payments',
  services: 'Services',
  investments: 'Investments & Insurance',
  more: 'More Options'
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to render icon - in a real implementation we would use the lucide-react icons
  const renderIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'home': '🏠',
      'wallet': '👛',
      'credit-card': '💳',
      'send': '📤',
      'file-text': '📄',
      'car': '🚗',
      'shield': '🛡️',
      'trending-up': '📈',
      'gift': '🎁',
      'users': '👥',
      'help-circle': '❓',
      'log-out': '🚪'
    };
    
    return (
      <div className="w-5 h-5 flex items-center justify-center text-lg">
        {iconMap[iconName] || iconName[0].toUpperCase()}
      </div>
    );
  };

  // Determine sidebar classes based on state
  const sidebarClasses = `
    fixed md:static top-0 left-0 h-full
    bg-white border-r border-gray-200 
    transition-all duration-300 ease-in-out z-20
    ${collapsed ? 'w-20' : 'w-72'} 
    ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0') : ''}
  `;

  // Overlay for mobile when sidebar is open
  const renderOverlay = () => {
    if (isMobile && mobileOpen) {
      return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      );
    }
    return null;
  };

  return (
    <>
      {renderOverlay()}
      
      {/* Mobile toggle button - visible only on mobile when sidebar is closed */}
      {isMobile && !mobileOpen && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-10 md:hidden p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Open menu"
        >
          ☰
        </button>
      )}
      
      <aside className={sidebarClasses}>
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!collapsed && (
              <h2 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Banking App
              </h2>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>
          
          {/* User Profile */}
          {user && (
            <div className={`p-4 border-b border-gray-200 ${collapsed ? 'flex justify-center' : ''}`}>
              <div className={`flex items-center ${collapsed ? 'flex-col' : 'space-x-3'}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
                {!collapsed && (
                  <div className="mt-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {Object.keys(groupedItems).map((category) => (
              <div key={category} className="mb-4">
                {!collapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                    {categoryTitles[category] || category}
                  </h3>
                )}
                <ul className="space-y-1">
                  {groupedItems[category].map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`w-full text-left rounded-lg px-4 py-2.5 flex items-center 
                            ${collapsed ? 'justify-center' : 'space-x-3'} 
                            group transition-all duration-200
                            ${isActive 
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          <span className={`
                            ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'} 
                            transition-colors duration-200
                          `}>
                            {renderIcon(item.icon)}
                          </span>
                          {!collapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                          {isActive && !collapsed && (
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full ml-auto"></span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          
          {/* Logout Button */}
          <div className={`p-4 border-t border-gray-200 ${collapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} 
                w-full px-4 py-2.5 text-sm text-gray-700 rounded-lg
                hover:bg-red-50 hover:text-red-600 transition-colors duration-200
              `}
              aria-label="Logout"
            >
              <span className="text-gray-500">{renderIcon('log-out')}</span>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;