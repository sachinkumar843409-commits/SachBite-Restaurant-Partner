import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bike,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import { Order, DeliveryRider } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface RiderLiveTrackerModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onRiderArrived?: () => void;
}

export const RiderLiveTrackerModal: React.FC<RiderLiveTrackerModalProps> = ({
  isOpen,
  order,
  onClose,
  onRiderArrived,
}) => {
  const [riderStatus, setRiderStatus] = useState<'assigned' | 'arriving' | 'at_restaurant' | 'out_for_delivery'>('arriving');
  const [eta, setEta] = useState(4);
  const [progress, setProgress] = useState(65);

  const fallbackRider: DeliveryRider = {
    name: 'Rahul Kumar',
    phone: '+91 98350 44219',
    vehicleNumber: 'BR-01-DX-4421',
    rating: 4.88,
    status: riderStatus,
    etaMinutes: eta,
  };

  const rider = order?.rider || fallbackRider;

  // Simulate GPS scooter movement
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          setRiderStatus('at_restaurant');
          setEta(0);
          return 100;
        }
        return prev + 3;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleCallRider = () => {
    sounds.playTapSound();
    window.location.href = `tel:${rider.phone}`;
  };

  const handleWhatsAppRider = () => {
    sounds.playTapSound();
    const cleanPhone = rider.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Namaste ${rider.name}, SachBite order #${order.orderId || order._id?.slice(-5)} is getting packed and will be ready in 3 minutes. Please reach pickup counter.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleMarkArrived = () => {
    sounds.playSuccessSound();
    setRiderStatus('at_restaurant');
    setEta(0);
    setProgress(100);
    if (onRiderArrived) onRiderArrived();
    notificationManager.showToast({
      type: 'success',
      title: 'Rider Reached!',
      message: `${rider.name} is waiting at the restaurant pickup counter.`,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1e1e1e] to-neutral-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-300 block">
                  LIVE RIDER RADAR
                </span>
                <h3 className="text-sm sm:text-base font-black truncate max-w-[200px] sm:max-w-none">
                  Order #{order.orderId || order._id?.slice(-5)} Dispatch
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
            {/* Live GPS Map Simulation Canvas */}
            <div className="relative h-44 sm:h-48 bg-[#0f172a] rounded-2xl overflow-hidden border border-gray-800 shadow-inner flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Road Path Route */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 40 140 Q 140 40 250 110 T 360 60"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 40 140 Q 140 40 250 110 T 360 60"
                  fill="none"
                  stroke="#ff7a1a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="8 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Restaurant Outlet Location Pin */}
              <div className="absolute top-[28px] right-[24px] sm:right-[36px] flex flex-col items-center">
                <div className="px-2 py-0.5 bg-[#bc5a13] text-white text-[9px] sm:text-[10px] font-black rounded-md shadow-md mb-1 whitespace-nowrap">
                  🏪 Your Kitchen
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff7a1a] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Customer House Destination */}
              <div className="absolute bottom-[24px] left-[20px] sm:left-[28px] flex flex-col items-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Navigation className="w-3 h-3" />
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-300 mt-0.5">Customer</span>
              </div>

              {/* Animated Scooter Rider Icon on Route */}
              <motion.div
                animate={{
                  x: [-40, 30, 80],
                  y: [15, -5, -20],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'easeInOut',
                }}
                className="absolute z-10 flex flex-col items-center"
              >
                <div className="px-1.5 py-0.5 bg-neutral-900 text-orange-400 text-[9px] font-bold rounded-full shadow-md border border-orange-500/50 mb-0.5">
                  🛵 {rider.name}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#ff4d00] text-white flex items-center justify-center shadow-[0_0_12px_#ff4d00] border-2 border-white">
                  <Bike className="w-4 h-4" />
                </div>
              </motion.div>
            </div>

            {/* Rider Status & ETA Banner */}
            <div className="p-3.5 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white text-[#bc5a13] flex items-center justify-center shadow-2xs font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#b25511] tracking-wide block">
                    {riderStatus === 'at_restaurant' ? 'STATUS: AT PICKUP COUNTER' : 'ESTIMATED ARRIVAL'}
                  </span>
                  <p className="text-sm font-black text-[#1e1e1e]">
                    {riderStatus === 'at_restaurant' ? 'Arrived at your kitchen!' : `Arriving in ~${eta} mins`}
                  </p>
                </div>
              </div>

              {riderStatus !== 'at_restaurant' && (
                <button
                  onClick={handleMarkArrived}
                  className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Ping Arrived
                </button>
              )}
            </div>

            {/* Rider Profile Card */}
            <div className="p-4 rounded-2xl border border-gray-100 bg-[#fafafa] flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                  {rider.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-black text-[#1e1e1e] truncate">{rider.name}</h4>
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                      ★ {rider.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {rider.vehicleNumber} • Verified Partner Rider
                  </p>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleCallRider}
                  className="p-2.5 rounded-2xl bg-white border border-gray-200 text-[#1e1e1e] hover:bg-orange-50 hover:text-[#ff7a1a] shadow-2xs transition-colors cursor-pointer"
                  title="Call Rider"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={handleWhatsAppRider}
                  className="p-2.5 rounded-2xl bg-[#e8f8ee] border border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs transition-colors cursor-pointer"
                  title="WhatsApp Rider"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Delivery Details Breakdown */}
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-500">
                <span>Customer:</span>
                <span className="font-bold text-[#1e1e1e]">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Drop Location:</span>
                <span className="font-bold text-[#1e1e1e] truncate max-w-[200px] text-right">
                  {order.customerAddress || 'Patna Town'}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery OTP:</span>
                <span className="font-black text-[#bc5a13] tracking-widest">{order.deliveryOtp || '4928'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
