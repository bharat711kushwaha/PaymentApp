// src/components/payments/PaymentInterface.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Types
interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  upiId?: string;
  mobile?: string;
  isPinned: boolean;
  lastUsed?: Date;
  nickname?: string;
  profileColor?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  maxLimit: number;
  fees: string;
  processingTime: string;
  isActive: boolean;
  color?: string;
  popularFor?: string[];
}

// Demo data
const demoAccounts: Account[] = [
  {
    id: 'acc001',
    accountNumber: '1234567890',
    accountType: 'Savings',
    balance: 45678.90,
    currency: 'INR',
    isActive: true
  },
  {
    id: 'acc002',
    accountNumber: '0987654321',
    accountType: 'Current',
    balance: 120500.75,
    currency: 'INR',
    isActive: true
  }
];

const recentBeneficiaries: Beneficiary[] = [
  {
    id: 'ben001',
    name: 'Priya Sharma',
    accountNumber: '9876543210',
    bankName: 'HDFC Bank',
    ifsc: 'HDFC0001234',
    upiId: 'priya@upi',
    mobile: '9876543210',
    isPinned: true,
    lastUsed: new Date('2025-07-10'),
    profileColor: 'from-purple-500 to-pink-500'
  },
  {
    id: 'ben002',
    name: 'Amit Patel',
    accountNumber: '1234567890',
    bankName: 'SBI',
    ifsc: 'SBIN0005678',
    upiId: 'amit@upi',
    mobile: '8765432109',
    isPinned: false,
    lastUsed: new Date('2025-07-05'),
    nickname: 'Office Colleague',
    profileColor: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ben003',
    name: 'Neha Gupta',
    accountNumber: '5678901234',
    bankName: 'ICICI Bank',
    ifsc: 'ICIC0002345',
    upiId: 'neha@upi',
    mobile: '7654321098',
    isPinned: true,
    lastUsed: new Date('2025-07-12'),
    nickname: 'Sister',
    profileColor: 'from-green-500 to-emerald-500'
  },
  {
    id: 'ben004',
    name: 'Raj Kumar',
    accountNumber: '4321098765',
    bankName: 'Axis Bank',
    ifsc: 'UTIB0003456',
    upiId: 'raj@upi',
    mobile: '6543210987',
    isPinned: false,
    lastUsed: new Date('2025-06-25'),
    profileColor: 'from-amber-500 to-orange-500'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: '📱',
    description: 'Instant bank transfers using UPI',
    maxLimit: 100000,
    fees: 'Free',
    processingTime: 'Instant',
    isActive: true,
    color: 'from-blue-500 to-indigo-600',
    popularFor: ['Mobile Payments', 'Peer to Peer Transfers', 'QR Payments']
  },
  {
    id: 'imps',
    name: 'IMPS Transfer',
    icon: '⚡',
    description: 'Immediate Payment Service for instant transfers',
    maxLimit: 500000,
    fees: '₹5 + GST',
    processingTime: 'Instant (24x7)',
    isActive: true,
    color: 'from-green-500 to-teal-600',
    popularFor: ['Urgent Transfers', '24x7 Availability', 'High Value Transfers']
  },
  {
    id: 'neft',
    name: 'NEFT Transfer',
    icon: '🏦',
    description: 'National Electronic Funds Transfer',
    maxLimit: 1000000,
    fees: 'Free',
    processingTime: 'Same day (business hours)',
    isActive: true,
    color: 'from-purple-500 to-indigo-600',
    popularFor: ['Regular Transfers', 'Scheduled Payments', 'Large Amounts']
  },
  {
    id: 'rtgs',
    name: 'RTGS Transfer',
    icon: '💸',
    description: 'Real Time Gross Settlement for high value transfers',
    maxLimit: 10000000,
    fees: '₹25 + GST',
    processingTime: 'Instant (business hours)',
    isActive: true,
    color: 'from-amber-500 to-red-600',
    popularFor: ['Very Large Amounts', 'Business Payments']
  }
];

