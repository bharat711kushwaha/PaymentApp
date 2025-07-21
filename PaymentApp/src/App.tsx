// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/auth/LoginForm';
import OtpVerification from './components/auth/OtpVerification';
import Dashboard from './components/dashboard/Dashboard';
import SavingsAccount from './components/accounts/SavingsAccount';
import BillPayment from './components/bills/BillPayment';
import CardManagement from './components/cards/CardManagement';
import PaymentInterface from './components/payments/PaymentInterface';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Footer from './components/common/Footer'; // Add this import

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isOtpVerified } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAuthenticated && !isOtpVerified) {
    return <Navigate to="/verify-otp" replace />;
  }
  
  return <>{children}</>;
};

// Layout for authenticated pages with sidebar and header (NO footer here)
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Banking App" />
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// New wrapper that includes footer for ALL pages
const PageWithFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

// Layout for auth pages (login/OTP) - just content, footer handled by PageWithFooter
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1">
      {children}
    </div>
  );
};

// App routes with auth check
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes with PageWithFooter wrapper */}
      <Route 
        path="/login" 
        element={
          <PageWithFooter>
            <AuthLayout>
              <LoginForm />
            </AuthLayout>
          </PageWithFooter>
        } 
      />
      <Route 
        path="/verify-otp" 
        element={
          <PageWithFooter>
            <AuthLayout>
              <OtpVerification />
            </AuthLayout>
          </PageWithFooter>
        } 
      />
      
      {/* Protected routes with AppLayout wrapped in PageWithFooter */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <PageWithFooter>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PageWithFooter>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/savings" 
        element={
          <ProtectedRoute>
            <PageWithFooter>
              <AppLayout>
                <SavingsAccount />
              </AppLayout>
            </PageWithFooter>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/payments" 
        element={
          <ProtectedRoute>
            <PageWithFooter>
              <AppLayout>
                <PaymentInterface />
              </AppLayout>
            </PageWithFooter>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/bills" 
        element={
          <ProtectedRoute>
            <PageWithFooter>
              <AppLayout>
                <BillPayment />
              </AppLayout>
            </PageWithFooter>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cards" 
        element={
          <ProtectedRoute>
            <PageWithFooter>
              <AppLayout>
                <CardManagement />
              </AppLayout>
            </PageWithFooter>
          </ProtectedRoute>
        } 
      />
      
      {/* Add other routes for all remaining banking services */}
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App component that wraps everything with providers
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;