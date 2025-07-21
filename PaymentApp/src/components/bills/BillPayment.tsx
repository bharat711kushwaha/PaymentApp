// src/components/bills/BillPayment.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface BillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient?: string;
  popularInRegion?: boolean;
}

interface BillProvider {
  id: string;
  name: string;
  logo: string;
  categoryId: string;
  supportsFastPay: boolean;
  popularityScore?: number;
  logoColor?: string;
}

interface SavedBill {
  id: string;
  nickname: string;
  providerId: string;
  consumerNumber: string;
  providerName: string;
  category?: string;
  amount?: number;
  dueDate?: Date;
  lastPaid?: Date;
  logoIcon?: string;
}

// Demo data for bill categories with gradients and popularity flags
const billCategories: BillCategory[] = [
  { id: 'mobile', name: 'Mobile Recharge', icon: '📱', description: 'Prepaid and postpaid mobile recharges', gradient: 'from-blue-500 to-indigo-600', popularInRegion: true },
  { id: 'electricity', name: 'Electricity', icon: '⚡', description: 'Pay electricity bills from multiple providers', gradient: 'from-yellow-400 to-orange-500', popularInRegion: true },
  { id: 'dth', name: 'DTH', icon: '📺', description: 'DTH recharges and subscriptions', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'broadband', name: 'Broadband', icon: '🌐', description: 'Pay for internet and broadband services', gradient: 'from-blue-400 to-blue-600', popularInRegion: true },
  { id: 'gas', name: 'Gas', icon: '🔥', description: 'Pay for piped natural gas services', gradient: 'from-red-500 to-pink-600' },
  { id: 'water', name: 'Water', icon: '💧', description: 'Pay water utility bills', gradient: 'from-blue-300 to-cyan-500' },
  { id: 'landline', name: 'Landline', icon: '☎️', description: 'Pay landline telephone bills', gradient: 'from-gray-500 to-gray-700' },
  { id: 'insurance', name: 'Insurance Premium', icon: '🛡️', description: 'Pay insurance premiums', gradient: 'from-green-500 to-emerald-600' },
  { id: 'credit-card', name: 'Credit Card', icon: '💳', description: 'Pay credit card bills', gradient: 'from-blue-600 to-indigo-700', popularInRegion: true },
  { id: 'loan', name: 'Loan Repayment', icon: '🏦', description: 'Pay EMIs and loan installments', gradient: 'from-green-600 to-teal-700' },
  { id: 'fastag', name: 'FASTag Recharge', icon: '🚗', description: 'Recharge your FASTag', gradient: 'from-yellow-500 to-yellow-600' },
  { id: 'education', name: 'Education Fees', icon: '🎓', description: 'Pay school and college fees', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'municipal', name: 'Municipal Taxes', icon: '🏙️', description: 'Pay municipal and property taxes', gradient: 'from-gray-600 to-gray-800' },
];

// Sample electricity providers with better logos
const electricityProviders: BillProvider[] = [
  { 
    id: 'msedcl', 
    name: 'Maharashtra State Electricity Distribution Co. Ltd', 
    logo: 'M', 
    categoryId: 'electricity', 
    supportsFastPay: true, 
    popularityScore: 98,
    logoColor: 'bg-yellow-500'
  },
  { 
    id: 'adani', 
    name: 'Adani Electricity Mumbai Limited', 
    logo: 'A', 
    categoryId: 'electricity', 
    supportsFastPay: true,
    popularityScore: 92,
    logoColor: 'bg-blue-600'
  },
  { 
    id: 'tata', 
    name: 'Tata Power', 
    logo: 'T', 
    categoryId: 'electricity', 
    supportsFastPay: true,
    popularityScore: 95,
    logoColor: 'bg-blue-800'
  },
  { 
    id: 'best', 
    name: 'BEST Mumbai', 
    logo: 'B', 
    categoryId: 'electricity', 
    supportsFastPay: false,
    popularityScore: 85,
    logoColor: 'bg-red-600'
  },
  { 
    id: 'torrent', 
    name: 'Torrent Power', 
    logo: 'T', 
    categoryId: 'electricity', 
    supportsFastPay: true,
    popularityScore: 88,
    logoColor: 'bg-purple-600'
  },
];

