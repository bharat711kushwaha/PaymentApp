// components/accounts/SavingsAccount.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Types
interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  isActive: boolean;
  branch: string;
  ifscCode: string;
  createdAt: Date;
  lastUpdated: Date;
  interestRate?: number;
  minBalance?: number;
}

interface Transaction {
  id: string;
  txnId: string;
  accountId: string;
  amount: number;
  type: "credit" | "debit";
  status: string;
  description: string;
  category: string;
  paymentMethod: string;
  timestamp: Date;
  reference: string;
  merchant?: string;
  iconType?: string;
}

interface Statement {
  id: string;
  accountId: string;
  period: string;
  downloadUrl: string;
  generatedAt: Date;
  fileSize?: string;
}

// Sample demo data for a savings account
const demoAccount: Account = {
  id: "acc12345",
  accountNumber: "1234567890",
  accountType: "savings",
  balance: 45678.90,
  currency: "INR",
  isActive: true,
  branch: "Akola Main Branch",
  ifscCode: "BANK0001234",
  createdAt: new Date("2020-05-15"),
  lastUpdated: new Date("2025-07-01"),
  interestRate: 3.5,
  minBalance: 5000
};

// Sample transactions with more details
const demoTransactions: Transaction[] = [
  {
    id: "txn001",
    txnId: "TXN12345678",
    accountId: "acc12345",
    amount: 35000,
    type: "credit",
    status: "completed",
    description: "Salary Credit",
    category: "Income",
    paymentMethod: "NEFT",
    timestamp: new Date("2025-07-05T10:30:00"),
    reference: "NEFT-SAL-JUL2025",
    merchant: "ABC Company Ltd",
    iconType: "salary"
  },
  {
    id: "txn002",
    txnId: "TXN12345679",
    accountId: "acc12345",
    amount: 1200,
    type: "debit",
    status: "completed",
    description: "Electricity Bill Payment",
    category: "Utilities",
    paymentMethod: "UPI",
    timestamp: new Date("2025-07-10T15:45:00"),
    reference: "UPI/123456789012/ELECTBILL",
    merchant: "State Electricity Board",
    iconType: "utility"
  },
  {
    id: "txn003",
    txnId: "TXN12345680",
    accountId: "acc12345",
    amount: 3500,
    type: "debit",
    status: "completed",
    description: "Rent Payment",
    category: "Housing",
    paymentMethod: "IMPS",
    timestamp: new Date("2025-07-02T09:15:00"),
    reference: "IMPS/123456/RENT-JUL",
    merchant: "Property Owner",
    iconType: "house"
  },
  {
    id: "txn004",
    txnId: "TXN12345681",
    accountId: "acc12345",
    amount: 850,
    type: "debit",
    status: "completed",
    description: "Grocery Shopping",
    category: "Food",
    paymentMethod: "UPI",
    timestamp: new Date("2025-07-08T18:20:00"),
    reference: "UPI/123456789012/GROCERY",
    merchant: "Supermart",
    iconType: "shopping"
  },
  {
    id: "txn005",
    txnId: "TXN12345682",
    accountId: "acc12345",
    amount: 2000,
    type: "credit",
    status: "completed",
    description: "Refund from Amazon",
    category: "Refund",
    paymentMethod: "NEFT",
    timestamp: new Date("2025-07-12T14:10:00"),
    reference: "NEFT-REFUND-AMZN",
    merchant: "Amazon",
    iconType: "shopping"
  },
  {
    id: "txn006",
    txnId: "TXN12345683",
    accountId: "acc12345",
    amount: 3000,
    type: "credit",
    status: "completed",
    description: "Interest Credit",
    category: "Interest",
    paymentMethod: "Internal",
    timestamp: new Date("2025-07-01T00:01:00"),
    reference: "INT-CREDIT-JUN2025",
    merchant: "Bank",
    iconType: "bank"
  },
  {
    id: "txn007",
    txnId: "TXN12345684",
    accountId: "acc12345",
    amount: 1500,
    type: "debit",
    status: "completed",
    description: "Mobile Bill Payment",
    category: "Utilities",
    paymentMethod: "Auto-Debit",
    timestamp: new Date("2025-07-03T08:30:00"),
    reference: "AUTO/MOBILL/JUL2025",
    merchant: "Airtel",
    iconType: "phone"
  },
];

// Sample statements with file sizes
const demoStatements: Statement[] = [
  {
    id: "stmt001",
    accountId: "acc12345",
    period: "June 2025",
    downloadUrl: "#",
    generatedAt: new Date("2025-07-01T00:05:00"),
    fileSize: "412 KB"
  },
  {
    id: "stmt002",
    accountId: "acc12345",
    period: "May 2025",
    downloadUrl: "#",
    generatedAt: new Date("2025-06-01T00:10:00"),
    fileSize: "386 KB"
  },
  {
    id: "stmt003",
    accountId: "acc12345",
    period: "April 2025",
    downloadUrl: "#",
    generatedAt: new Date("2025-05-01T00:07:00"),
    fileSize: "405 KB"
  },
  {
    id: "stmt004",
    accountId: "acc12345",
    period: "March 2025",
    downloadUrl: "#",
    generatedAt: new Date("2025-04-01T00:03:00"),
    fileSize: "378 KB"
  },
  {
    id: "stmt005",
    accountId: "acc12345",
    period: "February 2025",
    downloadUrl: "#",
    generatedAt: new Date("2025-03-01T00:08:00"),
    fileSize: "352 KB"
  },
];

