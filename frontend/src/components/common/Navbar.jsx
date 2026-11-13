import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Sun, Moon, Search, User, Shield, 
  Crown, LogOut, Menu, X, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onOpenSearch, onOpenPayment }) {
  const { user, isAuthenticated, isSuperadmin, hasPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white dark:text-white">
                  CalcMaster
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
                One Platform. Every Calculation.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/calculators" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Directory
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing Plans
            </Link>
            <a href="/#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="/#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search (Ctrl+K)</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            {/* User State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xs uppercase text-white">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.username}</span>
                  {isSuperadmin ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" /> OWNER
                    </span>
                  ) : hasPremium ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      PRO
                    </span>
                  ) : null}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email || user?.username}</p>
                    </div>

                    {isSuperadmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-400 hover:bg-slate-800 font-medium"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Superadmin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 font-medium"
                    >
                      <User className="w-4 h-4 text-sky-400" />
                      User Dashboard
                    </Link>

                    {!hasPremium && (
                      <button
                        onClick={() => { setUserDropdown(false); onOpenPayment?.(); }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-emerald-400 hover:bg-slate-800 font-medium"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Upgrade to Premium
                      </button>
                    )}

                    <button
                      onClick={() => { setUserDropdown(false); logout(); navigate('/'); }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-slate-800 font-medium border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 transition-all hover:shadow-sky-500/30"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:bg-slate-700/80"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/calculators"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            All Calculators Directory
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Pricing & Subscription Plans
          </Link>
          <a
            href="/#features"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            Features
          </a>
          <a
            href="/#faq"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-slate-200 py-1.5"
          >
            FAQ
          </a>

          {!hasPremium && (
            <button
              onClick={() => { setMenuOpen(false); onOpenPayment?.(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-md"
            >
              <Sparkles className="w-4 h-4" /> Upgrade to Premium
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
