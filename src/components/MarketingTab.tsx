import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag,
  Plus,
  Trash2,
  Percent,
  CheckCircle,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Clock,
  Calendar,
} from 'lucide-react';
import { CouponPromotion } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

export const MarketingTab: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponPromotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | string>(20);
  const [minOrderValue, setMinOrderValue] = useState<number | string>(199);
  const [maxDiscount, setMaxDiscount] = useState<number | string>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getCoupons().then(setCoupons);
  }, []);

  const handleToggleActive = async (id: string) => {
    sounds.playTapSound();
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
    await api.toggleCoupon(id);
    notificationManager.showToast({
      type: 'info',
      title: 'Coupon Updated',
      message: 'Promotion status updated for customer checkout.',
    });
  };

  const handleDelete = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    await api.deleteCoupon(id);
    notificationManager.showToast({
      type: 'success',
      title: 'Coupon Removed',
      message: 'Discount code deleted.',
    });
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.saveCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        isActive: true,
      });

      setCoupons((prev) => [created, ...prev]);
      setIsModalOpen(false);
      setCode('');
      notificationManager.showToast({
        type: 'success',
        title: 'Coupon Activated!',
        message: `Promo code ${created.code} is now live on SachBite customer app.`,
      });
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create promo code.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Tag className="w-6 h-6 text-[#ff7a1a]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Offers & Discounts</h1>
          </div>
          <p className="text-xs text-[#6b7280]">
            Create targeted promo codes to boost restaurant orders & repeat customers
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <motion.div
            key={coupon.id}
            layout
            className={`p-5 rounded-3xl bg-white border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              coupon.isActive ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-200 bg-gray-50/70 opacity-75'
            }`}
          >
            {/* Left Info */}
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/30 text-[#b25511] flex items-center justify-center font-black text-sm shrink-0">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-sm sm:text-base text-[#1e1e1e] tracking-wider px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                    {coupon.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    coupon.isActive ? 'bg-[#e8f8ee] text-[#15803d]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {coupon.isActive ? 'Live on App' : 'Paused'}
                  </span>
                </div>

                <p className="text-xs text-[#6b7280] mt-1">
                  {coupon.discountType === 'percentage'
                    ? `Get ${coupon.discountValue}% OFF (Max ₹${coupon.maxDiscount || 100}) on orders above ₹${coupon.minOrderValue}`
                    : `Flat ₹${coupon.discountValue} OFF on orders above ₹${coupon.minOrderValue}`}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-[#6b7280] mt-1.5 font-medium">
                  <span>Redemptions: <strong className="text-[#1e1e1e]">{coupon.totalRedemptions}</strong></span>
                  <span>•</span>
                  <span>Valid for 30 days</span>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-semibold text-gray-500">
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </span>
                <button
                  onClick={() => handleToggleActive(coupon.id)}
                  className="cursor-pointer focus:outline-none"
                >
                  {coupon.isActive ? (
                    <ToggleRight className="w-8 h-8 text-[#16a34a]" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
              </div>

              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-[#ff7a1a]" />
                  <h3 className="text-base font-bold text-[#1e1e1e]">Create Promotional Code</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Coupon Promo Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MONSOON50 or TANDOORI100"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                      className="w-full px-3 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    >
                      <option value="percentage">Percentage (% OFF)</option>
                      <option value="flat">Flat Amount (₹ OFF)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Discount Value ({discountType === 'percentage' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>

                  {discountType === 'percentage' && (
                    <div>
                      <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                        Max Discount Cap (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={maxDiscount}
                        onChange={(e) => setMaxDiscount(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md"
                  >
                    {isSubmitting ? 'Creating...' : 'Publish Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
