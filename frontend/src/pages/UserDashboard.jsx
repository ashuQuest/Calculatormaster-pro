import React, { useState, useEffect } from 'react';
import { 
  User, Crown, Shield, Clock, FileText, Download, Trash2, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Bookmark, Star, Key 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscriptionApi, paymentApi, calculatorApi, authApi } from '../services/api';

export default function UserDashboard({ onOpenPayment }) {
  const { user, isSuperadmin, hasPremium, refreshUserProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'payments', 'saved', 'settings'
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [savedCalculations, setSavedCalculations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [subRes, histRes, payRes] = await Promise.all([
        subscriptionApi.getMySubscription().catch(() => null),
        calculatorApi.getHistory().catch(() => null),
        paymentApi.getMyHistory().catch(() => null),
      ]);

      if (subRes?.data?.success) setSubscriptionInfo(subRes.data);
      if (histRes?.data?.results) setHistory(histRes.data.results);
      else if (Array.isArray(histRes?.data)) setHistory(histRes.data);

      if (payRes?.data?.results) setPayments(payRes.data.results);
      else if (Array.isArray(payRes?.data)) setPayments(payRes.data);

      if (hasPremium) {
        const savedRes = await calculatorApi.getSaved().catch(() => null);
        if (savedRes?.data?.results) setSavedCalculations(savedRes.data.results);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your calculation history?')) return;
    try {
      await calculatorApi.clearHistory();
      setHistory([]);
      setActionMsg('History cleared successfully.');
      setTimeout(() => setActionMsg(''), 2500);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await calculatorApi.exportCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `calcmaster_history_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('CSV Export is a premium feature. Please upgrade to export calculations.');
    }
  };

  const handleExportPdf = async () => {
    try {
      const res = await calculatorApi.exportPdf();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `calcmaster_history_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('PDF Export is a premium feature. Please upgrade to export calculations.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    try {
      const res = await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (res.data.success) {
        setPasswordMsg('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.error?.details?.new_password?.[0] || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner / Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-extrabold text-2xl uppercase text-white shadow-xl shadow-sky-500/20 shrink-0">
            {user?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}</h1>
              {isSuperadmin ? (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> OWNER LIFETIME
                </span>
              ) : hasPremium ? (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  PRO ACTIVE
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
                  FREE USER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 flex items-center justify-between gap-6 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Subscription Plan</span>
            <p className="text-sm font-bold text-white">
              {isSuperadmin 
                ? 'Owner Lifetime Pass' 
                : subscriptionInfo?.subscription?.plan?.name 
                  ? `${subscriptionInfo.subscription.plan.name} Pass` 
                  : 'Free Basic Tier'}
            </p>
            <p className="text-xs text-emerald-400 mt-0.5">
              {isSuperadmin 
                ? 'Unlimited Lifetime Access' 
                : subscriptionInfo?.subscription?.remaining_days 
                  ? `${subscriptionInfo.subscription.remaining_days} days remaining` 
                  : 'Limited Cloud History'}
            </p>
          </div>

          {!isSuperadmin && (
            <button
              onClick={() => onOpenPayment?.()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20"
            >
              {hasPremium ? 'Extend Plan' : 'Upgrade to Pro (₹9)'}
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${activeTab === 'history' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Clock className="w-4 h-4" />
          <span>Calculation History ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${activeTab === 'payments' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-4 h-4" />
          <span>UPI Payment Requests ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${activeTab === 'saved' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Formulas & Folders</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${activeTab === 'settings' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'}`}
        >
          <Key className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* TAB 1: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Recent Calculations</h3>
              <p className="text-xs text-slate-400">
                {!hasPremium && "Free accounts store last 10 calculations. Upgrade for unlimited history."}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Export PDF</span>
              </button>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {history.length > 0 ? (
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              {history.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.calculator_name}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Results: <span className="text-sky-300 font-mono">{JSON.stringify(item.results)}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    to={`/calculator/${item.calculator_id}`}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 font-semibold"
                  >
                    Open Tool
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 text-xs">
              No calculation history recorded yet. Explore our calculators and perform calculations!
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Your UPI Payment Requests</h3>
              <p className="text-xs text-slate-400">Track verification status, admin approval, and rejection notes.</p>
            </div>
            <button
              onClick={() => onOpenPayment?.()}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
            >
              Submit New Payment
            </button>
          </div>

          {payments.length > 0 ? (
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              {payments.map((p) => (
                <div key={p.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-sky-400">{p.request_id}</span>
                      <span className="text-xs text-slate-400">({p.plan?.name} Plan)</span>
                    </div>
                    
                    {p.status === 'APPROVED' ? (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 self-start sm:self-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED & ACTIVATED
                      </span>
                    ) : p.status === 'REJECTED' ? (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 self-start sm:self-auto">
                        <AlertCircle className="w-3.5 h-3.5" /> REJECTED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 self-start sm:self-auto">
                        <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-850 p-3 rounded-xl">
                    <div>
                      <span className="text-slate-400">Expected:</span>
                      <p className="font-bold text-white">₹{p.expected_amount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Claimed:</span>
                      <p className="font-bold text-emerald-400">₹{p.claimed_amount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">UTR / Ref:</span>
                      <p className="font-mono font-bold text-slate-200">{p.utr}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Submitted:</span>
                      <p className="text-slate-300">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Rejection Reason Box */}
                  {p.status === 'REJECTED' && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        Admin Rejection Reason:
                      </p>
                      <p className="pl-5 text-slate-300">{p.rejection_reason || 'Transaction could not be verified against bank records.'}</p>
                      <div className="pt-2 pl-5">
                        <button
                          onClick={() => onOpenPayment?.(p.plan?.code)}
                          className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs"
                        >
                          Submit Corrected Payment Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 text-xs">
              You haven't submitted any payment requests yet. Upgrade to Pro to activate full premium access!
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED CALCULATIONS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Saved Calculations & Formulas</h3>
              <p className="text-xs text-slate-400">Organize and bookmark specific calculation outputs with custom notes.</p>
            </div>
          </div>

          {!hasPremium ? (
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Premium Feature</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Saving custom calculations into folders and storing formulas requires an active CalcMaster Pro subscription.
              </p>
              <button
                onClick={() => onOpenPayment?.()}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs"
              >
                Upgrade to Pro (from ₹9)
              </button>
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 text-xs">
              Saved calculation folders active. Click "Save to Cloud" on any calculator page to add records here.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Change Password
            </h3>

            {passwordMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {passwordMsg}
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs mt-2"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
