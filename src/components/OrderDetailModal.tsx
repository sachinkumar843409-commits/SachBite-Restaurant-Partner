import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  MapPin,
  Clock,
  Bike,
  CheckCircle2,
  Package,
  AlertTriangle,
  Printer,
  Navigation,
  Send,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface OrderDetailModalProps {
  order: Order | null;
  profile: RestaurantProfile | null;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], extra?: Partial<Order>) => Promise<void>;
  onOpenKot: (order: Order) => void;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  profile,
  onUpdateOrderStatus,
  onOpenKot,
  onClose,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('Item Out of Stock');
  const [customUpdateText, setCustomUpdateText] = useState('');
  const [isSendingUpdate, setIsSendingUpdate] = useState(false);

  if (!order) return null;

  const orderId = order._id || order.id || '';
  const isDelivered = (order.status || '').toLowerCase().includes('delivered');
  const isFoodReady = (order.status || '').toLowerCase().includes('ready');
  const isPreparing = (order.status || '').toLowerCase().includes('preparing') || (order.status || '').toLowerCase().includes('confirmed');

  const handleReject = async () => {
    sounds.playTapSound();
    await onUpdateOrderStatus(orderId, 'Cancelled', { cancellationReason: rejectReason });
    notificationManager.showToast({
      type: 'info',
      title: 'Order Cancelled',
      message: `Order #${order.orderId} rejected: ${rejectReason}`,
    });
    setIsRejecting(false);
    onClose();
  };

  const handleSendCustomerUpdate = async () => {
    if (!customUpdateText.trim()) return;
    setIsSendingUpdate(true);
    sounds.playSuccessSound();

    setTimeout(() => {
      setIsSendingUpdate(false);
      setCustomUpdateText('');
      notificationManager.showToast({
        type: 'success',
        title: 'SMS Sent to Customer',
        message: `"${customUpdateText}" delivered to ${order.customerName}.`,
      });
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-[#1e1e1e]">
                    Order {order.orderId || '#SB-ORDER'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] text-[10px] font-bold">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Placed on {new Date(order.createdAt || order.date || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenKot(order)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                title="Print KOT"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4 bg-[#fafafa]">
            {/* Order Progress Steps */}
            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                Fulfillment Timeline
              </span>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-2 right-2 top-3 h-0.5 bg-gray-200 -z-0" />
                
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 mt-1">Confirmed</span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isPreparing || isFoodReady || isDelivered ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isFoodReady || isDelivered ? '✓' : '2'}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 mt-1">Kitchen</span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isFoodReady || isDelivered ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isDelivered ? '✓' : '3'}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 mt-1">Food Ready</span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isDelivered ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isDelivered ? '✓' : '4'}
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 mt-1">Delivered</span>
                </div>
              </div>
            </div>

            {/* Customer & Address Contact Card */}
            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1e1e1e]">{order.customerName}</span>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="px-3 py-1 rounded-full bg-[#fff1e6] text-[#b25511] font-bold text-xs flex items-center space-x-1 hover:bg-[#ffe5d0]"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call {order.customerPhone}</span>
                </a>
              </div>
              <div className="flex items-start space-x-1.5 text-xs text-[#6b7280]">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
            </div>

            {/* Assigned Rider Live Card */}
            {order.rider && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-[#bc5a13] text-white flex items-center justify-center">
                      <Bike className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1e1e1e] block">
                        Assigned Delivery Hero: {order.rider.name}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {order.rider.vehicleNumber} • Rating: {order.rider.rating} ★
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.rider.phone}`}
                    className="p-2 rounded-xl bg-white border border-amber-300 text-[#b25511] font-bold text-xs flex items-center space-x-1 shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                {order.deliveryOtp && (
                  <div className="p-2 bg-white/80 rounded-xl border border-amber-300/60 flex items-center justify-between text-xs">
                    <span className="text-neutral-600 font-semibold">Rider Pickup OTP:</span>
                    <span className="font-mono font-black text-sm text-[#bc5a13]">{order.deliveryOtp}</span>
                  </div>
                )}
              </div>
            )}

            {/* Dishes in Order */}
            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                Dishes in Order
              </span>
              <div className="space-y-1.5">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-[#b25511]">{it.quantity}x</span>
                        <span className="font-bold text-[#1e1e1e]">{it.name}</span>
                      </div>
                      {it.variant && <p className="text-[10px] text-gray-500 pl-4">↳ {it.variant}</p>}
                    </div>
                    <span className="font-bold text-[#1e1e1e]">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-[#1e1e1e]">
                <span>Grand Total</span>
                <span>₹{order.grandTotal}</span>
              </div>
            </div>

            {/* Quick SMS / Customer Notification */}
            <div className="p-4 bg-white rounded-2xl border border-gray-100 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                Send Direct Update to Customer
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={customUpdateText}
                  onChange={(e) => setCustomUpdateText(e.target.value)}
                  placeholder="e.g. Extra chutney packed! Cooking on low flame."
                  className="flex-1 px-3 py-2 bg-[#fafafa] border border-gray-200 rounded-xl text-xs text-[#1e1e1e]"
                />
                <button
                  onClick={handleSendCustomerUpdate}
                  disabled={isSendingUpdate}
                  className="px-3 py-2 rounded-xl bg-[#bc5a13] text-white text-xs font-bold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Reject Form toggle */}
            {isRejecting ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Select Reason for Order Rejection:</span>
                </div>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Item Out of Stock">Item Out of Stock</option>
                  <option value="Kitchen Overloaded / Too busy">Kitchen Overloaded / Too busy</option>
                  <option value="Restaurant Closing for the day">Restaurant Closing for the day</option>
                  <option value="Delivery Address too far">Delivery Address too far</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
            {!isDelivered && !isRejecting && (
              <button
                onClick={() => setIsRejecting(true)}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Reject / Cancel Order
              </button>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              {!isDelivered && isPreparing && !isFoodReady && (
                <button
                  onClick={async () => {
                    sounds.playSuccessSound();
                    await onUpdateOrderStatus(orderId, 'Food Ready');
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Mark Food Ready & Packed
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#1e1e1e] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
