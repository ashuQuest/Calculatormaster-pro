import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import PaymentModal from './components/common/PaymentModal';
import SearchModal from './components/common/SearchModal';

import Home from './pages/Home';
import CalculatorsDirectory from './pages/CalculatorsDirectory';
import CalculatorView from './pages/CalculatorView';
import FormulasDirectory from './pages/FormulasDirectory';
import FormulaDetail from './pages/FormulaDetail';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import SuperadminDashboard from './pages/SuperadminDashboard';
import NotFound from './pages/NotFound';
import { 
  AboutPage, ContactPage, PrivacyPolicyPage, 
  TermsPage, RefundPolicyPage, DisclaimerPage 
} from './pages/Legal';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-charcoal-400 bg-cream-50 dark:bg-charcoal-950">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        <span>Authenticating...</span>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isSuperadmin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-charcoal-400 bg-cream-50 dark:bg-charcoal-950">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        <span>Verifying admin permissions...</span>
      </div>
    </div>
  );
  if (!isSuperadmin) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-cream-50 dark:bg-charcoal-950 text-charcoal-700 dark:text-cream-100 flex">
      {/* Noventra Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenPayment={() => handleOpenPayment()}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 w-full min-w-0 transition-all">
        <Navbar
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenPayment={() => handleOpenPayment()}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />

        <main className="flex-1">
          <Routes>
            {/* Core Home & Calculators */}
            <Route path="/" element={<Home onOpenPayment={handleOpenPayment} onOpenSearch={() => setSearchModalOpen(true)} />} />
            <Route path="/calculators" element={<CalculatorsDirectory />} />
            <Route path="/calculators/:category" element={<CalculatorsDirectory />} />
            <Route path="/calculator/:id" element={<CalculatorView onOpenPayment={handleOpenPayment} />} />
            
            {/* Formula Library */}
            <Route path="/formulas" element={<FormulasDirectory />} />
            <Route path="/formulas/:category" element={<FormulasDirectory />} />
            <Route path="/formula/:slug" element={<FormulaDetail />} />

            {/* Pricing & Auth */}
            <Route path="/pricing" element={<Pricing onOpenPayment={handleOpenPayment} />} />
            <Route path="/login" element={<Auth initialMode="login" />} />
            <Route path="/register" element={<Auth initialMode="register" />} />

            {/* User Workspace Shortcuts */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard onOpenPayment={handleOpenPayment} />
                </ProtectedRoute>
              }
            />
            <Route path="/favorites" element={<Navigate to="/dashboard?tab=saved" replace />} />
            <Route path="/history" element={<Navigate to="/dashboard?tab=history" replace />} />
            <Route path="/profile" element={<Navigate to="/dashboard?tab=settings" replace />} />

            {/* Superadmin Center */}
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

            {/* Dedicated 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>

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
