import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  Crown,
  CheckCircle,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Info,
} from 'lucide-react';
import { AppSettings, RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface SubscriptionTabProps {
  profile: RestaurantProfile | null;
  settings: AppSettings;
  onSubscriptionUpdated: (updatedProfile: RestaurantProfile) => void;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  profile,
  settings,
  onSubscriptionUpdated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | null>(null);
  const [upiReference, setUpiReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const currentPlan = (profile?.subscriptionPlan || 'free').toLowerCase();
  const currentStatus = (profile?.subscriptionStatus || 'inactive').toLowerCase();
  const isActive = currentStatus === 'active';
  const isPending = currentStatus === 'pending';

  const proPrice = settings.subscriptionPricePro || 499;
  const businessPrice = settings.subscriptionPriceBusiness || 999;
  const upiId = settings.businessUpiId || 'sachbite@icici';
  const upiName = settings.businessUpiName || 'SachBite Foods Pvt Ltd';

  const selectedPrice = selectedPlan === 'business' ? businessPrice : proPrice;
  // Construct real UPI URI string
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${selectedPrice}&cu=INR&tn=SachBite_${selectedPlan || 'plan'}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    sounds.playTapSound();
    setTimeout(() => setCopiedUpi(false), 2000);
    notificationManager.showToast({
      type: 'info',
      title: 'UPI ID Copied',
      message: `${upiId} copied to clipboard.`,
    });
  };

  const handleSelectPlan = (plan: 'pro' | 'business') => {
    sounds.playTapSound();
    setSelectedPlan(plan);
    setUpiReference('');
  };

  const handleSubmitUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const trimmedRef = upiReference.trim();
    if (!trimmedRef || trimmedRef.length < 8) {
      notificationManager.showToast({
        type: 'error',
        title: 'Invalid UTR Number',
        message: 'Please enter a valid 12-digit UPI transaction reference / UTR number.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.requestSubscription(selectedPlan, trimmedRef);
      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {}

        if (profile) {
          const updated: RestaurantProfile = {
            ...profile,
            subscriptionPlan: selectedPlan,
            subscriptionStatus: 'pending',
          };
          onSubscriptionUpdated(updated);
        }

        notificationManager.showToast({
          type: 'success',
          title: 'Subscription Submitted!',
          message: '⏳ Pending — SachBite admin will verify and activate your plan shortly.',
          duration: 6000,
        });

        setSelectedPlan(null);
        setUpiReference('');
      } else {
        notificationManager.showToast({
          type: 'error',
          title: 'Submission Failed',
          message: res.error || 'Failed to submit subscription request.',
        });
      }
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Error',
        message: 'Network error submitting subscription.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-[#ff7a1a]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Partner Subscription</h1>
        </div>
        <p className="text-xs text-[#6b7280]">
          Direct zero-commission merchant membership plans powered by SachBite
        </p>
      </div>

      {/* Current Subscription Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 border shadow-xs relative overflow-hidden ${
          isActive
            ? 'bg-gradient-to-br from-emerald-50 via-[#e8f8ee] to-teal-50 border-emerald-300/80'
            : isPending
            ? 'bg-gradient-to-br from-amber-50 via-[#fff1e6] to-orange-50 border-amber-300'
            : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Current Plan
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isActive
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : isPending
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {currentPlan.toUpperCase()}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-[#1e1e1e] capitalize">
              {isActive
                ? 'Active Partner Membership'
                : isPending
                ? '⏳ Verification Pending'
                : 'Free / Unactivated Tier'}
            </h2>

            <p className="text-xs text-[#6b7280] flex items-center gap-1.5 mt-1">
              {isActive ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>
                    Valid until {profile?.subscriptionEnd ? new Date(profile.subscriptionEnd).toLocaleDateString() : 'Active Period'}
                  </span>
                </>
              ) : isPending ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span className="text-amber-800 font-semibold">
                    SachBite admin is verifying your UPI payment and will activate shortly.
                  </span>
                </>
              ) : (
                <>
                  <Info className="w-3.5 h-3.5 text-[#ff7a1a]" />
                  <span>Subscribe to unlock priority listing, featured search & zero commissions.</span>
                </>
              )}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/80 shadow-xs border border-white flex items-center justify-center text-2xl shrink-0">
            {isActive ? '🌟' : isPending ? '⏳' : '⚡'}
          </div>
        </div>
      </motion.div>

      {/* Plan Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#1e1e1e] ml-1">
          Select Subscription Tier
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Pro Plan Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-3xl p-5 border transition-all cursor-pointer relative bg-white ${
              selectedPlan === 'pro'
                ? 'border-[#ff7a1a] ring-2 ring-[#ff7a1a]/30 shadow-md'
                : 'border-gray-200 hover:border-orange-200 shadow-xs'
            }`}
            onClick={() => handleSelectPlan('pro')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'pro' ? 'border-[#bc5a13] bg-[#bc5a13] text-white' : 'border-gray-300'
              }`}>
                {selectedPlan === 'pro' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <h4 className="text-base font-black text-[#1e1e1e]">PRO Partner Plan</h4>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#1e1e1e]">₹{proPrice}</span>
              <span className="text-xs text-[#6b7280]">/ 30 days</span>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-[#1e1e1e]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>0% Commission on all orders</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Priority city search listing</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Unlimited live menu items</span>
              </li>
            </ul>

            <button
              type="button"
              className="mt-5 w-full py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <span>{currentPlan === 'pro' && isActive ? 'Renew Pro Plan' : 'Choose Pro Plan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Business Plan Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`rounded-3xl p-5 border transition-all cursor-pointer relative bg-white ${
              selectedPlan === 'business'
                ? 'border-[#ff7a1a] ring-2 ring-[#ff7a1a]/30 shadow-md'
                : 'border-gray-200 hover:border-orange-200 shadow-xs'
            }`}
            onClick={() => handleSelectPlan('business')}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-200">
                Premium Growth
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === 'business' ? 'border-[#bc5a13] bg-[#bc5a13] text-white' : 'border-gray-300'
              }`}>
                {selectedPlan === 'business' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            <h4 className="text-base font-black text-[#1e1e1e]">BUSINESS Tier</h4>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#1e1e1e]">₹{businessPrice}</span>
              <span className="text-xs text-[#6b7280]">/ 30 days</span>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-[#1e1e1e]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Everything in Pro Plan</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Homepage Hero Banner spotlight</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Dedicated account manager support</span>
              </li>
            </ul>

            <button
              type="button"
              className="mt-5 w-full py-2.5 rounded-full bg-[#1e1e1e] hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1"
            >
              <span>{currentPlan === 'business' && isActive ? 'Renew Business' : 'Choose Business'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* UPI Direct Payment Flow Reveal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl p-6 border-2 border-[#ff7a1a]/40 shadow-lg space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#fff1e6] flex items-center justify-center text-[#ff7a1a]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e1e1e] uppercase tracking-wide">
                      Direct UPI Payment • ₹{selectedPrice}
                    </h4>
                    <p className="text-[11px] text-[#6b7280]">
                      No middleman gateway fees • Direct merchant transfer
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#e8f8ee] text-[#15803d] text-[10px] font-bold uppercase">
                  Verified VPA
                </span>
              </div>

              {/* QR Code + Pay Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* QR Canvas */}
                <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center shrink-0">
                  <QRCodeSVG
                    value={upiUri}
                    size={150}
                    level="H"
                    includeMargin={false}
                    fgColor="#1e1e1e"
                  />
                  <span className="text-[10px] font-black tracking-wider text-[#b25511] mt-2 uppercase">
                    Scan with any UPI App
                  </span>
                </div>

                {/* Details & Mobile Intent Link */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Recipient Name:</span>
                      <span className="font-bold text-[#1e1e1e]">{upiName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Business UPI ID:</span>
                      <div className="flex items-center space-x-1.5 font-mono font-bold text-[#b25511]">
                        <span>{upiId}</span>
                        <button
                          onClick={handleCopyUpiId}
                          className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {copiedUpi && (
                      <p className="text-[10px] text-[#16a34a] font-bold text-right">
                        ✓ Copied to clipboard!
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                      <span className="text-gray-500 font-medium">Pay Amount:</span>
                      <span className="text-sm font-black text-[#1e1e1e]">₹{selectedPrice}</span>
                    </div>
                  </div>

                  {/* Direct Mobile UPI Intent Button (GPay, PhonePe, Paytm) */}
                  <a
                    href={upiUri}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer text-center"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Pay Directly via UPI App (GPay / PhonePe / Paytm)</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>

              {/* UTR Form Submission */}
              <form onSubmit={handleSubmitUpi} className="pt-3 border-t border-gray-100 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Enter 12-Digit UPI Reference (UTR) Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value)}
                    placeholder="e.g. 428901847192 (from payment receipt)"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm font-mono text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20"
                  />
                  <p className="text-[10px] text-[#6b7280] mt-1">
                    Found on Google Pay / PhonePe / Paytm payment success screen as "UPI Ref ID" or "UTR".
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit UTR for Activation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Info Card */}
      <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-xs flex items-center justify-between text-xs text-[#6b7280]">
        <div>
          <span className="font-bold text-[#1e1e1e] block">Need help with activation?</span>
          <span>Contact SachBite Merchant Desk: {settings.supportEmail || 'partner@sachbite.in'}</span>
        </div>
        {settings.supportPhone && (
          <a
            href={`tel:${settings.supportPhone}`}
            className="px-3 py-1.5 rounded-full bg-[#fff1e6] text-[#b25511] font-bold text-xs hover:bg-[#ffe5d0] transition-colors"
          >
            Call Support
          </a>
        )}
      </div>
    </div>
  );
};
