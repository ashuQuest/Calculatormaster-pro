import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calculator, Atom, Sigma, TrendingUp, 
  Briefcase, RefreshCw, Calendar, HeartPulse, Star, 
  Clock, CreditCard, Settings, Shield, Crown, Sparkles, 
  LogOut, X, ChevronRight, User, BookOpen 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose, onOpenPayment }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isSuperadmin, hasPremium, logout } = useAuth();

  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const navSections = [
    {
      title: 'PLATFORM',
      items: [
        { label: 'Overview', path: '/', icon: LayoutDashboard },
        { label: 'All Calculators', path: '/calculators', icon: Calculator },
        { label: 'Formula Library', path: '/formulas', icon: BookOpen, badge: '14 DISCIP' },
      ]
    },
    {
      title: 'CATEGORIES',
      items: [
        { label: 'Basic Math', path: '/calculators/basic', icon: Calculator },
        { label: 'Scientific', path: '/calculators/scientific', icon: Atom },
        { label: 'Mathematics', path: '/calculators/mathematical', icon: Sigma },
        { label: 'Financial & ROI', path: '/calculators/financial', icon: TrendingUp },
        { label: 'Business & Margin', path: '/calculators/business', icon: Briefcase },
        { label: 'Unit Converters', path: '/calculators/converters', icon: RefreshCw },
        { label: 'Date & Time', path: '/calculators/datetime', icon: Calendar },
        { label: 'Daily Life & Health', path: '/calculators/dailylife', icon: HeartPulse },
      ]
    },
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Favorites', path: '/favorites', icon: Star },
        { label: 'Calculation History', path: '/history', icon: Clock },
        { label: 'Pricing Plans', path: '/pricing', icon: CreditCard },
        { label: 'Settings & Profile', path: '/profile', icon: Settings },
      ]
    }
  ];

  if (isSuperadmin) {
    navSections.push({
      title: 'ADMINISTRATION',
      items: [
        { label: 'Superadmin Center', path: '/admin', icon: Shield, badge: 'OWNER' }
      ]
    });
  }

  const handleNavClick = (path) => {
    if (onClose) onClose();
    navigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden transition-opacity" 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 
        bg-cream-100 dark:bg-charcoal-900 
        border-r border-cream-400 dark:border-charcoal-600 
        flex flex-col justify-between 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-cream-400 dark:border-charcoal-600 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-charcoal-900 dark:text-white">
                  CalcMaster
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-charcoal-500 dark:text-charcoal-400 font-medium tracking-tight">
                One Platform. Every Calculation.
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-charcoal-400 dark:text-charcoal-400 uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item, itemIdx) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => handleNavClick(item.path)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium 
                        transition-all duration-150 group text-left
                        ${active 
                          ? 'bg-orange-600/10 dark:bg-orange-600/20 text-orange-600 dark:text-orange-400 font-semibold' 
                          : 'text-charcoal-700 dark:text-charcoal-200 hover:bg-cream-200/70 dark:hover:bg-charcoal-800 hover:text-charcoal-900 dark:hover:text-cream-100'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-orange-600 dark:text-orange-400' : 'text-charcoal-400 dark:text-charcoal-400 group-hover:text-charcoal-700 dark:group-hover:text-cream-100'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          {item.badge}
                        </span>
                      ) : active ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Premium Banner in Sidebar if not Premium */}
          {!hasPremium && (
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-charcoal-800 border border-orange-200 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-400">
                <Sparkles className="w-4 h-4" />
                <span>CalcMaster Pro Pass</span>
              </div>
              <p className="text-[11px] text-charcoal-500 dark:text-charcoal-300 leading-relaxed">
                Unlock all 40+ higher math, financial models, PDF exports & AI analysis.
              </p>
              <button
                onClick={() => { if (onClose) onClose(); onOpenPayment?.(); }}
                className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Upgrade from ₹9</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-cream-400 dark:border-charcoal-600 bg-cream-200/50 dark:bg-charcoal-850">
          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2.5">
              <Link 
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl bg-charcoal-700 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {user?.username?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-charcoal-900 dark:text-white truncate">
                      {user?.username}
                    </p>
                    {isSuperadmin ? (
                      <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                    ) : hasPremium ? (
                      <span className="text-[8px] font-bold text-orange-600 uppercase">PRO</span>
                    ) : null}
                  </div>
                  <p className="text-[10px] text-charcoal-400 truncate">
                    {user?.email || 'Active Account'}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); if (onClose) onClose(); }}
                className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-cream-300 dark:hover:bg-charcoal-800 transition-colors shrink-0"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 py-2 text-center rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-charcoal-900 dark:text-white text-xs font-semibold hover:bg-cream-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 py-2 text-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-soft"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
