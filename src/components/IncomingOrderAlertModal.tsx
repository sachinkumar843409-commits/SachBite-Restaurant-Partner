import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  ChefHat,
  Sparkles,
  ShoppingBag,
  Flame,
} from 'lucide-react';
import { Order } from '../types';
import { sounds } from '../utils/sound';

interface IncomingOrderAlertModalProps {
  order: Order | null;
  onAccept: (order: Order, prepMinutes: number) => void;
  onViewDetails: (order: Order) => void;
  onDismiss: () => void;
}

export const IncomingOrderAlertModal: React.FC<IncomingOrderAlertModalProps> = ({
  order,
  onAccept,
  onViewDetails,
  onDismiss,
}) => {
  const [prepTime, setPrepTime] = useState(20);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (order) {
      // Start heavy ringing loop & intense vibration
      sounds.startPersistentAlarm();

      // Trigger loud kitchen voice announcement in Hindi/Hinglish/English
      const itemsSummary = order.items.map((i) => `${i.quantity} ${i.name}`).join(', ');
      sounds.announceOrderSpeech(order.orderId || '#SB-LIVE', itemsSummary, order.grandTotal);
    } else {
      sounds.stopPersistentAlarm();
    }

    return () => {
      sounds.stopPersistentAlarm();
    };
  }, [order]);

  if (!order) return null;

  const handleMuteToggle = () => {
    if (isMuted) {
      sounds.startPersistentAlarm();
      setIsMuted(false);
    } else {
      sounds.stopPersistentAlarm();
      setIsMuted(true);
    }
  };

  const handleAcceptOrder = () => {
    sounds.stopPersistentAlarm();
    sounds.playSuccessSound();
    onAccept(order, prepTime);
  };

  const handleView = () => {
    sounds.stopPersistentAlarm();
    onViewDetails(order);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Pulsing Orange Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
              '0 0 25px rgba(255, 122, 26, 0.4)',
              '0 0 70px rgba(255, 122, 26, 0.9)',
              '0 0 25px rgba(255, 122, 26, 0.4)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#ff7a1a] shadow-2xl overflow-hidden relative flex flex-col"
        >
          {/* Top Urgent Alert Banner */}
          <div className="p-4 bg-gradient-to-r from-[#e85d04] via-[#ff7a1a] to-[#bc5a13] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <motion.div
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="w-10 h-10 rounded-2xl bg-white text-[#bc5a13] flex items-center justify-center shadow-md font-black"
              >
                <BellRing className="w-6 h-6 animate-bounce" />
              </motion.div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-100 block">
                  🚨 INCOMING NEW ORDER
                </span>
                <h3 className="text-lg font-black tracking-tight">
                  {order.orderId || '#SB-LIVE'}
                </h3>
              </div>
            </div>

            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Ringing' : 'Mute Ringing'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-200" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4 bg-white">
            {/* Customer & Grand Total */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs text-[#6b7280] font-medium">Customer:</span>
                <h4 className="text-base font-black text-[#1e1e1e]">{order.customerName}</h4>
                <p className="text-xs text-[#6b7280] line-clamp-1">{order.customerAddress}</p>
              </div>

              <div className="text-right bg-[#fff1e6] px-3.5 py-1.5 rounded-2xl border border-[#ff7a1a]/30">
                <span className="text-[10px] uppercase font-bold text-[#b25511] block">Grand Total</span>
                <span className="text-xl font-black text-[#1e1e1e]">₹{order.grandTotal}</span>
              </div>
            </div>

            {/* Dishes Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Dishes to Prepare ({order.items.length})
              </span>
              <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5 max-h-36 overflow-y-auto">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-md bg-[#fff1e6] text-[#b25511] font-bold text-[10px] flex items-center justify-center shrink-0">
                        {it.quantity}x
                      </span>
                      <span className="font-bold text-[#1e1e1e] line-clamp-1">{it.name}</span>
                    </div>
                    <span className="font-bold text-[#1e1e1e] shrink-0">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prep Time Selection */}
            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5">
                Kitchen Prep Duration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      sounds.playTapSound();
                      setPrepTime(mins);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      prepTime === mins
                        ? 'bg-[#bc5a13] text-white border-[#bc5a13] shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleAcceptOrder}
                className="w-full py-4 rounded-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-black text-sm shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer animate-pulse"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>ACCEPT & START COOKING ({prepTime}m)</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleView}
                  className="flex-1 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    sounds.stopPersistentAlarm();
                    onDismiss();
                  }}
                  className="py-2.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold cursor-pointer"
                >
                  Silence
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
