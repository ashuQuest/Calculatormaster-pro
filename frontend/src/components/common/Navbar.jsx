import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Sun, Moon, Search, User, Shield, 
  Crown, LogOut, Menu, Sparkles, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onOpenSearch, onOpenPayment, onToggleSidebar }) {
  const { user, isAuthenticated, isSuperadmin, hasPremium, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full bg-cream-100/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-cream-400 dark:border-charcoal-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Hamburger (Mobile) & Quick Search Trigger */}
          <div className="flex items-center gap-3">
            {/* Hamburger for Sidebar */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-charcoal-800 dark:text-white hover:bg-cream-200 dark:hover:bg-charcoal-800 lg:hidden transition-colors"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo for Mobile only (hidden on lg because sidebar is visible) */}
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight text-charcoal-900 dark:text-white">
                CalcMaster <span className="text-orange-600">Pro</span>
              </span>
            </Link>

            {/* Quick Search trigger (Noventra style) */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 hover:border-orange-500/50 text-xs font-semibold transition-all shadow-soft group"
            >
              <Search className="w-3.5 h-3.5 text-charcoal-500 group-hover:text-orange-600 transition-colors" />
              <span>Search calculators, formulas or tools...</span>
              <kbd className="ml-4 px-1.5 py-0.5 rounded bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 text-[10px] font-mono font-bold">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-xl text-charcoal-800 dark:text-white hover:bg-cream-200 dark:hover:bg-charcoal-800"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Upgrade CTA Button if not Premium */}
            {!hasPremium && (
              <button
                onClick={() => onOpenPayment?.()}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Pro (₹9)</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-800 dark:text-cream-100 hover:border-orange-500/50 transition-colors shadow-soft"
              title={theme === 'dark' ? 'Switch to Warm Cream Mode' : 'Switch to Dark Charcoal Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-charcoal-800" />
              )}
            </button>

            {/* User Dropdown / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-900 dark:text-white text-xs font-bold hover:border-orange-500/50 transition-colors shadow-soft"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                    {user?.username?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate">{user?.username}</span>
                  {isSuperadmin ? (
                    <Crown className="w-3 h-3 text-amber-500" />
                  ) : hasPremium ? (
                    <span className="text-[9px] font-bold text-orange-600">PRO</span>
                  ) : null}
                  <ChevronDown className="w-3 h-3 text-charcoal-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-card py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-cream-300 dark:border-charcoal-700">
                      <p className="text-[10px] text-charcoal-500 uppercase font-bold tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-charcoal-900 dark:text-white truncate">{user?.email || user?.username}</p>
                    </div>

                    {isSuperadmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-cream-100 dark:hover:bg-charcoal-700"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Superadmin Control</span>
                      </Link>
                    )}

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700"
                    >
                      <User className="w-3.5 h-3.5 text-charcoal-500" />
                      <span>User Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=history"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700"
                    >
                      <Calculator className="w-3.5 h-3.5 text-charcoal-500" />
                      <span>Calculation History</span>
                    </Link>

                    {!hasPremium && (
                      <button
                        onClick={() => { setUserDropdown(false); onOpenPayment?.(); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-orange-600 hover:bg-cream-100 dark:hover:bg-charcoal-700"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Upgrade to Pro (₹9)</span>
                      </button>
                    )}

                    <div className="border-t border-cream-300 dark:border-charcoal-700 my-1 pt-1">
                      <button
                        onClick={() => { setUserDropdown(false); logout(); }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-charcoal-800 dark:text-cream-100 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-soft transition-colors"
                >
                  Register Free
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
