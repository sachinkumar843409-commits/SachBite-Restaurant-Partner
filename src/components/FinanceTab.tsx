import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  Building2,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  ShieldCheck,
  Zap,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { BankDetails, PayoutRecord, RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface FinanceTabProps {
  profile: RestaurantProfile | null;
  onProfileUpdated: (p: RestaurantProfile) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ profile, onProfileUpdated }) => {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);

  // Bank Form State
  const [bankHolder, setBankHolder] = useState(profile?.bankDetails?.accountHolder || 'Tandoori Tales Hospitality LLP');
  const [bankAcc, setBankAcc] = useState(profile?.bankDetails?.accountNumber || '50200049281729');
  const [bankIfsc, setBankIfsc] = useState(profile?.bankDetails?.ifscCode || 'HDFC0001234');
  const [bankName, setBankName] = useState(profile?.bankDetails?.bankName || 'HDFC Bank Ltd');
  const [bankUpi, setBankUpi] = useState(profile?.bankDetails?.upiId || 'tandooritales@hdfcbank');

  useEffect(() => {
    api.getPayouts().then((data) => setPayouts(data));
  }, []);

  const handleInstantPayout = async () => {
    setIsRequestingPayout(true);
    sounds.playTapSound();
    try {
      const newPay = await api.requestInstantPayout(4850.0);
      setPayouts((prev) => [newPay, ...prev]);
      notificationManager.showToast({
        type: 'success',
        title: 'Instant Payout Initiated!',
        message: '₹4,850.00 will be credited to your bank account within 15 minutes via IMPS.',
        duration: 5000,
      });
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Payout Request Failed',
        message: 'Unable to initiate instant payout. Contact merchant desk.',
      });
    } finally {
      setIsRequestingPayout(false);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedBank: BankDetails = {
      accountHolder: bankHolder,
      accountNumber: bankAcc,
      ifscCode: bankIfsc.toUpperCase(),
      bankName: bankName,
      upiId: bankUpi,
      isVerified: true,
    };

    try {
      await api.updateBankDetails(updatedBank);
      if (profile) {
        onProfileUpdated({ ...profile, bankDetails: updatedBank });
      }
      setIsEditingBank(false);
      notificationManager.showToast({
        type: 'success',
        title: 'Bank Details Updated',
        message: 'Your payout settlement account is verified.',
      });
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not update bank details.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-[#ff7a1a]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Finances & Payouts</h1>
        </div>
        <p className="text-xs text-[#6b7280]">
          Weekly automated settlements, IMPS instant withdrawals & invoices
        </p>
      </div>

      {/* Available Balance Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-stone-900 text-white shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Unsettled Order Balance
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-white">₹4,850.00</span>
              <span className="text-xs text-emerald-400 font-bold">● Ready for Payout</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Next automated weekly batch scheduled for <strong>Monday, 9:00 AM</strong>
            </p>
          </div>

          <button
            onClick={handleInstantPayout}
            disabled={isRequestingPayout}
            className="self-start sm:self-auto px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-black shadow-lg flex items-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isRequestingPayout ? 'Processing...' : 'Instant IMPS Payout'}</span>
          </button>
        </div>
      </motion.div>

      {/* Bank Account Details Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Settlement Bank Account</h3>
              <p className="text-xs text-[#6b7280]">Where your SachBite payouts are deposited</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingBank(!isEditingBank)}
            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1e1e1e] text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingBank ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {isEditingBank ? (
          <form onSubmit={handleSaveBankDetails} className="space-y-3 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                required
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  required
                  value={bankAcc}
                  onChange={(e) => setBankAcc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  required
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  Merchant UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value)}
                  placeholder="name@upi"
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save & Verify Bank
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Account Holder</span>
              <p className="text-xs font-bold text-[#1e1e1e]">{profile?.bankDetails?.accountHolder || bankHolder}</p>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Bank & IFSC</span>
              <p className="text-xs font-bold text-[#1e1e1e]">
                {profile?.bankDetails?.bankName || bankName} • {profile?.bankDetails?.ifscCode || bankIfsc}
              </p>
            </div>
            <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Account Number</span>
              <p className="text-xs font-mono font-bold text-[#1e1e1e]">
                •••• •••• {String(profile?.bankDetails?.accountNumber || bankAcc).slice(-4)}
              </p>
            </div>
            <div className="p-3 bg-[#e8f8ee] rounded-2xl border border-emerald-200/60 space-y-1 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#15803d]">Verification Status</span>
                <p className="text-xs font-bold text-[#16a34a]">Penny-drop Verified ✓</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#16a34a]" />
            </div>
          </div>
        )}
      </div>

      {/* Payout Settlement History */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1e1e1e]">Recent Settlements & Payouts</h3>
          <span className="text-xs text-[#6b7280]">NEFT / IMPS transfers</span>
        </div>

        <div className="space-y-2.5">
          {payouts.map((pay) => {
            const dateStr = new Date(pay.date).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={pay.id}
                className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f8ee] text-[#16a34a] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#1e1e1e]">{pay.payoutId}</span>
                      <span className="text-[10px] font-semibold text-gray-500">({pay.ordersCount} orders)</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280]">
                      {dateStr} • {pay.bankAccountMasked}
                    </p>
                    {pay.utrNumber && (
                      <p className="text-[10px] font-mono text-gray-400">UTR: {pay.utrNumber}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#1e1e1e]">₹{pay.amount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-[#16a34a] block capitalize">
                    ● {pay.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
