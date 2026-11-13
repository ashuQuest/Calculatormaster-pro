import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CreditCard, DollarSign, Settings, FileText, 
  CheckCircle2, XCircle, AlertCircle, Clock, Eye, Download, 
  Lock, Unlock, Sparkles, Search, RefreshCw, QrCode, Crown 
} from 'lucide-react';
import { adminApi } from '../services/api';
import scannerImg from '../assets/phonepe_scanner.jpg';

export default function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments', 'users', 'plans', 'settings', 'logs'
  const [overviewStats, setOverviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');

  // Payments Tab
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('PENDING'); // 'PENDING', 'APPROVED', 'REJECTED', 'ALL'
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // Decision Modal
  const [decisionModal, setDecisionModal] = useState({ open: false, req: null, action: '' });
  const [rejectionReason, setRejectionReason] = useState('');

  // Users Tab
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Plans Tab
  const [plansList, setPlansList] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  // Settings Tab
  const [settingsData, setSettingsData] = useState({
    upi_id: '6205433088-2@ybl',
    payee_name: 'ASHUTOSH KUMAR',
    is_upi_enabled: true,
    payment_instructions: '',
    support_contact: '',
  });

  // Logs Tab
  const [logsList, setLogsList] = useState([]);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOverview();
      if (res.data.success) {
        setOverviewStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await adminApi.getRequests({
        status: paymentStatusFilter,
        search: paymentSearch
      });
      const list = res.data.results || res.data;
      setPaymentRequests(list);
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await adminApi.getUsers({ search: userSearch });
      const list = res.data.results || res.data;
      setUsersList(list);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadPlans = async () => {
    try {
      const res = await adminApi.getPlans();
      const list = res.data.results || res.data;
      setPlansList(list);
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      if (res.data.success) {
        setSettingsData(res.data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await adminApi.getLogs();
      const list = res.data.results || res.data;
      setLogsList(list);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  // Switch tab loader
  useEffect(() => {
    if (activeTab === 'overview') loadOverview();
    else if (activeTab === 'payments') loadPayments();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'plans') loadPlans();
    else if (activeTab === 'settings') loadSettings();
    else if (activeTab === 'logs') loadLogs();
  }, [activeTab, paymentStatusFilter]);

  // Payment Decisions
  const handlePaymentDecision = async () => {
    const { req, action } = decisionModal;
    if (!req) return;

    try {
      const res = await adminApi.makePaymentDecision(
        req.id,
        action,
        action === 'REJECT' ? rejectionReason : ''
      );
      if (res.data.success) {
        setActionNotice(res.data.message);
        setDecisionModal({ open: false, req: null, action: '' });
        setRejectionReason('');
        loadPayments();
        loadOverview();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment action failed.');
    }
  };

  // User Actions (Block / Grant Premium)
  const handleUserAction = async (userId, act, extra = {}) => {
    try {
      const res = await adminApi.performUserAction(userId, act, extra);
      if (res.data.success) {
        setActionNotice(res.data.message);
        loadUsers();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.updateSettings(settingsData);
      if (res.data.success) {
        setActionNotice('Website and UPI settings updated successfully.');
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert('Failed to update settings.');
    }
  };

  // Save Plan update
  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const res = await adminApi.updatePlan(editingPlan.id, {
        price: editingPlan.price,
        duration_days: editingPlan.duration_days,
        is_active: editingPlan.is_active,
        name: editingPlan.name,
      });
      if (res.data) {
        setActionNotice('Plan updated successfully.');
        setEditingPlan(null);
        loadPlans();
        setTimeout(() => setActionNotice(''), 3000);
      }
    } catch (err) {
      alert('Failed to update plan.');
    }
  };

  // Export Revenue CSV
  const handleExportRevenue = async () => {
    try {
      const res = await adminApi.exportRevenueCsv();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `calcmaster_revenue_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export revenue report.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10 shrink-0">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Superadmin Control Center</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PLATFORM OWNER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage users, verify UPI payments, configure pricing plans, and monitor platform health.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportRevenue}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold self-start sm:self-auto border border-slate-700"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Revenue Report (CSV)</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Shield },
          { id: 'payments', label: `Payment Approvals (${overviewStats?.stats?.pending_payments || 0})`, icon: CreditCard },
          { id: 'users', label: 'Users Directory', icon: Users },
          { id: 'plans', label: 'Subscription Plans', icon: DollarSign },
          { id: 'settings', label: 'Website & UPI Settings', icon: Settings },
          { id: 'logs', label: 'Audit Logs', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overviewStats && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Total Users</span>
              <p className="text-3xl font-black text-white mt-2">{overviewStats.stats.total_users}</p>
              <p className="text-[11px] text-slate-500 mt-1">{overviewStats.stats.free_users} Free Tier</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Active Premium Users</span>
              <p className="text-3xl font-black text-sky-400 mt-2">{overviewStats.stats.active_premium_users}</p>
              <p className="text-[11px] text-slate-500 mt-1">{overviewStats.stats.expired_subscriptions} Expired</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Pending Approvals</span>
              <p className="text-3xl font-black text-amber-400 mt-2">{overviewStats.stats.pending_payments}</p>
              <p className="text-[11px] text-slate-500 mt-1">{overviewStats.stats.approved_payments} Approved</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Verified Revenue</span>
              <p className="text-3xl font-black text-emerald-400 mt-2">₹{overviewStats.stats.verified_revenue.toFixed(2)}</p>
              <p className="text-[11px] text-slate-500 mt-1">From Bank Verified Credits</p>
            </div>
          </div>

          {/* Popular Calculators & Plan Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Popular Calculators Usage</h3>
              <div className="space-y-3">
                {overviewStats.popular_calculators.length > 0 ? (
                  overviewStats.popular_calculators.map(c => (
                    <div key={c.calculator_id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                      <div>
                        <span className="font-bold text-white">{c.calculator_name}</span>
                        <span className="text-slate-400 ml-2">({c.category})</span>
                      </div>
                      <span className="font-mono font-bold text-sky-400">{c.usage_count} calculations</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">No calculation telemetry logged yet.</p>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Breakdown by Plan</h3>
              <div className="space-y-3">
                {overviewStats.plan_breakdown.length > 0 ? (
                  overviewStats.plan_breakdown.map(p => (
                    <div key={p.payment_request__plan__name || 'N/A'} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                      <span className="font-bold text-white">{p.payment_request__plan__name || 'Custom'}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400">{p.count} purchases</span>
                        <span className="font-bold text-emerald-400 font-mono">₹{p.revenue}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4">No verified transactions yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS VERIFICATION */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(st => (
                <button
                  key={st}
                  onClick={() => setPaymentStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${paymentStatusFilter === st ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadPayments()}
                placeholder="Search UTR, Request ID, Payer..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          {paymentRequests.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Payer / UPI</th>
                    <th className="py-3 px-4">Plan / Amounts</th>
                    <th className="py-3 px-4">UTR Reference</th>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {paymentRequests.map(req => {
                    const isMismatch = Number(req.claimed_amount) !== Number(req.expected_amount);
                    return (
                      <tr key={req.id} className="hover:bg-slate-850/50">
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">{req.request_id}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{req.user?.username}</p>
                          <p className="text-[10px] text-slate-500">{req.user?.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{req.payer_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.payer_upi_id || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{req.plan?.name}</p>
                          <p className="text-[10px]">
                            Exp: <span className="font-bold text-white">₹{req.expected_amount}</span> | Claim: <span className={`font-bold ${isMismatch ? 'text-rose-400' : 'text-emerald-400'}`}>₹{req.claimed_amount}</span>
                          </p>
                          {isMismatch && (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                              AMOUNT MISMATCH
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">{req.utr}</td>
                        <td className="py-3 px-4">
                          {req.screenshot ? (
                            <button
                              onClick={() => setSelectedScreenshot(req.screenshot)}
                              className="flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <span className="text-slate-500">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {req.status === 'APPROVED' ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">APPROVED</span>
                          ) : req.status === 'REJECTED' ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">REJECTED</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">PENDING</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {req.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setDecisionModal({ open: true, req, action: 'ACCEPT' })}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => setDecisionModal({ open: true, req, action: 'REJECT' })}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-[11px]"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              {req.approved_by_username ? `By ${req.approved_by_username}` : 'Processed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500 text-xs">
              No payment requests found for the selected filter.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                placeholder="Search username or email..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-4 font-bold text-white">{u.username}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      {u.is_superadmin ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">OWNER</span>
                      ) : u.has_premium ? (
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold text-[10px]">PREMIUM</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">FREE</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {u.is_blocked ? (
                        <span className="text-rose-400 font-bold text-[10px]">BLOCKED</span>
                      ) : (
                        <span className="text-emerald-400 font-medium text-[10px]">ACTIVE</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {!u.is_superadmin && (
                        <>
                          <button
                            onClick={() => handleUserAction(u.id, 'toggle_block')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                          >
                            {u.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                          {u.has_premium ? (
                            <button
                              onClick={() => handleUserAction(u.id, 'revoke_premium')}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs"
                            >
                              Revoke Pro
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(u.id, 'grant_premium', { days: 365 })}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs"
                            >
                              Grant 1-Yr Pro
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plansList.map(plan => (
              <div key={plan.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">{plan.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${plan.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {plan.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-sky-400">₹{plan.price}</span>
                  <span className="text-xs text-slate-400">/ {plan.duration_days} days</span>
                </div>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Edit Pricing & Duration
                </button>
              </div>
            ))}
          </div>

          {editingPlan && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-sky-500 max-w-lg space-y-4">
              <h4 className="font-bold text-white text-sm">Edit Plan: {editingPlan.name}</h4>
              <form onSubmit={handleSavePlan} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={editingPlan.duration_days}
                      onChange={(e) => setEditingPlan({ ...editingPlan, duration_days: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="planActive"
                    checked={editingPlan.is_active}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="planActive" className="text-xs text-slate-300">Plan is active for purchase</label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-4 py-2 rounded-lg bg-sky-500 text-white font-bold text-xs">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setEditingPlan(null)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WEBSITE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Platform & UPI Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Owner Payee UPI ID *</label>
                <input
                  type="text"
                  required
                  value={settingsData.upi_id}
                  onChange={(e) => setSettingsData({ ...settingsData, upi_id: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payee Name *</label>
                <input
                  type="text"
                  required
                  value={settingsData.payee_name}
                  onChange={(e) => setSettingsData({ ...settingsData, payee_name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Support Contact Details</label>
              <input
                type="text"
                value={settingsData.support_contact}
                onChange={(e) => setSettingsData({ ...settingsData, support_contact: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Payment Instructions to Users</label>
              <textarea
                rows={4}
                value={settingsData.payment_instructions}
                onChange={(e) => setSettingsData({ ...settingsData, payment_instructions: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs leading-relaxed"
              />
            </div>

            {/* Current Scanner Preview */}
            <div className="pt-2 flex items-center gap-4">
              <img src={scannerImg} alt="Scanner" className="w-20 h-20 rounded-xl object-cover border border-slate-700" />
              <div className="text-xs text-slate-400">
                <p className="font-bold text-white">Active PhonePe QR Scanner Card</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Decoded VPA: {settingsData.upi_id}</p>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20"
            >
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Target User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logsList.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-4 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{log.action}</td>
                    <td className="py-3 px-4 font-semibold text-white">{log.admin_username || 'System'}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-md">{log.description}</td>
                    <td className="py-3 px-4 text-sky-400">{log.target_username || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h4 className="text-sm font-bold text-white mb-3">Payment Receipt Screenshot</h4>
            <img src={selectedScreenshot} alt="Receipt" className="max-h-[75vh] mx-auto rounded-xl border border-slate-800" />
          </div>
        </div>
      )}

      {/* Decision Modal (Accept or Reject) */}
      {decisionModal.open && decisionModal.req && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">
              {decisionModal.action === 'ACCEPT' ? 'Approve & Activate Premium' : 'Reject Payment Request'}
            </h3>
            
            <p className="text-xs text-slate-300">
              Request ID: <span className="font-mono font-bold text-sky-400">{decisionModal.req.request_id}</span> for user <span className="font-bold text-white">{decisionModal.req.user?.username}</span>
            </p>

            {decisionModal.action === 'ACCEPT' ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <p className="font-bold">Confirmation Checklist:</p>
                <p>• Verified actual credit of <strong>₹{decisionModal.req.expected_amount}</strong> in bank.</p>
                <p>• UTR: <strong>{decisionModal.req.utr}</strong>.</p>
                <p>• Plan: <strong>{decisionModal.req.plan?.name}</strong> will be activated.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-rose-300">Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR not found in bank statement, amount mismatch, etc."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handlePaymentDecision}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white ${decisionModal.action === 'ACCEPT' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'}`}
              >
                Confirm {decisionModal.action}
              </button>
              <button
                onClick={() => setDecisionModal({ open: false, req: null, action: '' })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
