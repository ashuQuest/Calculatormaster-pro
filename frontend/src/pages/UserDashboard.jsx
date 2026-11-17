import React, { useState, useEffect } from 'react';
import { 
  User, Crown, Shield, Clock, FileText, Download, Trash2, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Bookmark, Star, Key, 
  ArrowRight, CreditCard, ChevronRight, Calculator
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
      await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
      setPasswordMsg('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cream-200 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 flex items-center justify-center font-extrabold text-xl uppercase border border-cream-300 dark:border-charcoal-600 shrink-0">
            {user?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 tracking-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </h1>
              {isSuperadmin ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center gap-1 uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5" /> OWNER
                </span>
              ) : hasPremium ? (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase tracking-wider">
                  PRO ACTIVE
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-cream-200 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-200 border border-cream-300 dark:border-charcoal-600 uppercase tracking-wider">
                  FREE TIER
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="p-4 rounded-xl bg-cream-50 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 flex items-center justify-between gap-6 shrink-0">
          <div>
            <span className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">Subscription Status</span>
            <p className="text-sm font-bold text-charcoal-700 dark:text-cream-100">
              {isSuperadmin 
                ? 'Owner Lifetime Pass' 
                : subscriptionInfo?.subscription?.plan?.name 
                  ? `${subscriptionInfo.subscription.plan.name} Pass` 
                  : 'Free Basic Tier'}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-0.5">
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
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
            >
              {hasPremium ? 'Extend Pass' : 'Upgrade to Pro (₹9)'}
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Metrics Row (Noventra Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Total Calculations</span>
            <div className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-600 dark:text-cream-200">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">{history.length}</p>
          <span className="text-[11px] text-charcoal-400">Stored in your cloud account</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Saved Formulas</span>
            <div className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-600 dark:text-cream-200">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">{savedCalculations.length}</p>
          <span className="text-[11px] text-charcoal-400">Quick-access presets</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">UPI Submissions</span>
            <div className="w-8 h-8 rounded-lg bg-cream-100 dark:bg-charcoal-700 flex items-center justify-center text-charcoal-600 dark:text-cream-200">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">{payments.length}</p>
          <span className="text-[11px] text-charcoal-400">Verification requests</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Account Access</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/80 flex items-center justify-center text-orange-600">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">
            {hasPremium ? 'Pro' : 'Free'}
          </p>
          <span className="text-[11px] text-charcoal-400">
            {hasPremium ? 'All 40+ calculators unlocked' : 'Upgrade for exports & AI'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-cream-400 dark:border-charcoal-700 gap-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'history' 
              ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' 
              : 'text-charcoal-400 dark:text-charcoal-300 hover:text-charcoal-700 dark:hover:text-cream-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Calculation History ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'payments' 
              ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' 
              : 'text-charcoal-400 dark:text-charcoal-300 hover:text-charcoal-700 dark:hover:text-cream-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>UPI Payment Requests ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'saved' 
              ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' 
              : 'text-charcoal-400 dark:text-charcoal-300 hover:text-charcoal-700 dark:hover:text-cream-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Formulas & Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
            activeTab === 'settings' 
              ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' 
              : 'text-charcoal-400 dark:text-charcoal-300 hover:text-charcoal-700 dark:hover:text-cream-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* TAB 1: Calculation History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Recent Calculations</h2>
              <p className="text-xs text-charcoal-400">All computations performed while signed in.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft"
              >
                <Download className="w-3.5 h-3.5 text-charcoal-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportPdf}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-100 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-soft"
              >
                <Download className="w-3.5 h-3.5 text-charcoal-500" />
                <span>Export PDF</span>
              </button>

              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-red-50 dark:bg-charcoal-700 dark:hover:bg-red-950/30 text-charcoal-600 hover:text-red-600 border border-cream-400 dark:border-charcoal-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 space-y-3 shadow-soft">
              <Clock className="w-10 h-10 text-charcoal-300 mx-auto" />
              <p className="text-sm font-bold text-charcoal-700 dark:text-cream-100">No calculation history yet</p>
              <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
                Start using our calculators to record your inputs, results, and step-by-step logic here automatically.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Calculator</th>
                      <th className="py-3 px-4">Inputs</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors">
                        <td className="py-3 px-4 font-bold text-charcoal-700 dark:text-cream-100">
                          {item.calculator_name || item.calculator_slug}
                        </td>
                        <td className="py-3 px-4 text-charcoal-500 dark:text-charcoal-300 font-mono text-[11px] max-w-xs truncate">
                          {typeof item.inputs === 'object' ? JSON.stringify(item.inputs) : String(item.inputs)}
                        </td>
                        <td className="py-3 px-4 font-bold text-orange-600 font-mono text-xs">
                          {typeof item.result_summary === 'object' 
                            ? JSON.stringify(item.result_summary) 
                            : String(item.result_summary || item.result || '')}
                        </td>
                        <td className="py-3 px-4 text-charcoal-400 text-[11px]">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UPI Payment Requests */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Manual UPI Payment Requests</h2>
              <p className="text-xs text-charcoal-400">Track verification status of your plan purchases.</p>
            </div>
            <button
              onClick={() => onOpenPayment?.()}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
            >
              + New Payment Request
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 space-y-3 shadow-soft">
              <FileText className="w-10 h-10 text-charcoal-300 mx-auto" />
              <p className="text-sm font-bold text-charcoal-700 dark:text-cream-100">No payment requests submitted</p>
              <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
                Ready to upgrade? Choose any plan and pay via dynamic UPI QR code.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">UTR Reference</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                    {payments.map((p) => {
                      const isPending = p.status === 'PENDING';
                      const isApproved = p.status === 'APPROVED';
                      const isRejected = p.status === 'REJECTED';

                      return (
                        <tr key={p.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors">
                          <td className="py-3 px-4 font-bold text-charcoal-700 dark:text-cream-100">
                            {p.plan_details?.name || p.plan_code || 'Subscription'}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-orange-600">
                            ₹{p.claimed_amount}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-charcoal-600 dark:text-cream-200 text-[11px]">
                            {p.utr}
                          </td>
                          <td className="py-3 px-4">
                            {isPending && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                PENDING VERIFICATION
                              </span>
                            )}
                            {isApproved && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-950/80 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800">
                                APPROVED & ACTIVE
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800">
                                REJECTED
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-charcoal-400 text-[11px]">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-charcoal-400 text-[11px]">
                            {p.rejection_reason || (isApproved ? 'Verified by Admin' : 'Review in progress')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Saved Formulas */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Saved Formulas & Presets</h2>
            <p className="text-xs text-charcoal-400">Save custom inputs for fast repeated calculation runs.</p>
          </div>

          {savedCalculations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 space-y-3 shadow-soft">
              <Bookmark className="w-10 h-10 text-charcoal-300 mx-auto" />
              <p className="text-sm font-bold text-charcoal-700 dark:text-cream-100">No saved presets found</p>
              <p className="text-xs text-charcoal-400 max-w-sm mx-auto">
                While using any calculator, click 'Save Formula' to bookmark your favorite variable setups.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCalculations.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
                  <h4 className="text-sm font-bold text-charcoal-700 dark:text-cream-100">{item.title}</h4>
                  <p className="text-xs text-charcoal-400 mt-1">{item.calculator_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Security Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-5">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Change Password</h2>
              <p className="text-xs text-charcoal-400">Ensure your account uses a secure password.</p>
            </div>

            {passwordMsg && (
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 text-green-700 dark:text-green-400 text-xs">
                {passwordMsg}
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 dark:text-red-400 text-xs">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
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
