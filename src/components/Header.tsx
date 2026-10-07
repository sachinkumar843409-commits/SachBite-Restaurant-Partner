import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  RefreshCw,
  ChefHat,
  SlidersHorizontal,
  Award,
  Globe,
  MoreVertical,
  Store,
  Sparkles,
  X,
  Check,
  BookOpen,
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { RestaurantProfile } from '../types';
import { sounds } from '../utils/sound';
import { notificationManager } from '../utils/notifications';
import { SachBiteLogo } from './SachBiteLogo';

interface HeaderProps {
  restaurantName?: string;
  profile: RestaurantProfile | null;
  onRefreshAll: () => void;
  isRefreshing?: boolean;
  onSimulateOrder: () => void;
  onOpenKds: () => void;
  onOpenOperations: () => void;
  onOpenScorecard: () => void;
  onOpenBranchSwitcher?: () => void;
  onOpenUserGuide?: () => void;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  restaurantName,
  profile,
  onRefreshAll,
  isRefreshing,
  onSimulateOrder,
  onOpenKds,
  onOpenOperations,
  onOpenScorecard,
  onOpenBranchSwitcher,
  onOpenUserGuide,
  currentLang,
  onSelectLang,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsActive, setNotificationsActive] = useState(notificationManager.hasNotificationPermission);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);

  const t = translations[currentLang];

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playTapSound();
  };

  const enablePushNotifications = async () => {
    const granted = await notificationManager.requestPermission();
    setNotificationsActive(granted);
    if (granted) {
      notificationManager.showToast({
        type: 'success',
        title: 'Push Notifications Enabled',
        message: 'You will receive instant alerts for new orders.',
      });
    }
  };

  const isStoreOpen = profile?.isOpen !== false;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs px-2 sm:px-4 py-2 w-full max-w-full overflow-visible relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 w-full">
          {/* Left Side: Brand Logo + Status */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0 shrink">
            {/* Official SachBite Brand Logo */}
            <div className="shrink-0">
              <SachBiteLogo
                variant="horizontal"
                size="sm"
                showTagline={true}
                showScooter={true}
                className="cursor-pointer"
              />
            </div>

            {/* Branch Switcher (Visible on sm+ screens) */}
            {onOpenBranchSwitcher && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTapSound();
                  onOpenBranchSwitcher();
                }}
                className="hidden sm:flex px-2 py-1 rounded-full bg-gray-100 hover:bg-orange-50 border border-gray-200 text-[#1e1e1e] text-[10px] font-black items-center space-x-1 cursor-pointer transition-colors shrink-0"
                title="Switch between branches"
              >
                <span className="truncate max-w-[90px] md:max-w-[130px]">
                  {restaurantName || 'Main Outlet'}
                </span>
                <span className="text-[#ff7a1a] text-[9px]">▼</span>
              </button>
            )}

            {/* Store Live Online/Closed Badge */}
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                onOpenOperations();
              }}
              className={`px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 border transition-all cursor-pointer shrink-0 ${
                isStoreOpen
                  ? 'bg-[#e8f8ee] text-[#15803d] border-emerald-300 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              }`}
              title="Configure store timings and live visibility"
            >
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isStoreOpen ? 'bg-[#16a34a] animate-pulse' : 'bg-rose-600'}`} />
              <span>{isStoreOpen ? t.online : t.closed}</span>
              <SlidersHorizontal className="w-2.5 h-2.5 opacity-60 ml-0.5 hidden md:inline" />
            </button>

            {/* Kitchen Health Scorecard Badge (Desktop) */}
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                onOpenScorecard();
              }}
              className="hidden lg:flex items-center space-x-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
              title="View Kitchen Scorecard & Speed Grade"
            >
              <Award className="w-3 h-3 text-amber-600" />
              <span>96 Grade</span>
            </button>
          </div>

          {/* Right Side: Quick Action Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Language Selector (Desktop & Tablet) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => {
                  sounds.playTapSound();
                  setShowLangMenu(!showLangMenu);
                }}
                className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1e1e1e] text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-gray-600" />
                <span className="capitalize">
                  {currentLang === 'hi' ? 'हिंदी' : currentLang === 'hinglish' ? 'Hinglish' : 'EN'}
                </span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-1 space-y-0.5">
                  {[
                    { id: 'en' as const, label: 'English 🇬🇧' },
                    { id: 'hi' as const, label: 'हिंदी 🇮🇳' },
                    { id: 'hinglish' as const, label: 'Hinglish 🇮🇳' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        onSelectLang(l.id);
                        setShowLangMenu(false);
                        sounds.playTapSound();
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentLang === l.id ? 'bg-[#fff1e6] text-[#b25511]' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch KDS Kitchen Mode (Always visible & accessible) */}
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                onOpenKds();
              }}
              title="Open Fullscreen Kitchen Display System (KDS)"
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] sm:text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ChefHat className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span className="hidden xs:inline">{t.kdsMode}</span>
            </button>

            {/* Simulate incoming test order (Desktop & Tablet) */}
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                onSimulateOrder();
              }}
              title="Simulate incoming order chime & voice alert"
              className="hidden sm:flex px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-[#fff1e6] hover:bg-[#ffe2cc] text-[#b25511] border border-[#ff7a1a]/30 text-[10px] sm:text-[11px] font-bold items-center space-x-1 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span className="text-xs">⚡</span>
              <span className="hidden md:inline">{t.testOrder}</span>
            </button>

            {/* Sound Mute / Unmute Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
              className={`p-1.5 sm:p-2 rounded-full border transition-all cursor-pointer shrink-0 ${
                soundEnabled
                  ? 'bg-orange-50 text-[#ff7a1a] border-orange-200 hover:bg-orange-100'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Push Notifications Toggle (Tablet / Desktop) */}
            <button
              type="button"
              onClick={enablePushNotifications}
              title={notificationsActive ? 'Push alerts active' : 'Enable push alerts'}
              className={`hidden sm:flex p-1.5 sm:p-2 rounded-full border transition-all cursor-pointer shrink-0 ${
                notificationsActive
                  ? 'bg-emerald-50 text-[#16a34a] border-emerald-200'
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              {notificationsActive ? <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Sync Refresh Action */}
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                onRefreshAll();
              }}
              disabled={isRefreshing}
              title="Sync live orders & menu"
              className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-[#ff7a1a] hover:bg-orange-50 border border-gray-200 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-[#ff7a1a]' : ''}`} />
            </button>

            {/* Mobile Quick Drawer Trigger (For small screens < 640px) */}
            <div className="sm:hidden relative">
              <button
                type="button"
                onClick={() => {
                  sounds.playTapSound();
                  setShowMobileMoreMenu(!showMobileMoreMenu);
                }}
                className={`p-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
                  showMobileMoreMenu
                    ? 'bg-[#bc5a13] text-white border-[#bc5a13]'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                }`}
                title="More Actions & Tools"
                aria-label="More Actions"
              >
                {showMobileMoreMenu ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile More Actions Bottom Sheet / Popup Modal */}
      <AnimatePresence>
        {showMobileMoreMenu && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMoreMenu(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Sheet Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 bg-white rounded-t-3xl border-t border-gray-200 shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Top Handle & Title */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#bc5a13] flex items-center justify-center font-bold">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1e1e1e]">Quick Actions & Settings</h3>
                    <p className="text-[11px] text-gray-500">{restaurantName || 'SachBite Partner Outlet'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileMoreMenu(false)}
                  className="p-1 rounded-full bg-gray-100 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons Grid */}
              <div className="space-y-2">
                {/* Branch Switcher Button */}
                {onOpenBranchSwitcher && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMoreMenu(false);
                      sounds.playTapSound();
                      onOpenBranchSwitcher();
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-gray-50 hover:bg-orange-50 border border-gray-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff7a1a] flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1e1e1e] block">Switch Branch</span>
                        <span className="text-[10px] text-gray-500">Current: {restaurantName || 'Main Outlet'}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#ff7a1a] font-black">Change →</span>
                  </button>
                )}

                {/* Simulate Incoming Order */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMoreMenu(false);
                    sounds.playTapSound();
                    onSimulateOrder();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-[#fff1e6] hover:bg-[#ffe2cc] border border-[#ff7a1a]/30 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-[#bc5a13] text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#b25511] block">Test Incoming Order</span>
                      <span className="text-[10px] text-orange-700">Ring loud siren & voice announcement</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#bc5a13]">Test ⚡</span>
                </button>

                {/* Kitchen Health Scorecard */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMoreMenu(false);
                    sounds.playTapSound();
                    onOpenScorecard();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Kitchen Scorecard</span>
                      <span className="text-[10px] text-amber-700">Grade 96 • Fast Prep Speed</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-900">View →</span>
                </button>

                {/* Push Notifications Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    enablePushNotifications();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">Push Notifications</span>
                      <span className="text-[10px] text-emerald-700">Status: {notificationsActive ? 'Active ✅' : 'Disabled'}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notificationsActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {notificationsActive ? 'Enabled' : 'Enable'}
                  </span>
                </button>

                {/* Partner App Guidelines / User Manual */}
                {onOpenUserGuide && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMoreMenu(false);
                      sounds.playTapSound();
                      onOpenUserGuide();
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-orange-50/80 hover:bg-orange-100 border border-orange-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#bc5a13] text-white flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#b25511] block">App Guidelines & Manual</span>
                        <span className="text-[10px] text-orange-700">Step-by-step training instructions</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#bc5a13]">Open 📖</span>
                  </button>
                )}
              </div>

              {/* Language Selection Bar */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Select App Language / भाषा
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en' as const, label: 'English 🇬🇧' },
                    { id: 'hi' as const, label: 'हिंदी 🇮🇳' },
                    { id: 'hinglish' as const, label: 'Hinglish 🇮🇳' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        onSelectLang(l.id);
                        sounds.playTapSound();
                        setShowMobileMoreMenu(false);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                        currentLang === l.id
                          ? 'bg-[#ff7a1a] text-white border-[#ff7a1a] shadow-xs'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