// Simulate monthly account balances for the chart
const monthlyBalances = [
  { month: "Jan", balance: 32500 },
  { month: "Feb", balance: 34200 },
  { month: "Mar", balance: 36800 },
  { month: "Apr", balance: 38500 },
  { month: "May", balance: 41200 },
  { month: "Jun", balance: 43500 },
  { month: "Jul", balance: demoAccount.balance },
];

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper function to format date
const formatDate = (date: Date, includeTime: boolean = true) => {
  if (includeTime) {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Transaction category icons
const getCategoryIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    salary: '💼',
    income: '💰',
    utility: '💡',
    house: '🏠',
    shopping: '🛒',
    food: '🍔',
    bank: '🏦',
    phone: '📱',
    refund: '⬅️',
    transfer: '↔️',
    transport: '🚗',
    entertainment: '🎬',
    health: '⚕️',
    education: '🎓',
    default: '💸'
  };
  
  return iconMap[type] || iconMap.default;
};

// Transaction card component
const TransactionCard = ({ transaction, index }: { transaction: Transaction; index: number }) => {
  const animationDelay = `${index * 0.05}s`;
  const icon = getCategoryIcon(transaction.iconType || 'default');
  
  return (
    <div 
      style={{ animationDelay }}
      className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-all duration-200 animate-fadeIn"
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
          transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatDate(transaction.timestamp)}</span>
            <span className="mx-1">•</span>
            <span>{transaction.paymentMethod}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'credit' ? '+' : '-'} 
          {formatCurrency(transaction.amount, demoAccount.currency)}
        </div>
        <p className="text-xs text-gray-500">
          {transaction.merchant}
        </p>
      </div>
    </div>
  );
};

