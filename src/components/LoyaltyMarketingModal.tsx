import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Send,
  MessageSquare,
  Gift,
  Sparkles,
  TrendingUp,
  Heart,
  Crown,
  Search,
  Filter,
} from 'lucide-react';
import { LoyaltyCustomer, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface LoyaltyMarketingModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const LoyaltyMarketingModal: React.FC<LoyaltyMarketingModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([
    {
      id: 'cust-1',
      name: 'Amit Sharma',
      phone: '+91 98350 12345',
      totalOrders: 14,
      totalSpend: 5640,
      lastOrderDate: '3 days ago',
      favoriteDish: 'Chicken Dum Biryani',
      segment: 'VIP Gold',
    },
    {
      id: 'cust-2',
      name: 'Pooja Kumari',
      phone: '+91 98765 43219',
      totalOrders: 9,
      totalSpend: 3120,
      lastOrderDate: 'Yesterday',
      favoriteDish: 'Paneer Butter Masala',
      segment: 'Frequent Regular',
    },
    {
      id: 'cust-3',
      name: 'Vikash Verma',
      phone: '+91 98351 99012',
      totalOrders: 6,
      totalSpend: 2450,
      lastOrderDate: '12 days ago',
      favoriteDish: 'Tandoori Chicken Full',
      segment: 'At Risk (Inactive)',
    },
    {
      id: 'cust-4',
      name: 'Sneha Singh',
      phone: '+91 98102 77451',
      totalOrders: 3,
      totalSpend: 1190,
      lastOrderDate: '5 days ago',
      favoriteDish: 'Butter Naan & Dal Makhani',
      segment: 'New Explorer',
    },
  ]);

  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [discountOffer, setDiscountOffer] = useState('20% Flat OFF');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    const matchesSeg = selectedSegment === 'All' || c.segment === selectedSegment;
    return matchesSearch && matchesSeg;
  });

  const handleSendOfferWhatsApp = (cust: LoyaltyCustomer) => {
    sounds.playSuccessSound();
    const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
    const msg = `Namaste ${cust.name} ji! 🙏

Hum aapko ${profile?.name || 'SachBite'} par miss kar rahe hain! Aaj aapke favorite *${cust.favoriteDish}* par lein *${discountOffer}* using code *LOVE${discountOffer.slice(0, 2)}*.

🛵 Order karein SachBite App se aur garma-garam khana payein turant!
Dhanyawad,
Team ${profile?.name || 'SachBite'}`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    notificationManager.showToast({
      type: 'success',
      title: 'WhatsApp Promo Opened',
      message: `Discount offer crafted for ${cust.name}.`,
    });
  };

  const handleBroadcastSegment = () => {
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Broadcast Campaign Ready',
      message: `WhatsApp campaign prepared for ${filtered.length} customers.`,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1e1e1e] to-neutral-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-300 block">
                  CUSTOMER RETENTION & LOYALTY
                </span>
                <h3 className="text-base font-black">WhatsApp Re-Order Campaigns</h3>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Offer configuration strip */}
            <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-black text-[#b25511] uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Campaign Offer to Broadcast
                </h4>
                <p className="text-[11px] text-gray-600">Auto-injects customer name and favorite dish</p>
              </div>

              <select
                value={discountOffer}
                onChange={(e) => setDiscountOffer(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-xl border border-orange-300 text-xs font-bold text-[#b25511] focus:outline-none"
              >
                <option value="20% Flat OFF">20% Flat OFF</option>
                <option value="Flat ₹75 Discount">Flat ₹75 Discount</option>
                <option value="Free Gulab Jamun on ₹299+">Free Dessert on ₹299+</option>
                <option value="Buy 1 Get 1 Free Today">Buy 1 Get 1 Free</option>
              </select>
            </div>

            {/* Segment filter pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'VIP Gold', 'Frequent Regular', 'At Risk (Inactive)', 'New Explorer'].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedSegment === seg
                      ? 'bg-[#bc5a13] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* Customer List */}
            <div className="space-y-2.5">
              {filtered.map((cust) => (
                <div
                  key={cust.id}
                  className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-200 hover:bg-white hover:border-[#ff7a1a] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-[#1e1e1e]">{cust.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        cust.segment === 'VIP Gold'
                          ? 'bg-amber-100 text-amber-800'
                          : cust.segment === 'At Risk (Inactive)'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cust.segment}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6b7280]">
                      {cust.totalOrders} past orders • Spent ₹{cust.totalSpend.toLocaleString()} • Fav: <span className="font-bold text-[#1e1e1e]">{cust.favoriteDish}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] text-gray-400">Last: {cust.lastOrderDate}</span>
                    <button
                      type="button"
                      onClick={() => handleSendOfferWhatsApp(cust)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-transform"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Offer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBroadcastSegment}
              className="px-4 py-2 rounded-full bg-[#bc5a13] text-white text-xs font-bold shadow-md hover:bg-[#e85d04] flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All ({filtered.length})</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
