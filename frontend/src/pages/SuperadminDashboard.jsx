import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CreditCard, DollarSign, Settings, FileText, 
  CheckCircle2, XCircle, AlertCircle, Clock, Eye, Download, 
  Lock, Unlock, Sparkles, Search, RefreshCw, QrCode, Crown, Check, X
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold border border-orange-200 dark:border-orange-800 shrink-0">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 tracking-tight">
                Superadmin Control Center
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 uppercase tracking-wider">
                PLATFORM OWNER
              </span>
            </div>
            <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mt-0.5">
              Manage users, verify UPI payments, configure pricing plans, and monitor platform health.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportRevenue}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs font-semibold self-start sm:self-auto border border-cream-400 dark:border-charcoal-600 transition-colors shadow-soft"
        >
          <Download className="w-4 h-4 text-orange-600" />
          <span>Export Revenue (CSV)</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex border-b border-cream-400 dark:border-charcoal-700 gap-6 text-xs font-bold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'payments', label: `UPI Payments (${overviewStats?.pending_verifications ?? paymentRequests.length})`, icon: CreditCard },
          { id: 'users', label: 'Users Management', icon: Users },
          { id: 'plans', label: 'Subscription Plans', icon: DollarSign },
          { id: 'settings', label: 'UPI & Merchant Setup', icon: Settings },
          { id: 'logs', label: 'Audit Logs', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 flex items-center gap-2 transition-colors relative whitespace-nowrap ${
                active 
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' 
                  : 'text-charcoal-400 dark:text-charcoal-300 hover:text-charcoal-700 dark:hover:text-cream-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
              <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Total Registered Users</span>
              <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">
                {overviewStats?.total_users ?? '—'}
              </p>
              <span className="text-[11px] text-green-600 font-semibold">Active accounts</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
              <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Pending UPI Approvals</span>
              <p className="text-2xl font-extrabold text-orange-600 mt-2">
                {overviewStats?.pending_verifications ?? '0'}
              </p>
              <span className="text-[11px] text-orange-600 font-semibold">Awaiting UTR match</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
              <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Total Revenue Collected</span>
              <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">
                ₹{overviewStats?.total_revenue ?? '0'}
              </p>
              <span className="text-[11px] text-charcoal-400">Manual UPI settlement</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft">
              <span className="text-xs font-semibold text-charcoal-400 dark:text-charcoal-300">Total Calculations Run</span>
              <p className="text-2xl font-extrabold text-charcoal-700 dark:text-cream-100 mt-2">
                {overviewStats?.total_calculations ?? '—'}
              </p>
              <span className="text-[11px] text-charcoal-400">Across 40+ calculators</span>
            </div>
          </div>

          {/* Quick Actions & Recent Pending Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Quick Verification Actions</h3>
                <p className="text-xs text-charcoal-400">Recent UPI requests that require your approval.</p>
              </div>
              <button
                onClick={() => setActiveTab('payments')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                View All Requests →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">UTR Reference</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                  {(overviewStats?.recent_payments || []).slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750">
                      <td className="py-2.5 px-3 font-semibold text-charcoal-700 dark:text-cream-100">{p.payer_name || p.user_username || 'Anonymous'}</td>
                      <td className="py-2.5 px-3 text-charcoal-600 dark:text-cream-200">{p.plan_name}</td>
                      <td className="py-2.5 px-3 font-extrabold text-orange-600">₹{p.claimed_amount}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-charcoal-500">{p.utr}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!overviewStats?.recent_payments || overviewStats.recent_payments.length === 0) && (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-charcoal-400">
                        No pending payment requests right now.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS VERIFICATION */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">UPI Payment Verifications</h2>
              <p className="text-xs text-charcoal-400">Inspect receipt screenshots and cross-check UTR numbers with your PhonePe app.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-cream-100 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 text-xs font-semibold">
              {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((st) => (
                <button
                  key={st}
                  onClick={() => setPaymentStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    paymentStatusFilter === st 
                      ? 'bg-orange-600 text-white shadow-sm' 
                      : 'text-charcoal-500 dark:text-charcoal-300 hover:text-charcoal-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">UTR Number</th>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                  {paymentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors">
                      <td className="py-3 px-4 font-bold text-charcoal-700 dark:text-cream-100">
                        {req.payer_name || req.user_details?.username || 'User'}
                      </td>
                      <td className="py-3 px-4 text-charcoal-600 dark:text-cream-200 font-medium">
                        {req.plan_details?.name || req.plan_code}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-orange-600">
                        ₹{req.claimed_amount}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-charcoal-700 dark:text-cream-100 text-[11px]">
                        {req.utr}
                      </td>
                      <td className="py-3 px-4">
                        {req.screenshot_url ? (
                          <button
                            onClick={() => setSelectedScreenshot(req.screenshot_url)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-charcoal-300 text-[11px]">No image</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : req.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-400 text-[11px]">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDecisionModal({ open: true, req, action: 'APPROVE' })}
                              className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => setDecisionModal({ open: true, req, action: 'REJECT' })}
                              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-charcoal-400 text-[11px]">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {paymentRequests.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-charcoal-400 text-xs">
                        No payment requests matching filter "{paymentStatusFilter}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Registered Users</h2>
              <p className="text-xs text-charcoal-400">View user credentials, grant Pro status, or toggle accounts.</p>
            </div>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search username or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500 shadow-soft"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750 transition-colors">
                      <td className="py-3 px-4 font-bold text-charcoal-700 dark:text-cream-100">
                        {u.username}
                      </td>
                      <td className="py-3 px-4 text-charcoal-600 dark:text-cream-200">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'SUPERADMIN' 
                            ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                            : u.role === 'PREMIUM'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-cream-200 text-charcoal-600 border border-cream-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-400 text-[11px]">
                        {new Date(u.date_joined).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {u.role !== 'SUPERADMIN' && (
                          <>
                            <button
                              onClick={() => handleUserAction(u.id, u.role === 'PREMIUM' ? 'REVOKE_PREMIUM' : 'GRANT_PREMIUM')}
                              className="px-2 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700 border border-cream-300 text-[10px] font-bold"
                            >
                              {u.role === 'PREMIUM' ? 'Revoke Pro' : 'Make Pro'}
                            </button>
                            <button
                              onClick={() => handleUserAction(u.id, u.is_active ? 'DEACTIVATE' : 'ACTIVATE')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                u.is_active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {u.is_active ? 'Block' : 'Unblock'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">Subscription Plans Configuration</h2>
            <p className="text-xs text-charcoal-400">Manage plan pricing and validity duration for customers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plansList.map((plan) => (
              <div key={plan.id} className="p-5 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-charcoal-700 dark:text-cream-100">{plan.name}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cream-100 text-charcoal-600">
                      {plan.code}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-extrabold text-orange-600">₹{plan.price}</span>
                    <span className="text-xs text-charcoal-400">/ {plan.duration_days} days</span>
                  </div>
                  <p className="text-xs text-charcoal-500 mb-4">{plan.description}</p>
                </div>
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="w-full py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-700 border border-cream-300 text-xs font-bold transition-colors"
                >
                  Edit Plan
                </button>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm">
              <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl">
                <h3 className="text-base font-bold text-charcoal-700 dark:text-cream-100 mb-4">Edit {editingPlan.name}</h3>
                <form onSubmit={handleSavePlan} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-600 mb-1">Plan Name</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 text-xs text-charcoal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 text-xs text-charcoal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-600 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={editingPlan.duration_days}
                      onChange={(e) => setEditingPlan({ ...editingPlan, duration_days: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 text-xs text-charcoal-700"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="flex-1 py-2 rounded-xl bg-cream-100 text-charcoal-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: UPI MERCHANT SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-soft space-y-5">
            <div>
              <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">UPI Payment Gateway Details</h2>
              <p className="text-xs text-charcoal-400">Configure your receiving UPI address and merchant name for dynamic QR generation.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Payee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={settingsData.payee_name}
                  onChange={(e) => setSettingsData({ ...settingsData, payee_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  UPI ID (VPA) *
                </label>
                <input
                  type="text"
                  required
                  value={settingsData.upi_id}
                  onChange={(e) => setSettingsData({ ...settingsData, upi_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-xs font-mono text-charcoal-700 dark:text-cream-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="upi_active"
                  checked={settingsData.is_upi_enabled}
                  onChange={(e) => setSettingsData({ ...settingsData, is_upi_enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-cream-300"
                />
                <label htmlFor="upi_active" className="text-xs font-semibold text-charcoal-700 dark:text-cream-100">
                  Enable manual UPI payments across the platform
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-charcoal-700 dark:text-cream-100">System Audit Logs</h2>
            <p className="text-xs text-charcoal-400">Trace actions, approvals, and administrative activities.</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-charcoal-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-charcoal-700">
                  {logsList.map((log) => (
                    <tr key={log.id} className="hover:bg-cream-50 dark:hover:bg-charcoal-750">
                      <td className="py-3 px-4 font-bold text-charcoal-700 dark:text-cream-100">{log.action}</td>
                      <td className="py-3 px-4 text-charcoal-600">{log.user_username || 'System'}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-charcoal-400">{log.ip_address || '—'}</td>
                      <td className="py-3 px-4 text-charcoal-400 text-[11px]">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="py-3 px-4 text-charcoal-500 font-mono text-[11px] max-w-xs truncate">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')}
                      </td>
                    </tr>
                  ))}
                  {logsList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-charcoal-400">
                        No audit logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-sm" onClick={() => setSelectedScreenshot(null)}>
          <div className="relative max-w-xl max-h-[85vh] bg-white dark:bg-charcoal-800 rounded-2xl p-4 shadow-2xl border border-cream-400" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-charcoal-700 dark:text-cream-100">Payment Screenshot Proof</h4>
              <button onClick={() => setSelectedScreenshot(null)} className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={selectedScreenshot} alt="Payment Receipt" className="max-w-full max-h-[70vh] rounded-lg object-contain mx-auto border border-cream-300" />
          </div>
        </div>
      )}

      {/* Decision Action Modal */}
      {decisionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-charcoal-700 dark:text-cream-100">
              {decisionModal.action === 'APPROVE' ? 'Approve Payment & Activate Plan' : 'Reject Payment Request'}
            </h3>
            
            <p className="text-xs text-charcoal-500">
              UTR: <strong className="font-mono text-charcoal-700 dark:text-cream-100">{decisionModal.req?.utr}</strong> | 
              Amount: <strong className="text-orange-600">₹{decisionModal.req?.claimed_amount}</strong>
            </p>

            {decisionModal.action === 'REJECT' && (
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1">Reason for Rejection *</label>
                <textarea
                  required
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR not found on PhonePe, amount mismatch, duplicate screenshot..."
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 text-xs text-charcoal-700 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDecisionModal({ open: false, req: null, action: '' })}
                className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePaymentDecision}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white ${
                  decisionModal.action === 'APPROVE' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {decisionModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
