import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Package,
  Bike,
  RefreshCw,
  Sparkles,
  Search,
  Filter,
  Printer,
  ChefHat,
  AlertCircle,
} from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { sounds } from '../utils/sound';
import { notificationManager } from '../utils/notifications';

interface OrdersTabProps {
  orders: Order[];
  profile: RestaurantProfile | null;
  onRefreshOrders: () => Promise<void>;
  onSimulateOrder: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status'], extra?: Partial<Order>) => Promise<void>;
  onOpenKot: (order: Order) => void;
  onOpenKds: () => void;
  onOpenRiderTracker?: (order: Order) => void;
  onOpenDineInPos?: () => void;
  onOpenEodWhatsApp?: () => void;
  onOpenRawInventory?: () => void;
  onOpenBluetoothPrinter?: () => void;
  onOpenPackingProof?: (order: Order) => void;
  onOpenRainMode?: () => void;
  isLoading?: boolean;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  profile,
  onRefreshOrders,
  onSimulateOrder,
  onUpdateOrderStatus,
  onOpenKot,
  onOpenKds,
  onOpenRiderTracker,
  onOpenDineInPos,
  onOpenEodWhatsApp,
  onOpenRawInventory,
  onOpenBluetoothPrinter,
  onOpenPackingProof,
  onOpenRainMode,
  isLoading,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPulling, setIsPulling] = useState(false);

  const handlePullRefresh = async () => {
    setIsPulling(true);
    sounds.playTapSound();
    try {
      await onRefreshOrders();
    } finally {
      setTimeout(() => setIsPulling(false), 500);
    }
  };

  const handleMarkFoodReady = async (order: Order) => {
    sounds.playSuccessSound();
    await onUpdateOrderStatus(order._id || order.id || '', 'Food Ready');
    notificationManager.showToast({
      type: 'success',
      title: 'Food Packed & Ready',
      message: `Rider notified for pickup of #${order.orderId || 'order'}.`,
    });
  };

  const handleAcceptOrder = async (order: Order, prepMins: number) => {
    sounds.playTapSound();
    await onUpdateOrderStatus(order._id || order.id || '', 'Preparing', {
      prepTimeMinutes: prepMins,
      acceptedAt: new Date().toISOString(),
    });
    notificationManager.showToast({
      type: 'success',
      title: 'Order Accepted!',
      message: `Kitchen set for ${prepMins} mins preparation.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e8f8ee] text-[#15803d] border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Delivered</span>
        </span>
      );
    }
    if (s.includes('food ready')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Food Ready (Packed)</span>
        </span>
      );
    }
    if (s.includes('out for delivery')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
          <Bike className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Out for Delivery</span>
        </span>
      );
    }
    if (s.includes('preparing')) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fff1e6] text-[#b25511] border border-[#ff7a1a]/30 flex items-center gap-1.5 shadow-2xs">
          <Package className="w-3.5 h-3.5 text-[#ff7a1a] animate-spin" />
          <span>Kitchen Preparing</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#b25511] border border-orange-300 flex items-center gap-1.5 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-[#ff7a1a]" />
        <span>{status || 'Order Confirmed'}</span>
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const s = (order.status || '').toLowerCase();
    const isDelivered = s.includes('delivered');
    const isActive = !isDelivered && !s.includes('cancelled');

    if (filter === 'active' && !isActive) return false;
    if (filter === 'delivered' && !isDelivered) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = (order.orderId || order._id || '').toLowerCase().includes(q);
      const matchName = (order.customerName || '').toLowerCase().includes(q);
      const matchPhone = (order.customerPhone || '').includes(q);
      return matchId || matchName || matchPhone;
    }

    return true;
  });

  const activeOrdersCount = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return !s.includes('delivered') && !s.includes('cancelled');
  }).length;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Live Orders Feed</h1>
            {activeOrdersCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff7a1a] text-white text-xs font-black animate-pulse shadow-xs">
                {activeOrdersCount} Active
              </span>
            )}
          </div>
          <p className="text-xs text-[#6b7280] flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-[#b25511]">Food delivered with love ❤️</span>
            <span>•</span>
            <span>Kitchen fulfillment & dispatch</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pull to Refresh Button */}
          <button
            onClick={handlePullRefresh}
            disabled={isPulling}
            className="px-3.5 py-2 rounded-full bg-white hover:bg-orange-50 border border-gray-200 text-xs font-bold text-[#1e1e1e] flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#ff7a1a] ${isPulling ? 'animate-spin' : ''}`} />
            <span>{isPulling ? '...' : 'Refresh'}</span>
          </button>

          {/* KDS Kitchen Line */}
          <button
            onClick={onOpenKds}
            className="px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <ChefHat className="w-3.5 h-3.5 text-[#ff7a1a]" />
            <span>KDS Tablet</span>
          </button>
        </div>
      </div>

      {/* Quick Power Tools Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {onOpenDineInPos && (
          <button
            type="button"
            onClick={onOpenDineInPos}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#fff1e6] to-amber-50 border border-[#ff7a1a]/30 text-[#bc5a13] text-xs font-black shadow-2xs hover:shadow-xs flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>🍽️ Counter POS / Dine-in</span>
          </button>
        )}

        {onOpenEodWhatsApp && (
          <button
            type="button"
            onClick={onOpenEodWhatsApp}
            className="px-3.5 py-1.5 rounded-full bg-[#e8f8ee] border border-emerald-300 text-emerald-800 text-xs font-black shadow-2xs hover:bg-emerald-100 flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>📲 EOD WhatsApp Report</span>
          </button>
        )}

        {onOpenRawInventory && (
          <button
            type="button"
            onClick={onOpenRawInventory}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-gray-50 flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>📦 Raw Stock Alert</span>
          </button>
        )}

        {onOpenBluetoothPrinter && (
          <button
            type="button"
            onClick={onOpenBluetoothPrinter}
            className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>🖨️ Thermal Printer Setup</span>
          </button>
        )}

        {onOpenRainMode && (
          <button
            type="button"
            onClick={onOpenRainMode}
            className="px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-300 text-sky-800 text-xs font-bold shadow-2xs hover:bg-sky-100 flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>🌧️ Rain Mode Surge</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-2.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (#SB-...), customer, phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 shadow-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5">
            <button
              onClick={() => {
                sounds.playTapSound();
                setFilter('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'all'
                  ? 'bg-[#bc5a13] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => {
                sounds.playTapSound();
                setFilter('active');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'active'
                  ? 'bg-[#bc5a13] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Kitchen & Transit ({activeOrdersCount})
            </button>
            <button
              onClick={() => {
                sounds.playTapSound();
                setFilter('delivered');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === 'delivered'
                  ? 'bg-[#bc5a13] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Delivered ({orders.length - activeOrdersCount})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded-md w-1/3" />
              <div className="h-4 bg-gray-100 rounded-md w-2/3" />
              <div className="h-20 bg-gray-50 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center flex flex-col items-center justify-center my-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#fff1e6] flex items-center justify-center text-[#ff7a1a] mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1e1e1e]">No Orders In This View</h3>
          <p className="text-xs text-[#6b7280] max-w-xs mt-1 mb-4">
            {searchQuery
              ? `No matching orders found for "${searchQuery}".`
              : 'New customer orders placed on SachBite will automatically arrive here in real-time.'}
          </p>
          <button
            onClick={onSimulateOrder}
            className="px-4 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate An Order Now</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const orderDisplayId = order.orderId || (order._id ? `#SB-${order._id.slice(-5).toUpperCase()}` : '#SB-ORDER');
              const orderDateStr = order.createdAt || order.date || new Date().toISOString();
              const dateObj = new Date(orderDateStr);
              const formattedDate = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const isFoodReady = (order.status || '').toLowerCase().includes('ready');
              const isDelivered = (order.status || '').toLowerCase().includes('delivered');
              const isPreparing = (order.status || '').toLowerCase().includes('preparing') || (order.status || '').toLowerCase().includes('confirmed');

              return (
                <motion.div
                  key={order._id || order.id || order.orderId}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3.5 hover:shadow-md transition-shadow"
                >
                  {/* Top Order Card Row: Order ID + Status + KOT Button */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-[#1e1e1e] tracking-tight">
                          {orderDisplayId}
                        </span>
                        {order.paymentMethod && (
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold">
                            {order.paymentMethod}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-[#6b7280] mt-0.5">
                        <Clock className="w-3 h-3 text-[#ff7a1a]" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(order.status)}
                      <button
                        onClick={() => onOpenKot(order)}
                        className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                        title="Print Kitchen Ticket (KOT)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1e1e1e]">
                        {order.customerName}
                      </span>
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-[11px] font-bold text-[#b25511] bg-[#fff1e6] px-2.5 py-0.5 rounded-full border border-[#ff7a1a]/25 flex items-center space-x-1 hover:bg-[#ffe5d0] transition-colors"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{order.customerPhone}</span>
                        </a>
                      )}
                    </div>

                    {order.customerAddress && (
                      <div className="flex items-start space-x-1.5 text-[11px] text-[#6b7280]">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{order.customerAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Item List breakdown */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      Dishes in Order
                    </span>
                    <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                      {order.items && order.items.map((it, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-md bg-[#fff1e6] text-[#b25511] font-bold text-[10px] flex items-center justify-center">
                                {it.quantity}x
                              </span>
                              <span className="font-bold text-[#1e1e1e]">{it.name}</span>
                            </div>
                            <span className="font-bold text-[#1e1e1e]">₹{it.price * it.quantity}</span>
                          </div>
                          {it.variant && (
                            <p className="text-[10px] text-gray-500 pl-7">↳ Size / Variant: {it.variant}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rider Info Card if assigned */}
                  {order.rider && !isDelivered && (
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#bc5a13] text-white flex items-center justify-center">
                          <Bike className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#1e1e1e] block">
                            Rider: {order.rider.name}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            {order.rider.vehicleNumber} • ETA: ~{order.rider.etaMinutes || 5} mins
                          </span>
                        </div>
                      </div>

                      <a
                        href={`tel:${order.rider.phone}`}
                        className="p-2 rounded-xl bg-white border border-amber-300 text-[#b25511] shadow-2xs hover:bg-orange-100 transition-colors"
                        title="Call Rider"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Special Kitchen Notes */}
                  {order.notes && (
                    <p className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/60 p-2 rounded-xl leading-relaxed">
                      <strong>Customer Cooking Note:</strong> {order.notes}
                    </p>
                  )}

                  {/* Bottom Footer Action Bar */}
                  <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-[#6b7280] font-medium">Bill Total: </span>
                      <span className="text-base font-black text-[#1e1e1e]">
                        ₹{order.grandTotal}
                      </span>
                    </div>

                    {/* Operational Kitchen Button */}
                    {!isDelivered && (
                      <div className="flex flex-wrap items-center gap-2">
                        {onOpenPackingProof && (
                          <button
                            type="button"
                            onClick={() => onOpenPackingProof(order)}
                            className={`px-3 py-1.5 sm:py-2 rounded-full text-xs font-black border shadow-2xs flex items-center space-x-1 transition-all cursor-pointer ${
                              order.packingProofImage
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                            }`}
                          >
                            <span>📸</span>
                            <span>{order.packingProofImage ? 'Proof Saved' : 'Attach Photo'}</span>
                          </button>
                        )}

                        {onOpenRiderTracker && (
                          <button
                            type="button"
                            onClick={() => onOpenRiderTracker(order)}
                            className="px-3 py-1.5 sm:py-2 rounded-full bg-[#fff1e6] hover:bg-orange-100 text-[#b25511] text-xs font-black border border-[#ff7a1a]/30 shadow-2xs flex items-center space-x-1 transition-all cursor-pointer"
                          >
                            <Bike className="w-3.5 h-3.5" />
                            <span>Track Rider</span>
                          </button>
                        )}

                        {isPreparing && !isFoodReady && (
                          <button
                            onClick={() => handleMarkFoodReady(order)}
                            className="px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Ready</span>
                          </button>
                        )}
                        {isFoodReady && (
                          <span className="text-[11px] sm:text-xs font-bold text-[#16a34a] bg-[#e8f8ee] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-emerald-300">
                            Food Packed • Waiting Rider
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