// Chart component
const BalanceChart = () => {
  // In a real app, you'd use a library like Recharts, Chart.js, or D3
  // This is a simplified chart for demonstration
  const maxBalance = Math.max(...monthlyBalances.map(item => item.balance));
  
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h4 className="font-medium text-gray-800 mb-4">Account Balance History</h4>
      <div className="h-60 flex items-end space-x-2">
        {monthlyBalances.map((item, index) => {
          const height = `${(item.balance / maxBalance) * 100}%`;
          const delay = `${index * 0.1}s`;
          
          return (
            <div 
              key={item.month} 
              className="flex-1 flex flex-col items-center" 
              style={{ height: '100%' }}
            >
              <div 
                className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-all duration-300 relative group"
                style={{ height, animationDelay: delay }}
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {formatCurrency(item.balance)}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Statements table component
const StatementsTable = ({ statements }: { statements: Statement[] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Generated On
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {statements.map((statement, index) => {
            const animationDelay = `${index * 0.05}s`;
            
            return (
              <tr 
                key={statement.id} 
                className="hover:bg-gray-50 animate-fadeIn"
                style={{ animationDelay }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {statement.period}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(statement.generatedAt, false)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {statement.fileSize}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                    <span className="mr-1">👁️</span> View
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                    <span className="mr-1">⬇️</span> Download
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Transactions table with filters
const TransactionsTable = ({ 
  transactions, 
  onFilterChange 
}: { 
  transactions: Transaction[]; 
  onFilterChange: (filters: any) => void;
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('30days');
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    onFilterChange({ type: e.target.value, date: dateFilter });
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
    onFilterChange({ type: typeFilter, date: e.target.value });
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
          <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <select 
              className="text-sm border rounded-md px-3 py-1.5 bg-white"
              value={typeFilter}
              onChange={handleTypeChange}
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
            <select 
              className="text-sm border rounded-md px-3 py-1.5 bg-white"
              value={dateFilter}
              onChange={handleDateChange}
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors hidden sm:inline-block">
              <span className="mr-1">🔍</span> Search
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => {
              const animationDelay = `${index * 0.05}s`;
              
              return (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-gray-50 animate-fadeIn cursor-pointer"
                  style={{ animationDelay }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <span>{getCategoryIcon(transaction.iconType || 'default')}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.merchant}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {transaction.reference}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? '+' : '-'} 
                      {formatCurrency(transaction.amount, demoAccount.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{transactions.length}</span> transactions
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Account insights component
const AccountInsights = ({ account }: { account: Account }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
            <span>💰</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-xl font-bold">{account.interestRate}%</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Interest is calculated daily and credited monthly
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
            <span>📅</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Age</p>
            <p className="text-xl font-bold">{Math.floor((new Date().getTime() - account.createdAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Account opened on {formatDate(account.createdAt, false)}
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
            <span>⚠️</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Minimum Balance</p>
            <p className="text-xl font-bold">{formatCurrency(account.minBalance || 0, account.currency)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Maintain this balance to avoid charges
        </p>
      </div>
    </div>
  );
};

// Main Savings Account Component
export default function SavingsAccount() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'statements'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<Account>(demoAccount);
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [statements, setStatements] = useState<Statement[]>(demoStatements);
  const [filters, setFilters] = useState({ type: 'all', date: '30days' });
  
  const accountCardRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
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
      if (accountCardRef.current) {
        accountCardRef.current.classList.add('animate-fadeIn');
      }
      if (tabsRef.current) {
        setTimeout(() => {
          tabsRef.current?.classList.add('animate-fadeIn');
        }, 200);
      }
    }
  }, [isLoading]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // In a real app, this would make an API call with the filters
    // Here we'll just simulate filtering the transactions
    let filtered = [...demoTransactions];
    
    if (newFilters.type !== 'all') {
      filtered = filtered.filter(t => t.type === newFilters.type);
    }
    
    // Apply date filter
    const now = new Date();
    if (newFilters.date === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => t.timestamp >= thirtyDaysAgo);
    } else if (newFilters.date === '90days') {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => t.timestamp >= ninetyDaysAgo);
    }
    
    setTransactions(filtered);
  };
  
  const handleTransferMoney = () => {
    navigate('/payments', { state: { sourceAccount: account.id } });
  };
  
  const handleDownloadStatement = () => {
    // In a real app, this would trigger a download
    alert('Statement download started.');
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="w-1/2">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-8 bg-gray-200 rounded w-36 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 h-10 bg-gray-200 rounded"></div>
        
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Savings Account Management</h1>
        <p className="text-gray-600">Manage your savings account, view transactions and statements</p>
      </div>
      
      {/* Account Overview Card */}
      <div 
        ref={accountCardRef} 
        className="bg-white rounded-xl shadow-md overflow-hidden mb-6 opacity-0 hover:shadow-lg transition-all duration-300"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md flex items-center justify-center text-white text-xl font-bold mr-4">
                  ₹
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
                  </h2>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">
                      Account Number: <span className="font-medium">XXXX{account.accountNumber.slice(-4)}</span>
                    </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm text-gray-500 mb-1">Available Balance</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {formatDate(account.lastUpdated, false)}
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-2 hover:bg-gray-50 rounded transition-colors">
              <p className="text-gray-600">Branch</p>
              <p className="font-medium">{account.branch}</p>
            </div>
            <div className="p-2 hover:bg-gray-50 rounded transition-colors">
              <p className="text-gray-600">IFSC Code</p>
              <p className="font-medium">{account.ifscCode}</p>
            </div>
            <div className="p-2 hover:bg-gray-50 rounded transition-colors">
              <p className="text-gray-600">Account Type</p>
              <p className="font-medium capitalize">{account.accountType}</p>
            </div>
            <div className="p-2 hover:bg-gray-50 rounded transition-colors">
              <p className="text-gray-600">Opening Date</p>
              <p className="font-medium">{formatDate(account.createdAt, false)}</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm flex items-center justify-center"
              onClick={handleTransferMoney}
            >
              <span className="mr-1.5">↗️</span> Transfer Money
            </button>
            <button 
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              onClick={handleDownloadStatement}
            >
              <span className="mr-1.5">⬇️</span> Download Statement
            </button>
            <button className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              <span className="mr-1.5">⚙️</span> Account Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Account Insights */}
      <AccountInsights account={account} />
      
      {/* Tabs */}
      <div ref={tabsRef} className="mb-6 opacity-0">
        <div className="flex border-b overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`py-3 px-6 text-sm font-medium flex items-center border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span className="mr-1.5">📊</span> Overview
          </button>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`py-3 px-6 text-sm font-medium flex items-center border-b-2 transition-colors ${
              activeTab === 'transactions' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span className="mr-1.5">💳</span> Transactions
          </button>
          <button 
            onClick={() => setActiveTab('statements')} 
            className={`py-3 px-6 text-sm font-medium flex items-center border-b-2 transition-colors ${
              activeTab === 'statements' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <span className="mr-1.5">📑</span> Statements
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Account Activity Graph */}
            <BalanceChart />
            
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                ⚡
              </span>
              Recent Transactions
            </h4>
            
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction, index) => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction} 
                  index={index} 
                />
              ))}
            </div>
            
            <div className="text-right">
              <button 
                onClick={() => setActiveTab('transactions')}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                View All Transactions <span className="ml-1">→</span>
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div>
            <TransactionsTable 
              transactions={transactions} 
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
        
        {activeTab === 'statements' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm flex items-start">
              <span className="text-xl mr-3 mt-0.5">ℹ️</span>
              <div>
                <p className="font-medium">Statements are generated on the 1st of each month</p>
                <p className="mt-1">You can download statements for the last 12 months. For older statements, please contact customer support.</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Account Statements</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center">
                <span className="mr-1.5">📄</span> Request Custom Statement
              </button>
            </div>
            
            <StatementsTable statements={statements} />
          </div>
        )}
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
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}