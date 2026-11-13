import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Check, Copy, Upload, QrCode, AlertCircle, 
  ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { subscriptionApi, paymentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import scannerImg from '../../assets/phonepe_scanner.jpg';

export default function PaymentModal({ isOpen, onClose, preselectedPlanId }) {
  const { user, isAuthenticated } = useAuth();
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(1); // 1: Select Plan, 2: Scan & Pay, 3: Submit Proof, 4: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dynamic QR details from backend
  const [qrDetails, setQrDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form inputs
  const [payerName, setPayerName] = useState(user?.first_name ? `${user.first_name} ${user.last_name}` : '');
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utr, setUtr] = useState('');
  const [claimedAmount, setClaimedAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTime, setPaymentTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Submission result
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const res = await subscriptionApi.getPlans();
      const planList = res.data.results || res.data;
      setPlans(planList);

      if (preselectedPlanId) {
        const found = planList.find(p => p.id === preselectedPlanId || p.code === preselectedPlanId);
        if (found) {
          handleSelectPlan(found);
          return;
        }
      }
      if (planList.length > 0) {
        // default to monthly (₹29) or first plan
        const def = planList.find(p => p.code === 'monthly') || planList[0];
        setSelectedPlan(def);
        setClaimedAmount(def.price);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  };

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setClaimedAmount(plan.price);
    setError('');
    setLoading(true);

    try {
      const res = await paymentApi.generateQr(plan.id);
      if (res.data.success) {
        setQrDetails(res.data.payment_details);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate dynamic UPI QR code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = () => {
    if (qrDetails?.upi_id) {
      navigator.clipboard.writeText(qrDetails.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Screenshot file size cannot exceed 5MB.');
        return;
      }
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      setError('Please upload a screenshot of your completed payment receipt.');
      return;
    }
    if (!utr.trim()) {
      setError('Please enter the 12-digit UTR / UPI reference number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('plan_id', selectedPlan.id);
      formData.append('payer_name', payerName);
      formData.append('payer_upi_id', payerUpiId);
      formData.append('utr', utr);
      formData.append('claimed_amount', claimedAmount);
      formData.append('payment_date', paymentDate);
      formData.append('payment_time', paymentTime);
      formData.append('screenshot', screenshot);

      const res = await paymentApi.submitPayment(formData);
      if (res.data.success) {
        setSubmissionResult(res.data);
        setStep(4);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
      const msg = err.response?.data?.error?.details?.utr || 
                  err.response?.data?.error?.details?.screenshot || 
                  err.response?.data?.message || 
                  'Failed to submit payment verification request.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {step === 1 && "Choose Your Subscription Plan"}
                {step === 2 && "Scan & Pay via UPI"}
                {step === 3 && "Submit Payment Proof"}
                {step === 4 && "Payment Request Received"}
              </h3>
              <p className="text-xs text-slate-400">Direct Manual UPI Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Select Plan */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 mb-2">
                Select your preferred plan. Premium validity activates immediately upon Superadmin verification.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlan(p)}
                    className="p-4 rounded-2xl border border-slate-800 hover:border-sky-500 bg-slate-850/60 hover:bg-slate-800/80 cursor-pointer transition-all relative group"
                  >
                    {p.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {p.badge}
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white">{p.name}</h4>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-2xl font-extrabold text-sky-400">₹{p.price}</span>
                      <span className="text-xs text-slate-400">/ {p.duration_days} days</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{p.description}</p>
                    <div className="text-xs text-slate-300 font-medium flex items-center gap-1 group-hover:text-sky-400">
                      <span>Pay with UPI QR</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Dynamic QR & Payee Details */}
          {step === 2 && qrDetails && (
            <div className="space-y-5">
              
              {/* Selected Plan Summary Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/20">
                <div>
                  <span className="text-xs text-sky-300 font-medium">Selected Plan</span>
                  <p className="text-sm font-bold text-white">{selectedPlan?.name} (Valid {selectedPlan?.duration_days} Days)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-sky-300 font-medium">Payable Amount</span>
                  <p className="text-xl font-extrabold text-emerald-400">₹{selectedPlan?.price}</p>
                </div>
              </div>

              {/* QR Code and Scanner Images */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-white text-slate-900 shadow-inner">
                {/* Dynamically Generated QR */}
                <div className="text-center">
                  <img 
                    src={qrDetails.qr_data_url} 
                    alt="Dynamic Fixed Amount UPI QR"
                    className="w-44 h-44 mx-auto rounded-xl border border-slate-200" 
                  />
                  <p className="text-[11px] font-bold text-slate-700 mt-2">
                    Dynamic QR (Exact ₹{selectedPlan?.price})
                  </p>
                </div>

                {/* Divider or PhonePe Official Card */}
                <div className="hidden sm:block w-[1px] h-40 bg-slate-200" />

                <div className="text-center">
                  <img 
                    src={scannerImg} 
                    alt="Ashutosh Kumar PhonePe QR"
                    className="w-44 h-44 mx-auto object-cover rounded-xl border border-slate-200 shadow-sm" 
                  />
                  <p className="text-[11px] font-bold text-purple-700 mt-2">
                    Official PhonePe Scanner
                  </p>
                </div>
              </div>

              {/* Payee Info & Copy UPI ID */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Payee:</span>
                  <span className="font-bold text-white tracking-wide">{qrDetails.payee_name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-xs font-mono bg-slate-900 px-3 py-2 rounded-lg text-emerald-400 border border-slate-700 flex-1">
                    {qrDetails.upi_id}
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>
              </div>

              {/* Payment Instructions Warning */}
              <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Important Payment Notice:
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pay the <strong>exact ₹{selectedPlan?.price}</strong> using any UPI app (PhonePe, GPay, Paytm). 
                  Copy the <strong>12-digit UTR / Reference ID</strong> and take a screenshot of the completed payment receipt to proceed.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800"
                >
                  Change Plan
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                >
                  <span>I Have Paid — Submit Proof</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Submission Form */}
          {step === 3 && (
            !isAuthenticated ? (
              <div className="p-6 rounded-2xl bg-slate-850 border border-slate-700/80 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Sign In to Link Payment</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    Please sign in or create an account so we know which user account to activate your {selectedPlan?.name} premium subscription for.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                  >
                    Register Account
                  </Link>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Back to QR Code
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmitProof} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Name as on UPI App"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payer UPI ID (Optional)</label>
                  <input
                    type="text"
                    value={payerUpiId}
                    onChange={(e) => setPayerUpiId(e.target.value)}
                    placeholder="e.g. name@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    UTR / UPI Reference (12 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.trim())}
                    placeholder="e.g. 431289123456"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount Paid (INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Time *</label>
                  <input
                    type="time"
                    required
                    value={paymentTime}
                    onChange={(e) => setPaymentTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Payment Receipt Screenshot (Max 5MB) *
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-800/40 transition-colors relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {screenshotPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={screenshotPreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-700" />
                      <div className="text-left">
                        <p className="text-xs font-medium text-white truncate max-w-[200px]">{screenshot?.name}</p>
                        <p className="text-[11px] text-emerald-400">Ready to upload • Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-medium text-slate-300">Click or drag payment screenshot here</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">JPEG, PNG, or WebP up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800"
                >
                  Back to QR
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting for Verification...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit for Admin Verification</span>
                    </>
                  )}
                </button>
              </div>

            </form>
            )
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && submissionResult && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Payment Request Submitted!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your payment request has been securely recorded and queued for manual verification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Request ID:</span>
                  <span className="font-mono font-bold text-sky-400">{submissionResult.request_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Plan:</span>
                  <span className="font-medium text-white">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Verified Against:</span>
                  <span className="font-bold text-emerald-400">₹{submissionResult.expected_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    PENDING VERIFICATION
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed px-4">
                The Superadmin Owner verifies payments directly against bank credits. 
                Once approved, your account will immediately reflect full <strong>Premium Access</strong>. 
                You can track this in your <strong>User Dashboard</strong>.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                Close & Return
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
