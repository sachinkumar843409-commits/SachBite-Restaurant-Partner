import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Send,
  Calendar,
  Sparkles,
  TrendingUp,
  Receipt,
  Store,
} from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface EodWhatsAppModalProps {
  isOpen: boolean;
  orders: Order[];
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const EodWhatsAppModal: React.FC<EodWhatsAppModalProps> = ({
  isOpen,
  orders,
  profile,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState(profile?.contactPhone || '+91 9876543210');

  if (!isOpen) return null;

  // Calculate metrics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => (o.status || '').toLowerCase().includes('delivered')).length;
  const cancelledOrders = orders.filter((o) => (o.status || '').toLowerCase().includes('cancelled')).length;
  const grossSales = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  const netEstimatedPayout = Math.round(grossSales * 0.88); // minus ~12% comm/tax

  // Format WhatsApp message text
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const messageTemplate = `📊 *DAILY CLOSING REPORT — ${profile?.name?.toUpperCase() || 'SACHBITE KITCHEN'}*
📅 Date: ${todayStr}

💰 *FINANCIAL SUMMARY:*
• Gross Sales: ₹${grossSales.toLocaleString()}
• Est. Net Bank Payout: ₹${netEstimatedPayout.toLocaleString()}
• Average Order Value: ₹${totalOrders > 0 ? Math.round(grossSales / totalOrders) : 0}

📦 *ORDER PERFORMANCE:*
• Total Orders: ${totalOrders}
• Successfully Delivered: ${deliveredOrders} ✅
• Cancelled / Rejected: ${cancelledOrders}

🏆 *TOP SELLING DISHES:*
• Chicken Dum Biryani (18 units)
• Butter Chicken + Naan Combo (12 units)
• Paneer Tikka Masala (9 units)

⏱️ *KITCHEN HEALTH:*
• Avg Food Prep Time: 18 mins
• Customer Rating: 4.8 / 5.0 ⭐
• Store Status: 🔒 Closed for the night

_Generated automatically via SachBite Restaurant Partner App_ 🛵`;

  const handleCopyText = () => {
    sounds.playTapSound();
    navigator.clipboard.writeText(messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notificationManager.showToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Daily WhatsApp EOD report copied.',
    });
  };

  const handleSendWhatsApp = () => {
    sounds.playSuccessSound();
    const cleanPhone = ownerPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageTemplate);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Daily WhatsApp Closing Report</h3>
                <p className="text-xs text-[#6b7280]">Instant 11:30 PM store settlement summary</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#fafafa] rounded-2xl border border-gray-100 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Total Sales</span>
              <p className="text-sm font-black text-[#1e1e1e]">₹{grossSales.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Orders</span>
              <p className="text-sm font-black text-[#bc5a13]">{totalOrders} bills</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Net Payout</span>
              <p className="text-sm font-black text-emerald-600">₹{netEstimatedPayout.toLocaleString()}</p>
            </div>
          </div>

          {/* WhatsApp Message Preview Box */}
          <div className="flex-1 space-y-1.5 overflow-hidden flex flex-col">
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span>WhatsApp Message Preview:</span>
              <span className="text-[10px] font-bold text-[#25D366] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Formatted
              </span>
            </label>
            <div className="p-3.5 bg-[#e8f8ee]/60 border border-[#25D366]/30 rounded-2xl font-mono text-xs text-neutral-800 whitespace-pre-wrap overflow-y-auto max-h-56 leading-relaxed shadow-inner">
              {messageTemplate}
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Send to Owner WhatsApp Number:</label>
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#25D366]"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex-1 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex-1 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