// Sample saved bills with category info
const savedBills: SavedBill[] = [
  { 
    id: 'sb1', 
    nickname: 'Home Electricity', 
    providerId: 'msedcl', 
    providerName: 'Maharashtra State Electricity Distribution Co. Ltd',
    consumerNumber: '1234567890', 
    amount: 1250, 
    dueDate: new Date('2025-07-25'),
    lastPaid: new Date('2025-06-20'),
    category: 'electricity',
    logoIcon: '⚡'
  },
  { 
    id: 'sb2', 
    nickname: 'Mobile Postpaid', 
    providerId: 'airtel', 
    providerName: 'Airtel Postpaid',
    consumerNumber: '9876543210', 
    amount: 699, 
    dueDate: new Date('2025-07-18'),
    lastPaid: new Date('2025-06-15'),
    category: 'mobile',
    logoIcon: '📱'
  },
  { 
    id: 'sb3', 
    nickname: 'Broadband', 
    providerId: 'jio', 
    providerName: 'Jio Fiber',
    consumerNumber: 'JF123456789', 
    amount: 999, 
    dueDate: new Date('2025-07-20'),
    lastPaid: new Date('2025-06-19'),
    category: 'broadband',
    logoIcon: '🌐'
  },
];

// Recent payment history for the success screen
const recentPayments = [
  {
    id: 'pay1',
    biller: 'Airtel Postpaid',
    amount: 699,
    date: new Date('2025-06-15'),
    category: 'mobile'
  },
  {
    id: 'pay2',
    biller: 'MSEDCL',
    amount: 1450,
    date: new Date('2025-06-20'),
    category: 'electricity'
  },
  {
    id: 'pay3',
    biller: 'Tata Play DTH',
    amount: 450,
    date: new Date('2025-06-25'),
    category: 'dth'
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

// Helper to calculate days remaining until due date
const getDaysRemaining = (dueDate: Date): number => {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Bill Category Card Component
const CategoryCard = ({ category, onClick, isSelected, index }: { 
  category: BillCategory; 
  onClick: () => void; 
  isSelected: boolean;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;

  return (
    <div 
      style={{ animationDelay }}
      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 animate-fadeIn hover:shadow-md ${
        isSelected 
          ? 'bg-gradient-to-br border-blue-300 shadow-md transform scale-105' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 rounded-full mb-3 flex items-center justify-center text-2xl ${
          isSelected 
            ? 'bg-white shadow-sm' 
            : `bg-gradient-to-br ${category.gradient || 'from-blue-500 to-indigo-600'} text-white shadow-sm`
        }`}>
          {category.icon}
        </div>
        <p className={`text-sm font-medium text-center ${isSelected ? 'text-white' : 'text-gray-800'}`}>
          {category.name}
        </p>
        
        {category.popularInRegion && !isSelected && (
          <span className="mt-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
            Popular
          </span>
        )}
      </div>
    </div>
  );
};

// Provider Card Component
const ProviderCard = ({ provider, onClick, index }: { 
  provider: BillProvider; 
  onClick: () => void;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;

  return (
    <div 
      style={{ animationDelay }}
      className="p-5 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300 bg-white animate-fadeIn"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg ${provider.logoColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold mr-4 shadow-sm`}>
          {provider.logo}
        </div>
        <div className="flex-1">
          <p className="font-medium">{provider.name}</p>
          <div className="flex items-center mt-1.5 justify-between">
            <div className="flex space-x-2">
              {provider.supportsFastPay && (
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                  <span className="mr-1">⚡</span> FastPay
                </span>
              )}
              
              {(provider.popularityScore && provider.popularityScore > 90) && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Top Choice
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">Select →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Saved Bill Card Component
const SavedBillCard = ({ bill, onPay, index }: { 
  bill: SavedBill; 
  onPay: () => void;
  index: number;
}) => {
  const animationDelay = `${index * 0.05}s`;
  const daysRemaining = bill.dueDate ? getDaysRemaining(bill.dueDate) : null;
  const isUrgent = daysRemaining !== null && daysRemaining <= 3;
  
  // Calculate gradient based on category
  const getGradient = () => {
    const category = billCategories.find(c => c.id === bill.category);
    return category?.gradient || 'from-blue-500 to-indigo-600';
  };

  return (
    <div 
      style={{ animationDelay }}
      className="border rounded-xl bg-white overflow-hidden hover:shadow-md transition-all duration-300 animate-fadeIn"
    >
      <div className={`h-2 bg-gradient-to-r ${getGradient()}`}></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient()} text-white flex items-center justify-center mr-3 shadow-sm`}>
              {bill.logoIcon || '📄'}
            </div>
            <div>
              <p className="font-medium">{bill.nickname}</p>
              <p className="text-xs text-gray-500">{bill.providerName}</p>
            </div>
          </div>
          {bill.amount && (
            <div className="text-right bg-gray-50 px-3 py-1.5 rounded-lg">
              <p className="font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-xs text-gray-500">
              Consumer No: <span className="font-medium">{bill.consumerNumber}</span>
            </p>
            {bill.dueDate && (
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500">
                  Due: {formatDate(bill.dueDate)}
                </p>
                {isUrgent && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full animate-pulse">
                    {daysRemaining === 0 ? 'Due Today!' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <button 
            onClick={onPay}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-full hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm flex items-center"
          >
            <span className="mr-1">💸</span> Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Bill Payment Form Component
const BillPaymentForm = ({ 
  provider, 
  onBack, 
  onSubmit 
}: { 
  provider: BillProvider;
  onBack: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [consumerNumber, setConsumerNumber] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [saveBill, setSaveBill] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Form animation
  useEffect(() => {
    if (formRef.current) {
      formRef.current.classList.add('animate-fadeIn');
    }
  }, []);
  
  // Simulate validating the consumer number
  const validateConsumerNumber = () => {
    if (!consumerNumber) return;
    
    setIsValidating(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setIsValidating(false);
      // Auto-fill nickname if not set and saving bill
      if (saveBill && !nickname) {
        setNickname(`${provider.name.split(' ')[0]} Bill`);
      }
    }, 1000);
  };
  
  const handleSubmit = () => {
    onSubmit({
      providerId: provider.id,
      consumerNumber,
      amount: parseFloat(billAmount),
      saveBill,
      nickname: saveBill ? nickname : undefined
    });
  };
  
  return (
    <div ref={formRef} className="max-w-2xl mx-auto opacity-0">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${provider.logoColor ? provider.logoColor.replace('bg-', 'from-') + ' to-blue-600' : 'from-blue-500 to-indigo-600'}`}></div>
        
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
              <div className={`w-10 h-10 rounded-lg ${provider.logoColor || 'bg-blue-600'} text-white flex items-center justify-center font-bold mr-3 shadow-sm`}>
                {provider.logo}
              </div>
              <h3 className="text-xl font-bold text-gray-800">Pay {provider.name} Bill</h3>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="consumer-number" className="block text-sm font-medium text-gray-700 mb-1.5">
                Consumer Number / Account ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="consumer-number"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  onBlur={validateConsumerNumber}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your consumer number"
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                You can find this on your last bill or receipt
              </p>
            </div>
            
            <div>
              <label htmlFor="bill-amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                Bill Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</div>
                <input
                  type="text"
                  id="bill-amount"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter bill amount"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                  <input
                    type="checkbox"
                    id="save-bill"
                    checked={saveBill}
                    onChange={(e) => setSaveBill(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="save-bill" className="font-medium text-sm text-blue-800">
                    Save this bill for future payments
                  </label>
                  <p className="text-xs text-blue-700 mt-0.5">
                    We'll remember this bill so you can pay it with just one click next time
                  </p>
                </div>
              </div>
            </div>
            
            {saveBill && (
              <div className="animate-fadeIn">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nickname for this bill
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Home Electricity"
                />
              </div>
            )}
            
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={!consumerNumber || !billAmount}
                className={`w-full py-3.5 rounded-lg font-medium text-center transition-all duration-300 ${
                  !consumerNumber || !billAmount
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {!consumerNumber || !billAmount ? 'Enter Details to Continue' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 text-center">
        <p className="text-sm text-gray-500">
          Your payment is secured with bank-grade encryption
        </p>
      </div>
    </div>
  );
};

// Payment Confirmation Screen
const PaymentConfirmation = ({ 
  billData, 
  onBack,
  onConfirm
}: { 
  billData: any;
  onBack: () => void;
  onConfirm: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('animate-fadeIn');
    }
  }, []);
  
  return (
    <div ref={containerRef} className="max-w-lg mx-auto opacity-0">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={onBack}
              className="mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              aria-label="Go back"
            >
              ←
            </button>
            <h3 className="text-xl font-bold text-gray-800">Confirm Payment</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700 font-medium">Amount to Pay</p>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {formatCurrency(billData.amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Including all charges
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Bill for</p>
                  <p className="font-medium text-gray-900">{billData.providerName}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Consumer Number</p>
                  <p className="font-medium text-gray-900">{billData.consumerNumber}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Payment Method</p>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-1.5">₹</div>
                    <p className="font-medium text-gray-900">Savings Account (XXXX5678)</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Transaction Charges</p>
                  <p className="font-medium text-green-600">Free</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
                ⚠️
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Please verify all details before confirming
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Once paid, refund process may take 5-7 business days
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={onConfirm}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Confirm & Pay {formatCurrency(billData.amount)}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                By clicking confirm, you agree to our payment terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Success Screen
const PaymentSuccess = ({ 
  paymentData,
  onDone
}: { 
  paymentData: any;
  onDone: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transactionId = paymentData.transactionId || 'TXN' + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Animation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('animate-fadeIn');
    }
  }, []);
  
  return (
    <div ref={containerRef} className="max-w-lg mx-auto opacity-0">
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
              Your bill payment was completed successfully
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <p className="text-gray-600 font-medium">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentData.amount)}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Transaction ID</p>
                <p className="font-medium text-gray-900">{transactionId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">{formatDate(new Date())} {new Date().toLocaleTimeString('en-IN')}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Payment Method</p>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-1.5">₹</div>
                  <p className="font-medium text-gray-900">Savings Account (XXXX5678)</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Consumer Number</p>
                <p className="font-medium text-gray-900">{paymentData.consumerNumber}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Biller</p>
                <p className="font-medium text-gray-900">{paymentData.providerName}</p>
              </div>
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
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800">Recent Payments</h4>
              <span className="text-xs text-blue-600">View All</span>
            </div>
            
            <div className="space-y-2">
              {recentPayments.map((payment, index) => (
                <div 
                  key={payment.id}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 animate-fadeIn"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      {payment.category === 'mobile' ? '📱' : 
                       payment.category === 'electricity' ? '⚡' : '📺'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{payment.biller}</p>
                      <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatCurrency(payment.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Steps Component
const ProgressSteps = ({ currentStep }: { currentStep: string }) => {
  const steps = [
    { id: 'category', name: 'Select Category' },
    { id: 'provider', name: 'Choose Provider' },
    { id: 'form', name: 'Enter Details' },
    { id: 'confirm', name: 'Confirm' }
  ];
  
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="hidden md:block mb-6">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index <= currentIndex
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index < currentIndex ? (
                '✓'
              ) : (
                index + 1
              )}
            </div>
            
            <div className={`ml-2 ${index <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {step.name}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 ${
                index < currentIndex ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Bill Payment Component
const BillPayment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'category' | 'provider' | 'form' | 'confirm' | 'success'>('category');
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<BillProvider | null>(null);
  const [billData, setBillData] = useState<any>(null);
  const [showSavedBills, setShowSavedBills] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopular, setShowPopular] = useState(true);
  
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation for header
  useEffect(() => {
    if (!isLoading && headerRef.current) {
      headerRef.current.classList.add('animate-fadeIn');
    }
  }, [isLoading]);
  
  // Handle category selection
  const handleCategorySelect = (category: BillCategory) => {
    setSelectedCategory(category);
    setStep('provider');
  };
  
  // Handle provider selection
  const handleProviderSelect = (provider: BillProvider) => {
    setSelectedProvider(provider);
    setStep('form');
  };
  
  // Handle form submission
  const handleFormSubmit = (data: any) => {
    // In a real app, we would fetch bill details or validate here
    setBillData({
      ...data,
      providerName: selectedProvider?.name
    });
    setStep('confirm');
  };
  
  // Handle payment confirmation
  const handlePaymentConfirm = () => {
    // In a real app, we would process the payment here
    setStep('success');
  };
  
  // Handle saved bill payment
  const handleSavedBillPay = (bill: SavedBill) => {
    setBillData({
      providerId: bill.providerId,
      providerName: bill.providerName,
      consumerNumber: bill.consumerNumber,
      amount: bill.amount || 0,
      nickname: bill.nickname
    });
    setStep('confirm');
  };
  
  // Handle done action after successful payment
  const handleDone = () => {
    // Reset the flow
    setStep('category');
    setSelectedCategory(null);
    setSelectedProvider(null);
    setBillData(null);
  };
  
  // Get popular categories
  const popularCategories = billCategories.filter(cat => cat.popularInRegion);
  
  // Render saved bills section
  const renderSavedBills = () => {
    if (!showSavedBills || savedBills.length === 0) return null;
    
    return (
      <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
              📌
            </div>
            <h3 className="text-lg font-bold text-gray-900">Saved Bills</h3>
          </div>
          <button 
            onClick={() => setShowSavedBills(false)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Hide
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedBills.map((bill, index) => (
            <SavedBillCard 
              key={bill.id} 
              bill={bill}
              onPay={() => handleSavedBillPay(bill)} 
              index={index}
            />
          ))}
        </div>
      </div>
    );
  };
  
  // Render category selection
  const renderCategorySelection = () => {
    return (
      <div>
        {renderSavedBills()}
        
        {showPopular && (
          <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                  🔥
                </div>
                <h3 className="text-lg font-bold text-gray-900">Popular in Your Region</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {popularCategories.map((category, index) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  onClick={() => handleCategorySelect(category)}
                  isSelected={selectedCategory?.id === category.id}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                📋
              </div>
              <h3 className="text-lg font-bold text-gray-900">All Categories</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {billCategories.map((category, index) => (
              <CategoryCard 
                key={category.id} 
                category={category}
                onClick={() => handleCategorySelect(category)}
                isSelected={selectedCategory?.id === category.id}
                index={index + popularCategories.length}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render provider selection
  const renderProviderSelection = () => {
    if (!selectedCategory) return null;
    
    const providers = selectedCategory.id === 'electricity' 
      ? electricityProviders 
      : [];
    
    return (
      <div>
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setStep('category')}
            className="mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            aria-label="Go back"
          >
            ←
          </button>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedCategory.gradient || 'from-blue-500 to-indigo-600'} text-white flex items-center justify-center mr-3 shadow-sm`}>
              {selectedCategory.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{selectedCategory.name} Providers</h3>
          </div>
        </div>
        
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider, index) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider}
                onClick={() => handleProviderSelect(provider)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl animate-fadeIn">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mr-3">
                ℹ️
              </div>
              <h4 className="font-medium text-yellow-800">Demo Mode Notice</h4>
            </div>
            <p className="text-yellow-700 mb-3">
              Demo data is only available for the Electricity category. Please select Electricity to proceed.
            </p>
            <button 
              onClick={() => {
                const electricityCategory = billCategories.find(c => c.id === 'electricity');
                if (electricityCategory) {
                  setSelectedCategory(electricityCategory);
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
            >
              Switch to Electricity Category
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-2/5 mb-8"></div>
        
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div ref={headerRef} className="mb-8 opacity-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Recharge & Bill Payment</h2>
        <p className="text-gray-600">Pay bills, recharge or make payments for various services</p>
      </div>
      
      <ProgressSteps currentStep={step} />
      
      {step === 'category' && renderCategorySelection()}
      
      {step === 'provider' && renderProviderSelection()}
      
      {step === 'form' && selectedProvider && (
        <BillPaymentForm 
          provider={selectedProvider}
          onBack={() => setStep('provider')}
          onSubmit={handleFormSubmit}
        />
      )}
      
      {step === 'confirm' && billData && (
        <PaymentConfirmation 
          billData={billData}
          onBack={() => setStep('form')}
          onConfirm={handlePaymentConfirm}
        />
      )}
      
      {step === 'success' && billData && (
        <PaymentSuccess 
          paymentData={billData}
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BillPayment;