// Helper function to format currency
const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper to generate random transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now().toString().substring(6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

// Payment Method Card Component
const PaymentMethodCard = ({ method, isSelected, onClick, index }: {
  method: PaymentMethod;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;

  return (
    <div
      style={{ animationDelay }}
      className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 animate-fadeIn ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:shadow-md hover:border-blue-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center text-xl mr-4 shadow-sm`}>
          {method.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900">{method.name}</h3>
            {isSelected && <span className="text-blue-600">✓</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {method.popularFor && method.popularFor.map((use, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="text-gray-500">Limit</p>
          <p className="font-medium text-gray-900 mt-0.5">{formatCurrency(method.maxLimit)}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-md">
          <p className="text-gray-500">Processing</p>
          <p className="font-medium text-gray-900 mt-0.5">{method.processingTime}</p>
        </div>
      </div>
    </div>
  );
};

// Beneficiary Card Component
const BeneficiaryCard = ({ beneficiary, isSelected, onClick, index }: {
  beneficiary: Beneficiary;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;
  
  return (
    <div
      style={{ animationDelay }}
      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 animate-fadeIn ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:shadow-sm hover:border-blue-200'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${beneficiary.profileColor || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center text-lg font-bold shadow-sm`}>
          {getInitials(beneficiary.name)}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-medium text-gray-900">{beneficiary.name}</p>
              {beneficiary.nickname && (
                <p className="text-xs text-gray-500">{beneficiary.nickname}</p>
              )}
            </div>
            {isSelected && <span className="text-blue-600">✓</span>}
          </div>
          
          <div className="mt-1">
            <p className="text-xs text-gray-500 truncate">
              {beneficiary.upiId ? beneficiary.upiId : `A/C: ${beneficiary.accountNumber.substring(0, 4)}...${beneficiary.accountNumber.substring(beneficiary.accountNumber.length - 4)}`}
            </p>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-3 text-xs bg-blue-100 p-2 rounded-md animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-gray-600">Bank</p>
              <p className="font-medium text-gray-900">{beneficiary.bankName}</p>
            </div>
            <div>
              <p className="text-gray-600">IFSC</p>
              <p className="font-medium text-gray-900">{beneficiary.ifsc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Account Selection Component
const AccountSelector = ({ accounts, selectedAccount, onSelectAccount }: {
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (account: Account) => void;
}) => {
  return (
    <div className="mb-6 animate-fadeIn">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Source Account
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              selectedAccount?.id === account.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectAccount(account)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{account.accountType} Account</p>
                <p className="text-xs text-gray-500">
                  {account.accountNumber.substring(0, 4)}...{account.accountNumber.substring(account.accountNumber.length - 4)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                <p className="text-xs text-gray-500">Available Balance</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Transaction Form Component
const TransactionForm = ({ 
  paymentMethod, 
  beneficiary, 
  sourceAccount, 
  onBack,
  onSubmit,
  isLoading = false
}: {
  paymentMethod: PaymentMethod;
  beneficiary: Beneficiary;
  sourceAccount: Account;
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  
  const isValidAmount = Number(amount) > 0 && Number(amount) <= sourceAccount.balance && Number(amount) <= paymentMethod.maxLimit;
  
  const handleSubmit = () => {
    if (!isValidAmount) return;
    
    onSubmit({
      amount: Number(amount),
      purpose,
      remarks,
      saveAsFavorite,
      transactionId: generateTransactionId(),
      timestamp: new Date()
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn">
      <div className={`h-2 bg-gradient-to-r ${paymentMethod.color}`}></div>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            aria-label="Go back"
          >
            ←
          </button>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${paymentMethod.color || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center text-xl mr-3 shadow-sm`}>
              {paymentMethod.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{paymentMethod.name}</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount to Send
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</div>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className={`w-full px-4 py-3 pl-8 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    amount && !isValidAmount
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="Enter amount"
                />
              </div>
              {amount && !isValidAmount && (
                <p className="mt-1.5 text-sm text-red-600">
                  {Number(amount) > sourceAccount.balance 
                    ? 'Insufficient balance' 
                    : Number(amount) > paymentMethod.maxLimit
                      ? `Exceeds ${paymentMethod.name} limit of ${formatCurrency(paymentMethod.maxLimit)}`
                      : 'Please enter a valid amount'}
                </p>
              )}
              {isValidAmount && (
                <p className="mt-1.5 text-sm text-green-600">
                  Amount is within the transfer limits
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1.5">
                Purpose of Transfer
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                <option value="">Select a purpose</option>
                <option value="family">Family Support</option>
                <option value="friend">Friend Payment</option>
                <option value="rent">Rent Payment</option>
                <option value="shopping">Shopping</option>
                <option value="education">Education Fees</option>
                <option value="medical">Medical Expenses</option>
                <option value="utilities">Utility Bills</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1.5">
                Remarks (Optional)
              </label>
              <input
                type="text"
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Add a note for recipient"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <input
                    type="checkbox"
                    id="save-favorite"
                    checked={saveAsFavorite}
                    onChange={(e) => setSaveAsFavorite(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="save-favorite" className="font-medium text-sm text-blue-800">
                    Save as a favorite transaction
                  </label>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Quickly repeat this transaction in the future
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Transaction Summary</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <p className="text-gray-600">From</p>
                  <p className="font-medium text-right">
                    {sourceAccount.accountType} Account <br />
                    <span className="text-gray-500">{sourceAccount.accountNumber.substring(0, 4)}...{sourceAccount.accountNumber.substring(sourceAccount.accountNumber.length - 4)}</span>
                  </p>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <p className="text-gray-600">To</p>
                  <p className="font-medium text-right">
                    {beneficiary.name} <br />
                    <span className="text-gray-500">{beneficiary.upiId || `${beneficiary.bankName} - ${beneficiary.accountNumber.substring(0, 4)}...`}</span>
                  </p>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <p className="text-gray-600">Amount</p>
                  <p className="font-medium text-right">
                    {amount ? formatCurrency(Number(amount)) : '-'}
                  </p>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <p className="text-gray-600">Charges</p>
                  <p className="font-medium text-right">
                    {paymentMethod.fees}
                  </p>
                </div>
                
                <div className="flex justify-between font-medium">
                  <p className="text-gray-900">Total</p>
                  <p className="text-right text-gray-900">
                    {amount ? formatCurrency(Number(amount)) : '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex">
                <div className="text-yellow-500 mr-2">⚠️</div>
                <p className="text-sm text-yellow-700">
                  Always verify the beneficiary details before proceeding with the payment.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!isValidAmount || isLoading}
              className={`w-full py-3.5 rounded-lg font-medium text-center transition-all duration-300 ${
                !isValidAmount || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Send ${amount ? formatCurrency(Number(amount)) : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Success Component
const PaymentSuccess = ({
  paymentData,
  beneficiary,
  paymentMethod,
  onDone
}: {
  paymentData: any;
  beneficiary: Beneficiary;
  paymentMethod: PaymentMethod;
  onDone: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('animate-fadeIn');
    }
  }, []);
  
  return (
    <div ref={containerRef} className="max-w-2xl mx-auto opacity-0">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 opacity-25 animate-ping">
                <div className="w-20 h-20 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-4">Payment Successful!</h3>
            <p className="text-gray-600 mt-1 text-sm">
              ₹{paymentData.amount.toLocaleString('en-IN')} has been sent to {beneficiary.name}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <p className="text-gray-600 font-medium">Transaction ID</p>
              <p className="font-bold text-blue-800">{paymentData.transactionId}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(paymentData.amount)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Payment Method</p>
                <div className="flex items-center">
                  <span className="mr-1">{paymentMethod.icon}</span>
                  <p className="font-medium text-gray-900">{paymentMethod.name}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {formatDate(paymentData.timestamp)} {paymentData.timestamp.toLocaleTimeString('en-IN')}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Recipient</p>
                <p className="font-medium text-gray-900">{beneficiary.name}</p>
              </div>
              {paymentData.purpose && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Purpose</p>
                  <p className="font-medium text-gray-900">{paymentData.purpose}</p>
                </div>
              )}
              {paymentData.remarks && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Remarks</p>
                  <p className="font-medium text-gray-900">{paymentData.remarks}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
              <span className="mr-2">⬇️</span> Download Receipt
            </button>
            <button 
              onClick={onDone}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-5 bg-blue-50 rounded-lg p-4 border border-blue-100 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="flex">
          <div className="text-blue-500 mr-3 text-xl">💡</div>
          <div>
            <h4 className="font-medium text-blue-800">Quick Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              You can view all your transaction history and download statements from the 'Accounts' section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Payment Interface Component
const PaymentInterface = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'method' | 'beneficiary' | 'transaction' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFavorites, setShowFavorites] = useState(true);
  
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set default account
      if (demoAccounts.length > 0) {
        setSelectedAccount(demoAccounts[0]);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation for header
  useEffect(() => {
    if (!isLoading && headerRef.current) {
      headerRef.current.classList.add('animate-fadeIn');
    }
  }, [isLoading]);
  
  // Handle payment method selection
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('beneficiary');
  };
  
  // Handle beneficiary selection
  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep('transaction');
  };
  
  // Handle transaction submission
  const handleTransactionSubmit = (data: any) => {
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setPaymentData(data);
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };
  
  // Handle done action after successful payment
  const handleDone = () => {
    // Reset the flow
    setStep('method');
    setSelectedMethod(null);
    setSelectedBeneficiary(null);
    setPaymentData(null);
    // Or navigate to dashboard
    // navigate('/');
  };
  
  // Get pinned beneficiaries
  const pinnedBeneficiaries = recentBeneficiaries.filter(ben => ben.isPinned);
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-2/5 mb-8"></div>
        
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div ref={headerRef} className="mb-8 opacity-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Make a Payment</h2>
        <p className="text-gray-600">Send money to anyone, anywhere with multiple payment options</p>
      </div>
      
      {step === 'method' && (
        <div>
          <AccountSelector 
            accounts={demoAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccount}
          />
          
          <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                  💳
                </div>
                <h3 className="text-lg font-bold text-gray-900">Select Payment Method</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => (
                <PaymentMethodCard 
                  key={method.id} 
                  method={method}
                  onClick={() => handleMethodSelect(method)}
                  isSelected={selectedMethod?.id === method.id}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {step === 'beneficiary' && selectedMethod && (
        <div>
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setStep('method')}
              className="mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              aria-label="Go back"
            >
              ←
            </button>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedMethod.color || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center text-xl mr-3 shadow-sm`}>
                {selectedMethod.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">Select Recipient</h3>
            </div>
          </div>
          
          {showFavorites && pinnedBeneficiaries.length > 0 && (
            <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                    ⭐
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Favorite Recipients</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pinnedBeneficiaries.map((beneficiary, index) => (
                  <BeneficiaryCard 
                    key={beneficiary.id} 
                    beneficiary={beneficiary}
                    onClick={() => handleBeneficiarySelect(beneficiary)}
                    isSelected={selectedBeneficiary?.id === beneficiary.id}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                  👥
                </div>
                <h3 className="text-lg font-bold text-gray-900">Recent Recipients</h3>
              </div>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipients..."
                    className="py-1.5 px-3 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
                
                <button className="py-1.5 px-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  + Add New
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recentBeneficiaries.map((beneficiary, index) => (
                <BeneficiaryCard 
                  key={beneficiary.id} 
                  beneficiary={beneficiary}
                  onClick={() => handleBeneficiarySelect(beneficiary)}
                  isSelected={selectedBeneficiary?.id === beneficiary.id}
                  index={index + pinnedBeneficiaries.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {step === 'transaction' && selectedMethod && selectedBeneficiary && selectedAccount && (
        <TransactionForm 
          paymentMethod={selectedMethod}
          beneficiary={selectedBeneficiary}
          sourceAccount={selectedAccount}
          onBack={() => setStep('beneficiary')}
          onSubmit={handleTransactionSubmit}
          isLoading={isProcessing}
        />
      )}
      
      {step === 'success' && paymentData && selectedMethod && selectedBeneficiary && (
        <PaymentSuccess 
          paymentData={paymentData}
          beneficiary={selectedBeneficiary}
          paymentMethod={selectedMethod}
          onDone={handleDone}
        />
      )}

      {/* Tailwind Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentInterface;