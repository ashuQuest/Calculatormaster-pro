import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Calculator, Lock, Mail, User, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth({ initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(usernameOrEmail, password);
        navigate(redirectPath);
      } else {
        if (password !== passwordConfirm) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        await register({
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          password,
          password_confirm: passwordConfirm,
        });
        navigate(redirectPath);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.error?.details || 
                  err.response?.data?.message || 
                  err.message || 
                  'Authentication failed. Please verify your details.';
      if (typeof msg === 'object') {
        const firstKey = Object.keys(msg)[0];
        const val = msg[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError(String(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft relative overflow-hidden">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-charcoal-700 dark:text-cream-100">
              CalcMaster <span className="text-orange-600">Pro</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-1">
            {isLogin ? 'Sign in to access your cloud calculation history' : 'Save calculations, formulas, and access premium tools'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-cream-100 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 mb-6">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              isLogin 
                ? 'bg-white dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 shadow-sm' 
                : 'text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              !isLogin 
                ? 'bg-white dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 shadow-sm' 
                : 'text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* LOGIN FORM */}
          {isLogin ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter username or email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          ) : (
            /* REGISTER FORM */
            <>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In to CalcMaster' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Admin Tip */}
        <div className="mt-6 pt-5 border-t border-cream-300 dark:border-charcoal-700 text-center">
          <p className="text-[11px] text-charcoal-400">
            Platform Owner: <span className="font-mono text-charcoal-600 dark:text-cream-200 font-semibold">admin</span> (CalcMaster 2026)
          </p>
        </div>

      </div>
    </div>
  );
}
