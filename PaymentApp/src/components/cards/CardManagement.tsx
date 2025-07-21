import { useState } from "react";

// Types
type CardType = 'physical' | 'virtual';
type CardNetwork = 'VISA' | 'Mastercard' | 'RuPay';
type CardStatus = 'active' | 'inactive' | 'blocked' | 'expired';

interface Card {
  id: string;
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv?: string;
  cardType: CardType;
  cardNetwork: CardNetwork;
  issuedDate: Date;
  status: CardStatus;
  isContactless: boolean;
  dailyLimit: number;
  isFrozen: boolean;
}

// Demo data
const demoCards: Card[] = [
  {
    id: "card1",
    cardNumber: "4321 XXXX XXXX 5678",
    cardholderName: "RAHUL SHARMA",
    expiryMonth: 12,
    expiryYear: 28,
    cardType: "physical",
    cardNetwork: "VISA",
    issuedDate: new Date("2024-01-15"),
    status: "active",
    isContactless: true,
    dailyLimit: 50000,
    isFrozen: false
  },
  {
    id: "card2",
    cardNumber: "5432 XXXX XXXX 8765",
    cardholderName: "RAHUL SHARMA",
    expiryMonth: 6,
    expiryYear: 27,
    cardType: "virtual",
    cardNetwork: "Mastercard",
    issuedDate: new Date("2023-10-05"),
    status: "active",
    isContactless: false,
    dailyLimit: 20000,
    isFrozen: false
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

// Card component
const CardItem = ({ card, isSelected, onClick }: { 
  card: Card; 
  isSelected: boolean;
  onClick: () => void;
}) => {
  // Background color based on card network
  const getBgColor = () => {
    switch (card.cardNetwork) {
      case 'VISA': return 'from-blue-700 to-blue-900';
      case 'Mastercard': return 'from-orange-600 to-red-700';
      case 'RuPay': return 'from-teal-600 to-green-700';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  // Card network logo (simplified for this demo)
  const getCardLogo = () => {
    switch (card.cardNetwork) {
      case 'VISA': return 'VISA';
      case 'Mastercard': return 'Mastercard';
      case 'RuPay': return 'RuPay';
      default: return 'Card';
    }
  };

  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 ${
        isSelected ? 'transform scale-105 ring-4 ring-blue-400' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div className={`rounded-xl h-48 p-6 bg-gradient-to-br ${getBgColor()} shadow-lg`}>
        {/* Card status indicator */}
        {card.isFrozen && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
            FROZEN
          </div>
        )}
        
        {/* Card type indicator */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-xs">
          {card.cardType === 'physical' ? 'Physical' : 'Virtual'}
        </div>
        
        {/* Chip and contactless icons */}
        <div className="flex justify-between mb-6">
          <div className="w-10 h-8 bg-yellow-300 bg-opacity-90 rounded-md border border-yellow-400"></div>
          {card.isContactless && (
            <div className="text-white opacity-80">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                <path d="M16 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" fill="none"/>
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="none"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Card number */}
        <div className="text-white text-lg font-mono mb-6">
          {card.cardNumber}
        </div>
        
        {/* Expiry and cardholder name */}
        <div className="flex justify-between text-white">
          <div>
            <div className="text-xs opacity-80">VALID THRU</div>
            <div className="font-medium">
              {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear.toString().substring(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">CARDHOLDER</div>
            <div className="font-medium">{card.cardholderName}</div>
          </div>
        </div>
        
        {/* Card network logo */}
        <div className="absolute bottom-4 right-6 text-white font-bold tracking-wider opacity-90">
          {getCardLogo()}
        </div>
      </div>
    </div>
  );
};

// Card details component
const CardDetails = ({ card, onClose, onFreeze }: { 
  card: Card; 
  onClose: () => void;
  onFreeze: (cardId: string, freeze: boolean) => void;
}) => {
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [confirmFreeze, setConfirmFreeze] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {card.cardType === 'physical' ? 'Physical Card' : 'Virtual Card'} Details
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Card information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Card Number</p>
              <div className="flex items-center">
                <p className="font-medium">
                  {showCardDetails ? card.cardNumber.replace('XXXX', '1234').replace('XXXX', '5678') : card.cardNumber}
                </p>
                <button 
                  onClick={() => setShowCardDetails(!showCardDetails)}
                  className="ml-2 text-blue-600 text-sm"
                >
                  {showCardDetails ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valid Thru</p>
              <p className="font-medium">
                {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Cardholder Name</p>
              <p className="font-medium">{card.cardholderName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CVV</p>
              <div className="flex items-center">
                <p className="font-medium">
                  {showCardDetails ? '123' : '•••'}
                </p>
                <button 
                  onClick={() => setShowCardDetails(!showCardDetails)}
                  className="ml-2 text-blue-600 text-sm"
                >
                  {showCardDetails ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Card Network</p>
              <p className="font-medium">{card.cardNetwork}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Issued Date</p>
              <p className="font-medium">{formatDate(card.issuedDate)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Card Status</p>
              <p className={`font-medium ${
                card.isFrozen ? 'text-yellow-600' : 
                card.status === 'active' ? 'text-green-600' : 
                card.status === 'inactive' ? 'text-gray-600' : 
                card.status === 'blocked' ? 'text-red-600' : 
                'text-orange-600'
              }`}>
                {card.isFrozen ? 'Frozen' : card.status.charAt(0).toUpperCase() + card.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Daily Transaction Limit</p>
              <p className="font-medium">{formatCurrency(card.dailyLimit)}</p>
            </div>
          </div>
        </div>
        
        {/* Card actions */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-3">Card Actions</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {!confirmFreeze ? (
              <button
                onClick={() => setConfirmFreeze(true)}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  card.isFrozen 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {card.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onFreeze(card.id, !card.isFrozen);
                    setConfirmFreeze(false);
                  }}
                  className="py-2 px-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmFreeze(false)}
                  className="py-2 px-3 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}
            
            <button
              className="py-2 px-4 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200"
            >
              Set Transaction Limits
            </button>
            
            <button
              className="py-2 px-4 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200"
            >
              View Transactions
            </button>
            
            <button
              className="py-2 px-4 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200"
            >
              Update PIN
            </button>
          </div>
        </div>
        
        {/* Danger zone */}
        {card.cardType === 'virtual' && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Danger Zone</h4>
            
            <button
              className="py-2 px-4 border border-red-600 text-red-600 text-sm font-medium rounded-md hover:bg-red-50"
            >
              Delete Virtual Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// New card application component
const NewCardApplication = ({ onClose }: { onClose: () => void }) => {
  const [cardType, setCardType] = useState<CardType>('physical');
  const [cardNetwork, setCardNetwork] = useState<CardNetwork>('VISA');
  const [step, setStep] = useState(1);
  
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit application logic would go here
      onClose();
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Apply for New Card
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className="w-6"></div>
          <div className="flex-1">
            <div className={`h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className="w-6"></div>
          <div className="flex-1">
            <div className={`h-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Card Type</span>
          <span>Details</span>
          <span>Confirm</span>
        </div>
      </div>
      
      {/* Step 1: Card Type Selection */}
      {step === 1 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Select Card Type</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                cardType === 'physical' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCardType('physical')}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600 text-xl">💳</span>
              </div>
              <h5 className="font-medium mb-1">Physical Card</h5>
              <p className="text-sm text-gray-500">
                A plastic card that will be delivered to your address
              </p>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                cardType === 'virtual' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCardType('virtual')}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-blue-600 text-xl">📱</span>
              </div>
              <h5 className="font-medium mb-1">Virtual Card</h5>
              <p className="text-sm text-gray-500">
                Digital card for online transactions, available instantly
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-gray-800 mb-4">Select Card Network</h4>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                cardNetwork === 'VISA' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCardNetwork('VISA')}
            >
              <div className="h-8 flex items-center justify-center mb-2">
                <span className="text-blue-800 font-bold">VISA</span>
              </div>
              <p className="text-xs text-center text-gray-500">
                Global acceptance
              </p>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                cardNetwork === 'Mastercard' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCardNetwork('Mastercard')}
            >
              <div className="h-8 flex items-center justify-center mb-2">
                <span className="text-orange-600 font-bold">Mastercard</span>
              </div>
              <p className="text-xs text-center text-gray-500">
                Worldwide acceptance
              </p>
            </div>
            
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                cardNetwork === 'RuPay' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setCardNetwork('RuPay')}
            >
              <div className="h-8 flex items-center justify-center mb-2">
                <span className="text-teal-600 font-bold">RuPay</span>
              </div>
              <p className="text-xs text-center text-gray-500">
                Indian network
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Card Details */}
      {step === 2 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 mb-4">Card Details</h4>
          
          {cardType === 'physical' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-yellow-800 mb-2">Delivery Information</h5>
              <p className="text-sm text-yellow-700">
                Your physical card will be delivered to your registered address within 7-10 business days.
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Name (As it will appear on your card)
            </label>
            <input
              type="text"
              defaultValue="RAHUL SHARMA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use capital letters, maximum 19 characters
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Transaction Limit
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="10000">₹10,000 per day</option>
              <option value="25000">₹25,000 per day</option>
              <option value="50000" selected>₹50,000 per day</option>
              <option value="100000">₹1,00,000 per day</option>
            </select>
          </div>
          
          {cardType === 'physical' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Features
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="contactless"
                    defaultChecked={true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="contactless" className="ml-2 block text-sm text-gray-700">
                    Contactless payments enabled
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="international"
                    defaultChecked={false}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="international" className="ml-2 block text-sm text-gray-700">
                    Enable international transactions
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-green-800 mb-2">
              {cardType === 'virtual' ? 'Your card will be issued instantly' : 'Your card application is ready to submit'}
            </h5>
            <p className="text-sm text-green-700">
              {cardType === 'virtual' 
                ? 'Once submitted, your virtual card will be available immediately in your dashboard.' 
                : 'Your physical card will be delivered to your registered address within 7-10 business days after approval.'}
            </p>
          </div>
          
          <h4 className="font-medium text-gray-800 mb-4">Summary</h4>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Card Type</span>
              <span className="font-medium">{cardType === 'physical' ? 'Physical Card' : 'Virtual Card'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Card Network</span>
              <span className="font-medium">{cardNetwork}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Card Name</span>
              <span className="font-medium">RAHUL SHARMA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Limit</span>
              <span className="font-medium">₹50,000</span>
            </div>
            {cardType === 'physical' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Contactless</span>
                <span className="font-medium">Enabled</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Application Fee</span>
              <span className="font-medium">{cardType === 'physical' ? '₹500' : 'Free'}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600">terms and conditions</a> for card issuance
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {step < 3 ? 'Continue' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};

// Main Card Management Component
export default function CardManagement() {
  const [cards, setCards] = useState<Card[]>(demoCards);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  // Handle card freeze/unfreeze
  const handleFreezeCard = (cardId: string, freeze: boolean) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, isFrozen: freeze } 
        : card
    ));
    
    // Update selected card if it's the one being modified
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({ ...selectedCard, isFrozen: freeze });
    }
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Card Management</h2>
          <p className="text-gray-600">Manage your physical and virtual cards</p>
        </div>
        
        <button 
          onClick={() => setShowNewCardForm(true)}
          className="mt-3 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
        >
          <span className="mr-1">+</span> Apply for New Card
        </button>
      </div>
      
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <CardItem 
              key={card.id} 
              card={card} 
              isSelected={selectedCard?.id === card.id}
              onClick={() => setSelectedCard(card)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">💳</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Cards Found</h3>
          <p className="text-gray-600 mb-6">
            You don't have any cards yet. Apply for a new card to get started.
          </p>
          <button 
            onClick={() => setShowNewCardForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply for New Card
          </button>
        </div>
      )}
      
      {/* Card Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <CardDetails 
              card={selectedCard} 
              onClose={() => setSelectedCard(null)}
              onFreeze={handleFreezeCard}
            />
          </div>
        </div>
      )}
      
      {/* New Card Application Modal */}
      {showNewCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <NewCardApplication onClose={() => setShowNewCardForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}