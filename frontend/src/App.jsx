import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PaymentModal from './components/common/PaymentModal';
import SearchModal from './components/common/SearchModal';

import Home from './pages/Home';
import CalculatorsDirectory from './pages/CalculatorsDirectory';
import CalculatorView from './pages/CalculatorView';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import SuperadminDashboard from './pages/SuperadminDashboard';
import { 
  AboutPage, ContactPage, PrivacyPolicyPage, 
  TermsPage, RefundPolicyPage, DisclaimerPage 
} from './pages/Legal';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isSuperadmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!isSuperadmin) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanCode, setSelectedPlanCode] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleOpenPayment = (planCode = null) => {
    setSelectedPlanCode(planCode);
    setPaymentModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenPayment={() => handleOpenPayment()}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenPayment={handleOpenPayment} onOpenSearch={() => setSearchModalOpen(true)} />} />
          <Route path="/calculators" element={<CalculatorsDirectory />} />
          <Route path="/calculator/:id" element={<CalculatorView onOpenPayment={handleOpenPayment} />} />
          <Route path="/pricing" element={<Pricing onOpenPayment={handleOpenPayment} />} />
          
          <Route path="/login" element={<Auth initialMode="login" />} />
          <Route path="/register" element={<Auth initialMode="register" />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard onOpenPayment={handleOpenPayment} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <SuperadminDashboard />
              </AdminRoute>
            }
          />

          {/* Legal Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        preselectedPlanId={selectedPlanCode}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
