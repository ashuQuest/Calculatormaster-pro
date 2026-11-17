import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Check, Copy, Upload, QrCode, AlertCircle, 
  ArrowRight, ShieldCheck, Sparkles, CheckCircle2, User, ChevronRight
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl bg-white dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-600 shadow-2xl text-charcoal-700 dark:text-cream-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 dark:border-charcoal-700 bg-cream-100/70 dark:bg-charcoal-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-soft">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-charcoal-700 dark:text-cream-100">
                {step === 1 && "Choose Your Subscription Plan"}
                {step === 2 && "Scan & Pay via UPI"}
                {step === 3 && "Submit Payment Proof"}
                {step === 4 && "Payment Request Received"}
              </h3>
              <p className="text-[11px] text-charcoal-400 dark:text-charcoal-300">Direct Manual UPI Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-cream-50 dark:bg-charcoal-850 border-b border-cream-300 dark:border-charcoal-700 text-xs">
          {[
            { num: 1, label: 'Select' },
            { num: 2, label: 'Pay' },
            { num: 3, label: 'Verify' },
            { num: 4, label: 'Done' },
          ].map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= s.num 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-cream-300 dark:bg-charcoal-700 text-charcoal-500 dark:text-cream-300'
              }`}>
                {s.num}
              </div>
              <span className={`font-semibold ${step >= s.num ? 'text-charcoal-700 dark:text-cream-100' : 'text-charcoal-400'}`}>
                {s.label}
              </span>
              {idx < 3 && <ChevronRight className="w-3.5 h-3.5 text-charcoal-300 ml-1" />}
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Select Plan */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-charcoal-500 dark:text-charcoal-300 mb-2">
                Select your preferred pass. Premium validity activates immediately upon Superadmin verification.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPlan(p)}
                    className="p-4 rounded-xl border border-cream-400 dark:border-charcoal-600 hover:border-orange-500 bg-white dark:bg-charcoal-750 hover:bg-cream-50 dark:hover:bg-charcoal-700 cursor-pointer transition-all relative group shadow-soft"
                  >
                    {p.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                        {p.badge}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-charcoal-700 dark:text-cream-100">{p.name}</h4>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-2xl font-extrabold text-orange-600">₹{p.price}</span>
                      <span className="text-xs text-charcoal-400 dark:text-charcoal-300">/ {p.duration_days} days</span>
                    </div>
                    <p className="text-xs text-charcoal-400 dark:text-charcoal-300 mb-3">{p.description}</p>
                    <div className="text-xs text-charcoal-600 dark:text-cream-200 font-semibold flex items-center gap-1 group-hover:text-orange-600">
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
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-cream-100 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600">
                <div>
                  <span className="text-[11px] text-charcoal-400 dark:text-charcoal-300 font-medium">Selected Plan</span>
                  <p className="text-sm font-bold text-charcoal-700 dark:text-cream-100">{selectedPlan?.name} ({selectedPlan?.duration_days} Days)</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-charcoal-400 dark:text-charcoal-300 font-medium">Amount to Pay</span>
                  <p className="text-xl font-extrabold text-orange-600">₹{selectedPlan?.price}</p>
                </div>
              </div>

              {/* QR Code and Scanner Images */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700">
                {/* Dynamically Generated QR */}
                <div className="text-center">
                  <img 
                    src={qrDetails.qr_data_url} 
                    alt="Dynamic UPI QR" 
                    className="w-40 h-40 mx-auto rounded-lg shadow-sm border border-cream-300 dark:border-charcoal-600 bg-white p-1"
                  />
                  <p className="text-[11px] font-semibold text-charcoal-600 dark:text-cream-200 mt-2">
                    Exact Amount: ₹{qrDetails.amount}
                  </p>
                </div>

                {/* Or PhonePe Scanner Reference */}
                <div className="text-center">
                  <img 
                    src={scannerImg} 
                    alt="PhonePe Scanner" 
                    className="w-40 h-40 mx-auto rounded-lg shadow-sm object-cover border border-cream-300 dark:border-charcoal-600"
                  />
                  <p className="text-[11px] font-semibold text-charcoal-500 dark:text-charcoal-300 mt-2">
                    Verified Merchant: {qrDetails.payee_name}
                  </p>
                </div>
              </div>

              {/* UPI ID Copy Card */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">UPI ID / VPA</p>
                  <p className="text-sm font-mono font-bold text-charcoal-700 dark:text-cream-100">{qrDetails.upi_id}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-charcoal-700 dark:text-cream-100 border border-cream-300 dark:border-charcoal-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-charcoal-500 dark:text-charcoal-300 space-y-1.5 bg-cream-100/60 dark:bg-charcoal-850 p-3.5 rounded-xl border border-cream-300 dark:border-charcoal-700">
                <p className="font-bold text-charcoal-700 dark:text-cream-100">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-charcoal-600 dark:text-charcoal-300 text-[11px]">
                  <li>Open PhonePe, Google Pay, Paytm or any UPI App.</li>
                  <li>Scan the QR or enter UPI ID manually, then pay exactly ₹{selectedPlan?.price}.</li>
                  <li>Take a screenshot of the successful payment screen showing the 12-digit UTR.</li>
                  <li>Click 'Proceed to Verification' to submit your UTR and receipt.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-200 font-semibold text-xs border border-cream-300 dark:border-charcoal-600"
                >
                  Back to Plans
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-1.5"
                >
                  <span>I Have Paid • Submit Proof</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Submit Verification Form */}
          {step === 3 && (
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="p-3 rounded-xl bg-cream-100 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 flex items-center justify-between text-xs">
                <span className="text-charcoal-500 dark:text-charcoal-300">Plan: <strong className="text-charcoal-700 dark:text-cream-100">{selectedPlan?.name}</strong></span>
                <span className="font-extrabold text-orange-600">₹{selectedPlan?.price}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  12-Digit UTR / UPI Transaction Reference ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 412345678901"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.trim())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    Your Name (as on Bank/UPI)
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                    Your UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@oksbi"
                    value={payerUpiId}
                    onChange={(e) => setPayerUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-600 text-charcoal-700 dark:text-cream-100 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Upload Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-cream-300 dark:border-charcoal-600 hover:border-orange-500 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-cream-50 dark:bg-charcoal-900">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {screenshotPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={screenshotPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-cream-300" />
                      <div className="text-left text-xs">
                        <p className="font-semibold text-charcoal-700 dark:text-cream-100">{screenshot?.name}</p>
                        <p className="text-[10px] text-green-600 font-bold">Screenshot attached (Click to change)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-charcoal-400 mx-auto" />
                      <p className="text-xs font-semibold text-charcoal-600 dark:text-cream-200">
                        Click or drag screenshot here
                      </p>
                      <p className="text-[10px] text-charcoal-400">PNG, JPG or WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-200 font-semibold text-xs border border-cream-300 dark:border-charcoal-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Proof...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal-700 dark:text-cream-100">
                  Payment Request Submitted!
                </h3>
                <p className="text-xs text-charcoal-400 dark:text-charcoal-300 max-w-sm mx-auto mt-1">
                  Thank you! Your UTR <strong className="font-mono text-charcoal-700 dark:text-cream-100">{utr}</strong> and screenshot have been delivered to the Superadmin for verification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cream-100 dark:bg-charcoal-750 border border-cream-300 dark:border-charcoal-600 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Plan:</span>
                  <span className="font-bold text-charcoal-700 dark:text-cream-100">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Amount:</span>
                  <span className="font-bold text-orange-600">₹{claimedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-400">Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200">
                    PENDING SUPERADMIN APPROVAL
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-charcoal-400">
                Validity will activate immediately once approved. You can track this in your dashboard.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="w-full max-w-sm py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-soft transition-colors"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
