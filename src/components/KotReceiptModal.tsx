import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, CheckCircle, Store, Clock } from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { SachBiteLogo } from './SachBiteLogo';

interface KotReceiptModalProps {
  order: Order | null;
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const KotReceiptModal: React.FC<KotReceiptModalProps> = ({ order, profile, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
    notificationManager.showToast({
      type: 'success',
      title: 'Printing KOT Slip',
      message: `Kitchen ticket for #${order.orderId || 'ORDER'} sent to printer.`,
    });
  };

  const orderDate = new Date(order.createdAt || order.date || Date.now());
  const formattedTime = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = orderDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Printer className="w-5 h-5 text-[#ff7a1a]" />
              <h3 className="text-sm font-bold tracking-wide">Kitchen Order Ticket (KOT)</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Thermal Receipt Style Slip */}
          <div className="p-6 overflow-y-auto font-mono text-xs text-neutral-800 space-y-4 bg-[#fdfdfd]">
            {/* Header with Official Logo */}
            <div className="text-center pb-3 border-b border-dashed border-neutral-400 space-y-1.5 flex flex-col items-center">
              <SachBiteLogo
                variant="horizontal"
                size="sm"
                showTagline={false}
                className="mb-1"
              />
              <p className="font-bold text-sm text-neutral-900 uppercase">
                {profile?.name || 'Tandoori Tales & Biryani Hub'}
              </p>
              <p className="text-[11px] text-neutral-600">
                {profile?.address || 'Patna, Bihar'}
              </p>
              <p className="text-[10px] text-neutral-500">
                FSSAI: {profile?.fssaiNumber || '10423000001928'}
              </p>
            </div>

            {/* Order meta */}
            <div className="py-2 border-b border-dashed border-neutral-400 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-neutral-900 text-sm">
                <span>ORDER ID:</span>
                <span>{order.orderId || '#SB-84920'}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE & TIME:</span>
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>PAYMENT:</span>
                <span className="font-bold uppercase">{order.paymentMethod || 'PREPAID ONLINE'}</span>
              </div>
              {order.deliveryOtp && (
                <div className="flex justify-between text-[#b25511] font-bold">
                  <span>DELIVERY OTP:</span>
                  <span className="text-sm font-black">{order.deliveryOtp}</span>
                </div>
              )}
            </div>

            {/* Customer info */}
            <div className="py-2 border-b border-dashed border-neutral-400 space-y-0.5 text-[11px]">
              <p className="font-bold text-neutral-900">CUSTOMER: {order.customerName}</p>
              <p>PHONE: {order.customerPhone}</p>
              <p className="line-clamp-2">ADDR: {order.customerAddress}</p>
            </div>

            {/* Items list */}
            <div className="py-2 border-b border-dashed border-neutral-400 space-y-2">
              <div className="flex justify-between font-bold text-neutral-900 border-b border-neutral-200 pb-1">
                <span>ITEM DETAILS</span>
                <span>QTY x PRICE</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.variant && (
                    <p className="text-[10px] text-neutral-600 pl-4">Size/Variant: {item.variant}</p>
                  )}
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-[10px] text-neutral-600 pl-4">
                      Addons: {item.addOns.join(', ')}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-[10px] text-red-600 pl-4 font-bold">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div className="py-2 border-b border-dashed border-neutral-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Item Total:</span>
                <span>₹{(order.itemTotal || order.grandTotal * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging & Bags:</span>
                <span>₹{(order.packagingFee || 15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST / Taxes:</span>
                <span>₹{(order.taxTotal || order.grandTotal * 0.05).toFixed(2)}</span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Merchant Promo Discount:</span>
                  <span>-₹{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-neutral-900 pt-1 border-t border-neutral-300">
                <span>GRAND TOTAL:</span>
                <span>₹{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Rider section */}
            {order.rider && (
              <div className="py-2 border-b border-dashed border-neutral-400 space-y-0.5 text-[11px]">
                <p className="font-bold text-neutral-900">DELIVERY RIDER: {order.rider.name}</p>
                <p>CONTACT: {order.rider.phone}</p>
                <p>VEHICLE: {order.rider.vehicleNumber || 'SCOOTER'}</p>
              </div>
            )}

            {/* Barcode Mock / Footer */}
            <div className="text-center pt-2 space-y-2">
              <div className="tracking-[6px] font-black text-xs text-neutral-900">
                |||| | ||||| || |||||| |||| |
              </div>
              <p className="text-[10px] text-neutral-500">
                Thank you for ordering on SachBite!
              </p>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-[#bc5a13] hover:bg-[#e85d04] rounded-full flex items-center space-x-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal KOT</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
