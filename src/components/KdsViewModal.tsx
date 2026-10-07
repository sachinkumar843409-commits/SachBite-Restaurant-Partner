import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChefHat,
  Clock,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Bike,
  Plus,
  Printer,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { sounds } from '../utils/sound';
import { notificationManager } from '../utils/notifications';

interface KdsViewModalProps {
  orders: Order[];
  profile: RestaurantProfile | null;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], extra?: Partial<Order>) => Promise<void>;
  onOpenKot: (order: Order) => void;
  onClose: () => void;
}

export const KdsViewModal: React.FC<KdsViewModalProps> = ({
  orders,
  profile,
  onUpdateOrderStatus,
  onOpenKot,
  onClose,
}) => {
  const [activeKdsTab, setActiveKdsTab] = useState<'all' | 'preparing' | 'ready'>('all');
  const [timeNow, setTimeNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkFoodReady = async (order: Order) => {
    sounds.playSuccessSound();
    await onUpdateOrderStatus(order._id || order.id || '', 'Food Ready');
    notificationManager.showToast({
      type: 'success',
      title: 'Food Marked Ready!',
      message: `Rider ${order.rider?.name || 'Partner'} notified for pickup of ${order.orderId || 'Order'}.`,
    });
  };

  const handleAcceptOrder = async (order: Order, prepMins: number = 20) => {
    sounds.playTapSound();
    await onUpdateOrderStatus(order._id || order.id || '', 'Preparing', {
      prepTimeMinutes: prepMins,
      acceptedAt: new Date().toISOString(),
    });
    notificationManager.showToast({
      type: 'success',
      title: 'Order Accepted into Kitchen',
      message: `${order.orderId} set for ${prepMins} mins prep time.`,
    });
  };

  const activeOrders = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return !s.includes('delivered') && !s.includes('cancelled');
  });

  const preparingOrders = activeOrders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return s.includes('preparing') || s.includes('confirmed') || s.includes('pending');
  });

  const readyOrders = activeOrders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return s.includes('ready');
  });

  const displayedOrders =
    activeKdsTab === 'preparing'
      ? preparingOrders
      : activeKdsTab === 'ready'
      ? readyOrders
      : activeOrders;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-white flex flex-col select-none overflow-hidden">
      {/* KDS Top Bar */}
      <div className="px-6 py-3 bg-[#1e1e1e] border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight">KITCHEN DISPLAY SYSTEM (KDS)</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                LIVE KITCHEN
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {profile?.name || 'SachBite Partner'} • Auto-syncing real-time line
            </p>
          </div>
        </div>

        {/* Tab Switcher in KDS */}
        <div className="flex items-center space-x-2 bg-neutral-900 p-1 rounded-2xl border border-neutral-700">
          <button
            onClick={() => setActiveKdsTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKdsTab === 'all' ? 'bg-[#bc5a13] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveKdsTab('preparing')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKdsTab === 'preparing' ? 'bg-[#ff7a1a] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cooking / In Kitchen ({preparingOrders.length})
          </button>
          <button
            onClick={() => setActiveKdsTab('ready')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKdsTab === 'ready' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Packed / Ready for Rider ({readyOrders.length})
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-mono font-bold text-neutral-300">
            {new Date(timeNow).toLocaleTimeString()}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center space-x-1.5 border border-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit KDS</span>
          </button>
        </div>
      </div>

      {/* Grid of Kitchen Tickets */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#141414]">
        {displayedOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center text-4xl mb-4 text-[#ff7a1a]">
              👨‍🍳
            </div>
            <h3 className="text-xl font-black text-neutral-200">No Orders in Kitchen Line</h3>
            <p className="text-sm text-neutral-500 max-w-sm mt-1">
              All caught up! New orders placed on SachBite will immediately beep and appear here with prep countdown.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedOrders.map((order) => {
              const isFoodReady = (order.status || '').toLowerCase().includes('ready');
              const isPendingAccept = (order.status || '').toLowerCase().includes('pending');
              const prepMinutes = order.prepTimeMinutes || 20;

              const acceptedTime = order.acceptedAt ? new Date(order.acceptedAt).getTime() : new Date(order.createdAt || Date.now()).getTime();
              const elapsedMinutes = Math.floor((timeNow - acceptedTime) / 60000);
              const remainingMinutes = Math.max(0, prepMinutes - elapsedMinutes);
              const isDelayed = elapsedMinutes > prepMinutes;

              return (
                <motion.div
                  key={order._id || order.id || order.orderId}
                  layout
                  className={`rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                    isFoodReady
                      ? 'bg-emerald-950/40 border-emerald-700/60 ring-1 ring-emerald-500/30'
                      : isDelayed
                      ? 'bg-rose-950/40 border-rose-600/80 ring-2 ring-rose-500/40'
                      : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b ${
                    isFoodReady ? 'bg-emerald-900/40 border-emerald-800' : isDelayed ? 'bg-rose-900/40 border-rose-800' : 'bg-neutral-800/80 border-neutral-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-white tracking-tight">
                        {order.orderId || '#SB-ORDER'}
                      </span>
                      <button
                        onClick={() => onOpenKot(order)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                        title="Print KOT Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-neutral-300 font-semibold">{order.customerName}</span>
                      
                      {/* Timer */}
                      <div className={`flex items-center space-x-1 font-mono font-bold px-2 py-0.5 rounded-md ${
                        isFoodReady
                          ? 'bg-emerald-800/80 text-emerald-200'
                          : isDelayed
                          ? 'bg-rose-800 text-white animate-pulse'
                          : 'bg-[#ff7a1a]/20 text-[#ff7a1a]'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>
                          {isFoodReady ? 'PACKED' : isDelayed ? `+${elapsedMinutes - prepMinutes}m DELAY` : `${remainingMinutes}m REMAIN`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Large readable items for chef */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-60">
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between border-b border-neutral-800/60 pb-2">
                          <div className="space-y-0.5">
                            <span className="text-sm font-black text-white leading-tight">
                              {it.name}
                            </span>
                            {it.variant && (
                              <p className="text-xs text-amber-400 font-bold">↳ {it.variant}</p>
                            )}
                            {it.notes && (
                              <p className="text-xs text-rose-300 font-semibold">⚠️ {it.notes}</p>
                            )}
                          </div>
                          <span className="text-base font-black px-2.5 py-0.5 rounded-lg bg-[#bc5a13] text-white shrink-0 ml-2">
                            {it.quantity}x
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="p-2 bg-amber-950/60 border border-amber-800 rounded-xl text-xs text-amber-200 font-medium">
                        <strong>Chef Note:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-neutral-950/60 border-t border-neutral-800/80 space-y-2">
                    {/* Rider Info Pill */}
                    {order.rider && (
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800">
                        <div className="flex items-center space-x-1.5">
                          <Bike className="w-3.5 h-3.5 text-[#ff7a1a]" />
                          <span>Rider: <strong className="text-neutral-200">{order.rider.name}</strong></span>
                        </div>
                        <span className="text-amber-400 font-bold font-mono">
                          ETA: {order.rider.etaMinutes || 5}m
                        </span>
                      </div>
                    )}

                    {/* Action button */}
                    {isPendingAccept ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAcceptOrder(order, 15)}
                          className="py-2.5 px-3 rounded-2xl bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Accept (15m)
                        </button>
                        <button
                          onClick={() => handleAcceptOrder(order, 25)}
                          className="py-2.5 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Accept (25m)
                        </button>
                      </div>
                    ) : !isFoodReady ? (
                      <button
                        onClick={() => handleMarkFoodReady(order)}
                        className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black tracking-wide flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 stroke-[3]" />
                        <span>FOOD READY • PACK FOR RIDER</span>
                      </button>
                    ) : (
                      <div className="py-2.5 px-3 rounded-2xl bg-emerald-950 border border-emerald-800/60 text-emerald-300 text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Food Packed • Awaiting Rider Handover</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
