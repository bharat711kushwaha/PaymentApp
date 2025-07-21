// components/dashboard/Dashboard.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Types for our banking application
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasActiveSession: boolean;
};

type BankingService = {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category?: string;
};

type AccountSummary = {
  id: string;
  accountNumber: string;
  balance: number;
  currency: string;
  accountType: string;
};

type TransactionSummary = {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
  category?: string;
  merchant?: string;
};

// Demo data
const bankingServices: BankingService[] = [
  {
    id: "savings",
    title: "Savings Account",
    description: "View balance, statements and manage your savings account",
    icon: "wallet",
    path: "/savings",
    category: "accounts"
  },
  {
    id: "wallet",
    title: "Airtel Wallet / SwiftWallet",
    description: "Manage your digital wallet for quick payments",
    icon: "credit-card",
    path: "/wallet",
    category: "accounts"
  },
  {
    id: "payments",
    title: "UPI/IMPS/NEFT Payments",
    description: "Transfer money using various payment methods",
    icon: "send",
    path: "/payments",
    category: "payments"
  },
  {
    id: "bills",
    title: "Recharge & Bill Payment",
    description: "Recharge mobile, pay utility bills and more",
    icon: "file-text",
    path: "/bills",
    category: "payments"
  },
  {
    id: "fastag",
    title: "FASTag Services",
    description: "Manage your FASTag for toll payments",
    icon: "car",
    path: "/fastag",
    category: "services"
  },
  {
    id: "cards",
    title: "Virtual/Debit Card Services",
    description: "Manage your cards and their settings",
    icon: "credit-card",
    path: "/cards",
    category: "services"
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Health, Cyber and Accident insurance services",
    icon: "shield",
    path: "/insurance",
    category: "investments"
  },
  {
    id: "investments",
    title: "Investments",
    description: "FD, DigiGold and APY investment options",
    icon: "trending-up",
    path: "/investments",
    category: "investments"
  }
];

// More demo data
const accountSummary: AccountSummary = {
  id: "acc123",
  accountNumber: "XXXX5678",
  balance: 45678.90,
  currency: "INR",
  accountType: "Savings"
};

const recentTransactions: TransactionSummary[] = [
  {
    id: "txn1",
    description: "Salary Credit",
    amount: 35000,
    type: "credit",
    date: new Date("2025-07-05"),
    category: "Income",
    merchant: "ABC Company Ltd"
  },
  {
    id: "txn2",
    description: "Electricity Bill",
    amount: 1250,
    type: "debit",
    date: new Date("2025-07-10"),
    category: "Utilities",
    merchant: "State Electricity Board"
  },
  {
    id: "txn3",
    description: "Grocery Shopping",
    amount: 2300,
    type: "debit",
    date: new Date("2025-07-12"),
    category: "Shopping",
    merchant: "Supermart"
  },
  {
    id: "txn4",
    description: "UPI Payment",
    amount: 500,
    type: "debit",
    date: new Date("2025-07-15"),
    category: "Others",
    merchant: "Friend"
  }
];

const upcomingBills = [
  {
    id: "bill1",
    title: "Mobile Recharge",
    amount: 499,
    dueDate: new Date("2025-07-20"),
    provider: "Airtel"
  },
  {
    id: "bill2",
    title: "Internet Bill",
    amount: 999,
    dueDate: new Date("2025-07-25"),
    provider: "JioFiber"
  },
  {
    id: "bill3",
    title: "DTH Recharge",
    amount: 399,
    dueDate: new Date("2025-07-22"),
    provider: "Tata Play"
  }
];

