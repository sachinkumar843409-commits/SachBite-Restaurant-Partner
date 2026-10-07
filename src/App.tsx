/**
 * SachBite Restaurant Partner — Official Native Merchant App
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { ProfileTab } from './components/ProfileTab';
import { MenuTab } from './components/MenuTab';
import { OrdersTab } from './components/OrdersTab';
import { SubscriptionTab } from './components/SubscriptionTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { FinanceTab } from './components/FinanceTab';
import { MarketingTab } from './components/MarketingTab';
import { ReviewsTab } from './components/ReviewsTab';
import { SupportTab } from './components/SupportTab';

// Modals & Power Tools
import { KotReceiptModal } from './components/KotReceiptModal';
import { KdsViewModal } from './components/KdsViewModal';
import { OperationsModal } from './components/OperationsModal';
import { BulkStockModal } from './components/BulkStockModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { SoundSettingsModal } from './components/SoundSettingsModal';
import { ReportsModal } from './components/ReportsModal';
import { ComplianceVaultModal } from './components/ComplianceVaultModal';
import { IncomingOrderAlertModal } from './components/IncomingOrderAlertModal';
import { StaffManagerModal } from './components/StaffManagerModal';
import { DisputesModal } from './components/DisputesModal';
import { PackagingSettingsModal } from './components/PackagingSettingsModal';
import { TableQrStandeeModal } from './components/TableQrStandeeModal';
import { ClosingChecklistModal } from './components/ClosingChecklistModal';
import { ScorecardModal } from './components/ScorecardModal';
import { RiderLiveTrackerModal } from './components/RiderLiveTrackerModal';
import { BranchSwitcherModal } from './components/BranchSwitcherModal';
import { EodWhatsAppModal } from './components/EodWhatsAppModal';
import { DineInPosModal } from './components/DineInPosModal';
import { RawInventoryModal } from './components/RawInventoryModal';
import { LoyaltyMarketingModal } from './components/LoyaltyMarketingModal';
import { BluetoothPrinterModal } from './components/BluetoothPrinterModal';
import { PackingPhotoProofModal } from './components/PackingPhotoProofModal';
import { HappyHoursModal } from './components/HappyHoursModal';
import { RainModeModal } from './components/RainModeModal';
import { AiMenuDescriptionModal } from './components/AiMenuDescriptionModal';
import { UserGuideModal } from './components/UserGuideModal';

import { ToastContainer } from './components/ToastContainer';
import { DeviceFrame } from './components/DeviceFrame';

import { RestaurantProfile, MenuItem, Order, AppSettings } from './types';
import { Language, translations } from './utils/i18n';
import { api } from './services/api';
import { notificationManager } from './utils/notifications';

const DEFAULT_SETTINGS: AppSettings = {
  subscriptionPricePro: 499,
  subscriptionPriceBusiness: 999,
  businessUpiId: 'sachbite@icici',
  businessUpiName: 'SachBite Foods Pvt Ltd',
  supportPhone: '+91 98765 43210',
  supportEmail: 'partner@sachbite.in',
};

export default function App() {
  // App Lifecycle States
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurantName, setRestaurantName] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // Modals & Overlays
  const [selectedKotOrder, setSelectedKotOrder] = useState<Order | null>(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
  const [incomingAlertOrder, setIncomingAlertOrder] = useState<Order | null>(null);
  const [isKdsOpen, setIsKdsOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isBulkStockOpen, setIsBulkStockOpen] = useState(false);
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isDisputesOpen, setIsDisputesOpen] = useState(false);
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);
  const [isTableQrOpen, setIsTableQrOpen] = useState(false);
  const [isClosingChecklistOpen, setIsClosingChecklistOpen] = useState(false);
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [trackedRiderOrder, setTrackedRiderOrder] = useState<Order | null>(null);
  const [isBranchSwitcherOpen, setIsBranchSwitcherOpen] = useState(false);
  const [isEodWhatsAppOpen, setIsEodWhatsAppOpen] = useState(false);
  const [isDineInPosOpen, setIsDineInPosOpen] = useState(false);
  const [isRawInventoryOpen, setIsRawInventoryOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isPrinterOpen, setIsPrinterOpen] = useState(false);
  const [photoProofOrder, setPhotoProofOrder] = useState<Order | null>(null);
  const [isHappyHoursOpen, setIsHappyHoursOpen] = useState(false);
  const [isRainModeOpen, setIsRainModeOpen] = useState(false);
  const [aiWriterItem, setAiWriterItem] = useState<MenuItem | null>(null);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // Data States
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const prevOrderCountRef = useRef<number>(0);

  // 1. Initial Session Verification
  useEffect(() => {
    const checkAuth = async () => {
      const verifyRes = await api.verifySession();
      if (verifyRes.valid) {
        setIsAuthenticated(true);
        if (verifyRes.restaurantName) {
          setRestaurantName(verifyRes.restaurantName);
        }
      }
    };
    checkAuth();
  }, []);

  // 2. Load all partner data
  const loadAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoadingData(true);

    try {
      const [profileRes, menuRes, ordersRes, settingsRes] = await Promise.all([
        api.getProfile(),
        api.getMenu(),
        api.getOrders(),
        api.getSettings(),
      ]);

      if (profileRes.profile) {
        setProfile(profileRes.profile);
        setRestaurantName(profileRes.profile.name);
      }
      if (menuRes.items) {
        setMenuItems(menuRes.items);
      }
      if (ordersRes.orders) {
        setOrders(ordersRes.orders);
        prevOrderCountRef.current = ordersRes.orders.length;
      }
      if (settingsRes.settings) {
        setSettings(settingsRes.settings);
      }
    } catch (err) {
      console.error('Error fetching partner data:', err);
    } finally {
      if (!isSilent) setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, loadAllData]);

  // 3. Periodic Background Order Polling (every 20s)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.getOrders();
        if (res.orders && res.orders.length > 0) {
          if (res.orders.length > prevOrderCountRef.current && prevOrderCountRef.current > 0) {
            const newest = res.orders[0];
            setIncomingAlertOrder(newest);
            notificationManager.notifyNewOrder(
              newest.orderId || '#SB-NEW',
              newest.customerName || 'Customer',
              newest.grandTotal || 0
            );
          }
          prevOrderCountRef.current = res.orders.length;
          setOrders(res.orders);
        }
      } catch {
        // quiet poll fail
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handle Login Completion
  const handleLoginSuccess = (name?: string) => {
    setIsAuthenticated(true);
    if (name) setRestaurantName(name);
    loadAllData();
  };

  // Handle Logout
  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setProfile(null);
    setMenuItems([]);
    setOrders([]);
    setActiveTab('orders');
    notificationManager.showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out.',
    });
  };

  // Handle manual full refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadAllData(true);
    setTimeout(() => {
      setIsRefreshing(false);
      notificationManager.showToast({
        type: 'success',
        title: 'Data Synced',
        message: 'Live orders, catalog & status updated.',
      });
    }, 400);
  };

  // Handle Simulated Live Incoming Order
  const handleSimulateOrder = async () => {
    const newOrd = await api.simulateNewOrder();
    setOrders((prev) => [newOrd, ...prev]);
    prevOrderCountRef.current += 1;
    // Trigger loud ringing popup modal + vibration
    setIncomingAlertOrder(newOrd);
    notificationManager.notifyNewOrder(
      newOrd.orderId || '#SB-LIVE',
      newOrd.customerName,
      newOrd.grandTotal
    );
  };

  // Update order status across KDS and live lists
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], extra?: Partial<Order>) => {
    await api.updateOrderStatus(orderId, status, extra);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId || o.orderId === orderId ? { ...o, status, ...extra } : o))
    );
  };

  // Calculate live active orders count for badge
  const activeOrdersCount = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return !s.includes('delivered') && !s.includes('cancelled');
  }).length;

  return (
    <>
      <ToastContainer />

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Login Screen if not authenticated */}
      {!showSplash && !isAuthenticated && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Heavy Loud Incoming Order Alert Overlay */}
      <IncomingOrderAlertModal
        order={incomingAlertOrder}
        onAccept={async (ord, prepMins) => {
          setIncomingAlertOrder(null);
          await handleUpdateOrderStatus(ord._id || ord.id || '', 'Preparing', {
            prepTimeMinutes: prepMins,
            acceptedAt: new Date().toISOString(),
          });
          notificationManager.showToast({
            type: 'success',
            title: 'Order Accepted!',
            message: `Order #${ord.orderId} moved to kitchen (${prepMins}m).`,
          });
        }}
        onViewDetails={(ord) => {
          setIncomingAlertOrder(null);
          setSelectedDetailOrder(ord);
        }}
        onDismiss={() => setIncomingAlertOrder(null)}
      />

      {/* Fullscreen KDS View Modal */}
      <AnimatePresence>
        {isKdsOpen && (
          <KdsViewModal
            orders={orders}
            profile={profile}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onOpenKot={(ord) => setSelectedKotOrder(ord)}
            onClose={() => setIsKdsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Kitchen Order Ticket (KOT) Receipt Printing Modal */}
      <KotReceiptModal
        order={selectedKotOrder}
        profile={profile}
        onClose={() => setSelectedKotOrder(null)}
      />

      {/* Order Detail Deep Inspector Modal */}
      <OrderDetailModal
        order={selectedDetailOrder}
        profile={profile}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onOpenKot={(ord) => setSelectedKotOrder(ord)}
        onClose={() => setSelectedDetailOrder(null)}
      />

      {/* Store Operations Modal */}
      <OperationsModal
        isOpen={isOperationsOpen}
        profile={profile}
        onProfileUpdated={(p) => setProfile(p)}
        onClose={() => setIsOperationsOpen(false)}
      />

      {/* Kitchen Scorecard & Outlet Health Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        profile={profile}
        onClose={() => setIsScorecardOpen(false)}
      />

      {/* Bulk Inventory Switchboard Modal */}
      <BulkStockModal
        isOpen={isBulkStockOpen}
        items={menuItems}
        onItemUpdated={(updated) =>
          setMenuItems((prev) =>
            prev.map((i) =>
              i._id === updated._id || i.id === updated._id || i._id === updated.id
                ? updated
                : i
            )
          )
        }
        onClose={() => setIsBulkStockOpen(false)}
      />

      {/* Loud Ringtone & Sound Settings Modal */}
      <SoundSettingsModal
        isOpen={isSoundSettingsOpen}
        onClose={() => setIsSoundSettingsOpen(false)}
      />

      {/* CSV & GST Tax Reports Export Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        orders={orders}
        profile={profile}
        onClose={() => setIsReportsOpen(false)}
      />

      {/* FSSAI & Regulatory License Vault Modal */}
      <ComplianceVaultModal
        isOpen={isComplianceOpen}
        profile={profile}
        onProfileUpdated={(p) => setProfile(p)}
        onClose={() => setIsComplianceOpen(false)}
      />

      {/* Staff Accounts & PIN Lock Modal */}
      <StaffManagerModal
        isOpen={isStaffOpen}
        onClose={() => setIsStaffOpen(false)}
      />

      {/* Disputes & Complaints Resolution Modal */}
      <DisputesModal
        isOpen={isDisputesOpen}
        onClose={() => setIsDisputesOpen(false)}
      />

      {/* Packaging Charges & Basket Modal */}
      <PackagingSettingsModal
        isOpen={isPackagingOpen}
        profile={profile}
        onProfileUpdated={(p) => setProfile(p)}
        onClose={() => setIsPackagingOpen(false)}
      />

      {/* Table & Counter QR Standee Modal */}
      <TableQrStandeeModal
        isOpen={isTableQrOpen}
        profile={profile}
        onClose={() => setIsTableQrOpen(false)}
      />

      {/* Store Closing Checklist Modal */}
      <ClosingChecklistModal
        isOpen={isClosingChecklistOpen}
        onCompleteClosing={async () => {
          await api.updateProfile({ isOpen: false });
          if (profile) setProfile({ ...profile, isOpen: false });
        }}
        onClose={() => setIsClosingChecklistOpen(false)}
      />

      {/* Live Rider GPS Tracking Radar Modal */}
      <RiderLiveTrackerModal
        isOpen={Boolean(trackedRiderOrder)}
        order={trackedRiderOrder}
        onClose={() => setTrackedRiderOrder(null)}
        onRiderArrived={() => {
          if (trackedRiderOrder) {
            handleUpdateOrderStatus(trackedRiderOrder._id || trackedRiderOrder.id || '', 'Food Ready');
          }
        }}
      />

      {/* Multi-Branch / Outlet Switcher Modal */}
      <BranchSwitcherModal
        isOpen={isBranchSwitcherOpen}
        profile={profile}
        onBranchSelected={(branch) => {
          setRestaurantName(branch.name);
          if (profile) {
            setProfile({
              ...profile,
              name: branch.name,
              contactPhone: branch.phone,
              address: `${branch.area}, ${branch.city}`,
              isOpen: branch.isOpen,
            });
          }
        }}
        onClose={() => setIsBranchSwitcherOpen(false)}
      />

      {/* Daily EOD WhatsApp & SMS Summary Report Modal */}
      <EodWhatsAppModal
        isOpen={isEodWhatsAppOpen}
        orders={orders}
        profile={profile}
        onClose={() => setIsEodWhatsAppOpen(false)}
      />

      {/* Dine-In POS Billing & Counter Kiosk Modal */}
      <DineInPosModal
        isOpen={isDineInPosOpen}
        menuItems={menuItems}
        profile={profile}
        onClose={() => setIsDineInPosOpen(false)}
      />

      {/* Kitchen Raw Material & Ingredients Stock Modal */}
      <RawInventoryModal
        isOpen={isRawInventoryOpen}
        onClose={() => setIsRawInventoryOpen(false)}
      />

      {/* Customer Loyalty & WhatsApp Re-Order Campaign Modal */}
      <LoyaltyMarketingModal
        isOpen={isLoyaltyOpen}
        profile={profile}
        onClose={() => setIsLoyaltyOpen(false)}
      />

      {/* Direct Bluetooth & USB ESC/POS Thermal Printer Modal */}
      <BluetoothPrinterModal
        isOpen={isPrinterOpen}
        onClose={() => setIsPrinterOpen(false)}
      />

      {/* Food Packing Photo Proof & Dispute Shield Modal */}
      <PackingPhotoProofModal
        isOpen={Boolean(photoProofOrder)}
        order={photoProofOrder}
        onPhotoSaved={(orderId, photoUrl) => {
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId || o.id === orderId || o.orderId === orderId
                ? { ...o, packingProofImage: photoUrl, packedAt: new Date().toISOString() }
                : o
            )
          );
          setPhotoProofOrder(null);
        }}
        onClose={() => setPhotoProofOrder(null)}
      />

      {/* Happy Hours & Late Night Dynamic Pricing Modal */}
      <HappyHoursModal
        isOpen={isHappyHoursOpen}
        onClose={() => setIsHappyHoursOpen(false)}
      />

      {/* Rain Mode & Weather Surge Buffer Modal */}
      <RainModeModal
        isOpen={isRainModeOpen}
        onClose={() => setIsRainModeOpen(false)}
      />

      {/* AI Smart Menu Writer & Allergen Tag Modal */}
      <AiMenuDescriptionModal
        isOpen={Boolean(aiWriterItem)}
        item={aiWriterItem}
        onDescriptionApplied={(itemId, desc, allergens) => {
          setMenuItems((prev) =>
            prev.map((it) =>
              it._id === itemId || it.id === itemId
                ? { ...it, description: desc, allergens }
                : it
            )
          );
          setAiWriterItem(null);
        }}
        onClose={() => setAiWriterItem(null)}
      />

      {/* Partner Training & User Guidelines Manual Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
      />

      {/* Authenticated Dashboard */}
      {!showSplash && isAuthenticated && (
        <DeviceFrame>
          <div className="min-h-screen bg-[#fafafa] flex flex-col relative selection:bg-[#fff1e6] selection:text-[#bc5a13]">
            {/* Top App Header */}
            <Header
              restaurantName={restaurantName || profile?.name}
              profile={profile}
              onRefreshAll={handleManualRefresh}
              isRefreshing={isRefreshing}
              onSimulateOrder={handleSimulateOrder}
              onOpenKds={() => setIsKdsOpen(true)}
              onOpenOperations={() => setIsOperationsOpen(true)}
              onOpenScorecard={() => setIsScorecardOpen(true)}
              onOpenBranchSwitcher={() => setIsBranchSwitcherOpen(true)}
              onOpenUserGuide={() => setIsUserGuideOpen(true)}
              currentLang={currentLang}
              onSelectLang={(lang) => setCurrentLang(lang)}
            />

            {/* Quick Utility Action Bar in Auxiliary Tabs */}
            {['marketing', 'reviews', 'subscription', 'support'].includes(activeTab) && (
              <div className="bg-[#fff1e6] px-4 py-2 border-b border-[#ff7a1a]/20 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-bold text-[#b25511] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>← Back to Partner Hub</span>
                </button>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#b25511]">
                  {activeTab.toUpperCase()}
                </span>
              </div>
            )}

            {/* Main Content Viewport with Shared-Axis Motion */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrdersTab
                      orders={orders}
                      profile={profile}
                      onRefreshOrders={async () => {
                        const res = await api.getOrders();
                        if (res.orders) setOrders(res.orders);
                      }}
                      onSimulateOrder={handleSimulateOrder}
                      onUpdateOrderStatus={handleUpdateOrderStatus}
                      onOpenKot={(ord) => setSelectedKotOrder(ord)}
                      onOpenKds={() => setIsKdsOpen(true)}
                      onOpenRiderTracker={(ord) => setTrackedRiderOrder(ord)}
                      onOpenDineInPos={() => setIsDineInPosOpen(true)}
                      onOpenEodWhatsApp={() => setIsEodWhatsAppOpen(true)}
                      onOpenRawInventory={() => setIsRawInventoryOpen(true)}
                      onOpenBluetoothPrinter={() => setIsPrinterOpen(true)}
                      onOpenPackingProof={(ord) => setPhotoProofOrder(ord)}
                      onOpenRainMode={() => setIsRainModeOpen(true)}
                      isLoading={isLoadingData}
                    />
                  </motion.div>
                )}

                {activeTab === 'menu' && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuTab
                      items={menuItems}
                      onItemAdded={(item) => setMenuItems((prev) => [item, ...prev])}
                      onItemUpdated={(updated) =>
                        setMenuItems((prev) =>
                          prev.map((i) =>
                            i._id === updated._id || i.id === updated._id || i._id === updated.id
                              ? updated
                              : i
                          )
                        )
                      }
                      onItemDeleted={(itemId) =>
                        setMenuItems((prev) => prev.filter((i) => i._id !== itemId && i.id !== itemId))
                      }
                      onOpenAiMenuWriter={(item) => setAiWriterItem(item)}
                      isLoading={isLoadingData}
                    />
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnalyticsTab
                      orders={orders}
                      menuItems={menuItems}
                      profile={profile}
                    />
                  </motion.div>
                )}

                {activeTab === 'finance' && (
                  <motion.div
                    key="finance"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FinanceTab
                      profile={profile}
                      onProfileUpdated={(p) => setProfile(p)}
                    />
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-3">
                      {/* Power Quick Tools Strip */}
                      <div className="max-w-2xl mx-auto px-4 pt-3 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                          onClick={() => setIsPrinterOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>🖨️ Thermal Auto-Print</span>
                        </button>
                        <button
                          onClick={() => setIsRainModeOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-sky-50 border border-sky-300 text-sky-800 text-xs font-bold shadow-2xs hover:bg-sky-100 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>🌧️ Rain Mode</span>
                        </button>
                        <button
                          onClick={() => setIsHappyHoursOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold shadow-2xs hover:bg-amber-100 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>🕒 Happy Hours</span>
                        </button>
                        <button
                          onClick={() => setIsBulkStockOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>⚡ Bulk 86 Stock</span>
                        </button>
                        <button
                          onClick={() => setIsSoundSettingsOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>🔔 Voice & Alarm</span>
                        </button>
                        <button
                          onClick={() => setIsReportsOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>📄 Export CSV / GST</span>
                        </button>
                        <button
                          onClick={() => setIsComplianceOpen(true)}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#1e1e1e] text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-300 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                        >
                          <span>🛡️ FSSAI Vault</span>
                        </button>
                      </div>

                      <ProfileTab
                        profile={profile}
                        onProfileUpdated={(updated) => {
                          setProfile(updated);
                          setRestaurantName(updated.name);
                        }}
                        onLogout={handleLogout}
                        onNavigateTab={(tab) => setActiveTab(tab)}
                        onOpenOperations={() => setIsOperationsOpen(true)}
                        onOpenStaff={() => setIsStaffOpen(true)}
                        onOpenDisputes={() => setIsDisputesOpen(true)}
                        onOpenPackaging={() => setIsPackagingOpen(true)}
                        onOpenTableQr={() => setIsTableQrOpen(true)}
                        onOpenClosingChecklist={() => setIsClosingChecklistOpen(true)}
                        onOpenLoyaltyCampaigns={() => setIsLoyaltyOpen(true)}
                        onOpenRawInventory={() => setIsRawInventoryOpen(true)}
                        onOpenDineInPos={() => setIsDineInPosOpen(true)}
                        onOpenEodWhatsApp={() => setIsEodWhatsAppOpen(true)}
                        onOpenBranchSwitcher={() => setIsBranchSwitcherOpen(true)}
                        onOpenBluetoothPrinter={() => setIsPrinterOpen(true)}
                        onOpenHappyHours={() => setIsHappyHoursOpen(true)}
                        onOpenRainMode={() => setIsRainModeOpen(true)}
                        onOpenUserGuide={() => setIsUserGuideOpen(true)}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'marketing' && (
                  <motion.div
                    key="marketing"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MarketingTab />
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ReviewsTab profile={profile} />
                  </motion.div>
                )}

                {activeTab === 'subscription' && (
                  <motion.div
                    key="subscription"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SubscriptionTab
                      profile={profile}
                      settings={settings}
                      onSubscriptionUpdated={(updated) => setProfile(updated)}
                    />
                  </motion.div>
                )}

                {activeTab === 'support' && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SupportTab settings={settings} />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Bottom 5-Tab Navigation Bar */}
            <BottomTabBar
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
              activeOrdersCount={activeOrdersCount}
            />
          </div>
        </DeviceFrame>
      )}
    </>
  );
}
