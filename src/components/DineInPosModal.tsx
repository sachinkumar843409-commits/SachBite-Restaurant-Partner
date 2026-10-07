import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Utensils,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  Search,
  Sparkles,
  UserCheck,
  Receipt,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { MenuItem, RestaurantProfile, DineInTable } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface DineInPosModalProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  profile: RestaurantProfile | null;
  onClose: () => void;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export const DineInPosModal: React.FC<DineInPosModalProps> = ({
  isOpen,
  menuItems,
  profile,
  onClose,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('T-1');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSuccessView, setIsSuccessView] = useState(false);
  const [latestBillNo, setLatestBillNo] = useState('');
  const [mobileTab, setMobileTab] = useState<'menu' | 'bill'>('menu');

  const tables: DineInTable[] = [
    { tableNumber: 'T-1', capacity: 4, status: 'available' },
    { tableNumber: 'T-2', capacity: 2, status: 'occupied', activeBillAmount: 640 },
    { tableNumber: 'T-3', capacity: 6, status: 'available' },
    { tableNumber: 'T-4', capacity: 4, status: 'available' },
    { tableNumber: 'T-5', capacity: 2, status: 'occupied', activeBillAmount: 1120 },
    { tableNumber: 'T-6', capacity: 8, status: 'available' },
    { tableNumber: 'Counter Takeaway', capacity: 1, status: 'available' },
  ];

  if (!isOpen) return null;

  const filteredMenu = menuItems.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item: MenuItem) => {
    sounds.playTapSound();
    setCart((prev) => {
      const existing = prev.find((c) => (c.item._id || c.item.id) === (item._id || item.id));
      if (existing) {
        return prev.map((c) =>
          (c.item._id || c.item.id) === (item._id || item.id)
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    sounds.playTapSound();
    setCart((prev) =>
      prev
        .map((c) => {
          if ((c.item._id || c.item.id) === itemId) {
            return { ...c, quantity: c.quantity + delta };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const gstTax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = subtotal - discountAmount + gstTax;

  const handleSettleAndPrint = () => {
    if (cart.length === 0) {
      notificationManager.showToast({
        type: 'warning',
        title: 'Empty Bill',
        message: 'Please add at least one dish to settle the bill.',
      });
      return;
    }

    sounds.playSuccessSound();
    const billId = `POS-${Date.now().toString().slice(-5)}`;
    setLatestBillNo(billId);
    setIsSuccessView(true);

    notificationManager.showToast({
      type: 'success',
      title: 'Bill Settled Successfully!',
      message: `${selectedTable} Bill #${billId} paid via ${paymentMode}.`,
    });
  };

  const handleResetForNewBill = () => {
    setIsSuccessView(false);
    setCart([]);
    setDiscountPercent(0);
    setMobileTab('menu');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-4xl h-[92vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-[#1e1e1e] to-neutral-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-orange-300 block">
                  DIGITAL POS & DINE-IN BILLING
                </span>
                <h3 className="text-sm sm:text-base font-black truncate max-w-[200px] sm:max-w-none">
                  {profile?.name || 'SachBite Counter POS'}
                </h3>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Segmented Switcher (Visible only on < md screens) */}
          {!isSuccessView && (
            <div className="md:hidden flex items-center bg-gray-100 p-1.5 border-b border-gray-200 shrink-0">
              <button
                onClick={() => setMobileTab('menu')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mobileTab === 'menu' ? 'bg-white text-[#bc5a13] shadow-xs' : 'text-gray-600'
                }`}
              >
                🍽️ Menu & Tables
              </button>
              <button
                onClick={() => setMobileTab('bill')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                  mobileTab === 'bill' ? 'bg-[#bc5a13] text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Bill ({cart.length}) • ₹{grandTotal}</span>
              </button>
            </div>
          )}

          {!isSuccessView ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left Column: Tables & Menu (7 cols on desktop, conditionally rendered or full on mobile) */}
              <div className={`${mobileTab === 'menu' ? 'flex' : 'hidden'} md:flex md:col-span-7 p-3 sm:p-4 border-r border-gray-100 flex-col h-full overflow-hidden space-y-3 bg-[#fafafa]`}>
                {/* Table selector bar */}
                <div className="space-y-1 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Select Table / Order Type:
                  </span>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                    {tables.map((tbl) => (
                      <button
                        key={tbl.tableNumber}
                        type="button"
                        onClick={() => setSelectedTable(tbl.tableNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          selectedTable === tbl.tableNumber
                            ? 'bg-[#bc5a13] text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>{tbl.tableNumber}</span>
                        {tbl.status === 'occupied' && (
                          <span className="ml-1.5 text-[9px] bg-rose-500 text-white px-1 py-0.2 rounded-full">
                            Occupied
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Search */}
                <div className="relative shrink-0">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dishes to add to bill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                {/* Dish Grid */}
                <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 pr-1">
                  {filteredMenu.map((item) => (
                    <div
                      key={item._id || item.id}
                      onClick={() => handleAddToCart(item)}
                      className="p-3 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-[#ff7a1a] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{item.icon || '🍲'}</span>
                          <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                            item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`} />
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-[#1e1e1e] line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-gray-400 line-clamp-1">{item.category}</span>
                      </div>

                      <div className="mt-2 pt-1 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-black text-[#1e1e1e]">₹{item.price}</span>
                        <span className="w-5 h-5 rounded-lg bg-orange-50 text-[#bc5a13] font-black text-xs flex items-center justify-center hover:bg-[#bc5a13] hover:text-white transition-colors">
                          +
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Billing Ticket & Payment (5 cols on desktop, conditionally rendered on mobile) */}
              <div className={`${mobileTab === 'bill' ? 'flex' : 'hidden'} md:flex md:col-span-5 p-3 sm:p-4 flex-col h-full bg-white justify-between overflow-hidden`}>
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Bill header */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 shrink-0">
                    <div>
                      <h4 className="text-sm font-black text-[#1e1e1e]">Bill for {selectedTable}</h4>
                      <p className="text-[10px] text-gray-400">Order Items ({cart.length})</p>
                    </div>
                    {cart.length > 0 && (
                      <button
                        onClick={() => setCart([])}
                        className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Cart Item list */}
                  <div className="flex-1 overflow-y-auto py-2 space-y-2">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-1 py-8">
                        <Utensils className="w-8 h-8 stroke-1 text-gray-300" />
                        <p className="text-xs font-medium">Click dishes on left to add</p>
                        <button
                          onClick={() => setMobileTab('menu')}
                          className="md:hidden mt-2 text-xs font-bold text-[#bc5a13] underline"
                        >
                          Browse Menu
                        </button>
                      </div>
                    ) : (
                      cart.map(({ item, quantity }) => (
                        <div
                          key={item._id || item.id}
                          className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl"
                        >
                          <div className="flex-1 pr-2">
                            <span className="font-bold text-[#1e1e1e] line-clamp-1">{item.name}</span>
                            <span className="text-[10px] text-gray-500">₹{item.price} each</span>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => handleUpdateQty(item._id || item.id || '', -1)}
                              className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-black hover:bg-gray-100 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-black text-xs text-[#1e1e1e]">{quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item._id || item.id || '', 1)}
                              className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-black hover:bg-gray-100 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-black text-xs text-[#1e1e1e] w-14 text-right shrink-0">
                            ₹{item.price * quantity}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculations breakdown */}
                  {cart.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 space-y-1 text-xs shrink-0">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal:</span>
                        <span className="font-bold text-[#1e1e1e]">₹{subtotal}</span>
                      </div>

                      {/* Discount Selector */}
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-500">Discount:</span>
                        <div className="flex items-center space-x-1">
                          {[0, 5, 10, 15].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDiscountPercent(d)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                discountPercent === d
                                  ? 'bg-[#bc5a13] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {d === 0 ? '0%' : `${d}%`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount Applied ({discountPercent}%):</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-500">
                        <span>GST Tax (5%):</span>
                        <span>₹{gstTax}</span>
                      </div>

                      <div className="flex justify-between text-sm font-black text-[#1e1e1e] pt-1.5 border-t border-gray-200">
                        <span>Grand Total:</span>
                        <span className="text-[#bc5a13]">₹{grandTotal}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Mode Selector & Settle Button */}
                <div className="pt-3 border-t border-gray-100 space-y-2.5 shrink-0">
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['UPI', 'Cash', 'Card'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-1.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
                          paymentMode === mode
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {mode === 'UPI' && <QrCode className="w-3.5 h-3.5 text-emerald-400" />}
                        {mode === 'Cash' && <Banknote className="w-3.5 h-3.5 text-amber-400" />}
                        {mode === 'Card' && <CreditCard className="w-3.5 h-3.5 text-sky-400" />}
                        <span>{mode}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSettleAndPrint}
                    disabled={cart.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-[#bc5a13] to-[#e85d04] hover:from-[#e85d04] hover:to-[#ff7a1a] text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center space-x-2 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Settle & Print Bill (₹{grandTotal})</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Success View */
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-[#e8f8ee]/40 to-white">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Bill Settled Successfully
                </span>
                <h3 className="text-2xl font-black text-[#1e1e1e] mt-1">
                  #{latestBillNo}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Table {selectedTable} • Paid ₹{grandTotal} via {paymentMode}
                </p>
              </div>

              {/* Bill Details Summary Card */}
              <div className="w-full max-w-sm p-4 bg-white rounded-2xl border border-gray-200 shadow-sm text-left text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-gray-600 border-b border-gray-100 pb-1">
                  <span>Items</span>
                  <span>Total</span>
                </div>
                {cart.map((c) => (
                  <div key={c.item._id || c.item.id} className="flex justify-between">
                    <span>{c.quantity}x {c.item.name}</span>
                    <span className="font-bold">₹{c.item.price * c.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-[#1e1e1e]">
                  <span>Paid Total:</span>
                  <span className="text-[#16a34a]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4 text-[#ff7a1a]" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={handleResetForNewBill}
                  className="px-6 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <span>New Order / Next Table</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