// Helper to format currency
const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Service Card Component
const ServiceCard = ({ service, onClick, index }: { 
  service: BankingService;
  onClick: (path: string) => void;
  index: number;
}) => {
  // Define icon map for better visuals
  const iconMap: Record<string, string> = {
    'wallet': '👛',
    'credit-card': '💳',
    'send': '📤',
    'file-text': '📄',
    'car': '🚗',
    'shield': '🛡️',
    'trending-up': '📈'
  };
  
  // For staggered animation
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div 
      style={{ animationDelay }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeIn"
      onClick={() => onClick(service.path)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="mb-3 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-xl">{iconMap[service.icon] || service.icon[0].toUpperCase()}</span>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-gray-900">{service.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{service.description}</p>
        </div>
      </div>
      <div className="mt-3 text-right">
        <span className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
          Explore &rarr;
        </span>
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ title, icon, onClick, index }: { 
  title: string;
  icon: string;
  onClick: () => void;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;
  
  return (
    <button
      style={{ animationDelay }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 animate-fadeIn group"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-indigo-100 transform transition-all duration-300 group-hover:scale-110">
        <span className="text-lg">{icon}</span>
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{title}</span>
    </button>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction, index }: { 
  transaction: TransactionSummary;
  index: number;
}) => {
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div 
      style={{ animationDelay }}
      className="flex justify-between items-center p-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg animate-fadeIn"
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
          transaction.type === 'credit' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          <span>{transaction.type === 'credit' ? '↓' : '↑'}</span>
        </div>
        <div>
          <p className="font-medium text-sm">{transaction.description}</p>
          <div className="flex items-center mt-0.5">
            <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
            {transaction.category && (
              <>
                <span className="mx-1.5 text-gray-300">•</span>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {transaction.category}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${
          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'credit' ? '+' : '-'} 
          {formatCurrency(transaction.amount)}
        </div>
        {transaction.merchant && (
          <p className="text-xs text-gray-500 mt-0.5">{transaction.merchant}</p>
        )}
      </div>
    </div>
  );
};

// Bill Item Component
const BillItem = ({ bill, index, onPay }: { 
  bill: {
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
    provider?: string;
  };
  index: number;
  onPay: (id: string) => void;
}) => {
  const animationDelay = `${index * 0.1}s`;
  const daysLeft = Math.ceil((bill.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div 
      style={{ animationDelay }}
      className="flex justify-between items-center p-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg animate-fadeIn"
    >
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
          <span>{bill.title[0]}</span>
        </div>
        <div>
          <p className="font-medium text-sm">{bill.title}</p>
          <div className="flex items-center mt-0.5">
            <p className="text-xs text-gray-500">Due {formatDate(bill.dueDate)}</p>
            {daysLeft <= 3 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full animate-pulse">
                {daysLeft === 0 ? 'Today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </span>
            )}
          </div>
          {bill.provider && <p className="text-xs text-gray-500 mt-0.5">{bill.provider}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-medium">{formatCurrency(bill.amount)}</div>
        <button 
          className="mt-1.5 px-3 py-1 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
          onClick={() => onPay(bill.id)}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for animation
  const welcomeRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply animations when component mounts
  useEffect(() => {
    if (!isLoading) {
      if (welcomeRef.current) {
        welcomeRef.current.classList.add('animate-fadeIn');
      }
      if (balanceRef.current) {
        setTimeout(() => {
          balanceRef.current?.classList.add('animate-fadeIn');
        }, 200);
      }
    }
  }, [isLoading]);
  
  // Filter services by category or show all if no category is selected
  const filteredServices = selectedCategory 
    ? bankingServices.filter(service => service.category === selectedCategory) 
    : bankingServices;
  
  // Calculate total income/expense for this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = recentTransactions.filter(
    txn => txn.date.getMonth() === currentMonth && txn.date.getFullYear() === currentYear
  );
  
  const totalIncome = monthlyTransactions
    .filter(txn => txn.type === 'credit')
    .reduce((sum, txn) => sum + txn.amount, 0);
    
  const totalExpense = monthlyTransactions
    .filter(txn => txn.type === 'debit')
    .reduce((sum, txn) => sum + txn.amount, 0);
  
  const handleServiceClick = (path: string) => {
    navigate(path);
  };
  
  const handleBillPayment = (billId: string) => {
    navigate(`/bills/pay/${billId}`);
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 md:p-6 animate-pulse">
        {/* Welcome Skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Balance Card Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="w-1/3 flex space-x-2">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-auto p-4 md:p-6">
      {/* Welcome Section */}
      <div ref={welcomeRef} className="mb-8 opacity-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.name.split(' ')[0] || 'User'}!
        </h2>
        <p className="text-gray-600">
          Here's a summary of your accounts and recent activity
        </p>
      </div>
      
      {/* Balance Card */}
      <div ref={balanceRef} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 opacity-0 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4 shadow-md hidden sm:flex">
                ₹
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {accountSummary.accountType} Account ({accountSummary.accountNumber})
                </p>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(accountSummary.balance, accountSummary.currency)}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Available Balance
                </p>
              </div>
            </div>
            
            <div className="flex mt-4 space-x-4 sm:mt-6">
              <div>
                <span className="text-xs text-green-600 font-medium">Income this month</span>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="pl-4 border-l border-gray-200">
                <span className="text-xs text-red-600 font-medium">Expenses this month</span>
                <p className="text-lg font-semibold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all hover:shadow-md flex items-center justify-center"
              onClick={() => handleServiceClick('/payments')}
            >
              <span className="mr-1.5">↗️</span> Transfer Money
            </button>
            <button 
              className="px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 border border-gray-300 transition-all flex items-center justify-center"
              onClick={() => handleServiceClick('/savings')}
            >
              <span className="mr-1.5">📊</span> View Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center animate-fadeIn">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <QuickActionButton 
            title="Send Money" 
            icon="↗️" 
            onClick={() => handleServiceClick('/payments')}
            index={0}
          />
          <QuickActionButton 
            title="Receive" 
            icon="↙️" 
            onClick={() => handleServiceClick('/payments/receive')} 
            index={1}
          />
          <QuickActionButton 
            title="Pay Bills" 
            icon="📄" 
            onClick={() => handleServiceClick('/bills')} 
            index={2}
          />
          <QuickActionButton 
            title="Recharge" 
            icon="📱" 
            onClick={() => handleServiceClick('/bills/recharge')} 
            index={3}
          />
          <QuickActionButton 
            title="Cards" 
            icon="💳" 
            onClick={() => handleServiceClick('/cards')} 
            index={4}
          />
          <QuickActionButton 
            title="FASTag" 
            icon="🚗" 
            onClick={() => handleServiceClick('/fastag')} 
            index={5}
          />
          <QuickActionButton 
            title="Rewards" 
            icon="🎁" 
            onClick={() => handleServiceClick('/rewards')} 
            index={6}
          />
          <QuickActionButton 
            title="Support" 
            icon="❓" 
            onClick={() => handleServiceClick('/support')} 
            index={7}
          />
        </div>
      </div>
      
      {/* Services */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center animate-fadeIn">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">🏦</span>
            Banking Services
          </h3>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center ${
                selectedCategory === null 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">🔍</span> All
            </button>
            <button 
              onClick={() => setSelectedCategory('accounts')}
              className={`px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center ${
                selectedCategory === 'accounts' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">💰</span> Accounts
            </button>
            <button 
              onClick={() => setSelectedCategory('payments')}
              className={`px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center ${
                selectedCategory === 'payments' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">💸</span> Payments
            </button>
            <button 
              onClick={() => setSelectedCategory('investments')}
              className={`px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 flex items-center ${
                selectedCategory === 'investments' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">📈</span> Investments
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onClick={handleServiceClick} 
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Activity Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center animate-fadeIn">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">📊</span>
          Recent Activity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <button 
                onClick={() => handleServiceClick('/savings')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All <span className="ml-1">→</span>
              </button>
            </div>
            
            <div className="p-3">
              {recentTransactions.map((transaction, index) => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          {/* Upcoming Bills */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Upcoming Bills</h3>
              <button 
                onClick={() => handleServiceClick('/bills')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All <span className="ml-1">→</span>
              </button>
            </div>
            
            <div className="p-3">
              {upcomingBills.map((bill, index) => (
                <BillItem 
                  key={bill.id} 
                  bill={bill}
                  index={index}
                  onPay={handleBillPayment}
                />
              ))}
              
              {upcomingBills.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <div className="text-3xl mb-2">🎉</div>
                  <p>No upcoming bills</p>
                  <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Offers Banner */}
      <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Exclusive Limited Time Offer!</h3>
              <p className="text-blue-100">Get 5% cashback on all UPI transactions above ₹1,000</p>
              <p className="text-xs text-blue-200 mt-1">Valid till 31st July, 2025</p>
            </div>
            <button 
              onClick={() => handleServiceClick('/offers')}
              className="bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg text-sm"
            >
              View Offer
            </button>
          </div>
        </div>
      </div>

      {/* Tailwind Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}