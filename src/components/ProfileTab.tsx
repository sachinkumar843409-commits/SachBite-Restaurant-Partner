import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Mail,
  Phone,
  Tag,
  Store,
  Shield,
  LogOut,
  Save,
  CheckCircle,
  Crown,
  Calendar,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Percent,
  Star,
  LifeBuoy,
  Wallet,
  Users,
  AlertTriangle,
  QrCode,
  Package,
  Moon,
  BookOpen,
} from 'lucide-react';
import { RestaurantProfile, TabType } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SachBiteLogo } from './SachBiteLogo';

interface ProfileTabProps {
  profile: RestaurantProfile | null;
  onProfileUpdated: (updated: RestaurantProfile) => void;
  onLogout: () => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenOperations: () => void;
  onOpenStaff: () => void;
  onOpenDisputes: () => void;
  onOpenPackaging: () => void;
  onOpenTableQr: () => void;
  onOpenClosingChecklist: () => void;
  onOpenLoyaltyCampaigns?: () => void;
  onOpenRawInventory?: () => void;
  onOpenDineInPos?: () => void;
  onOpenEodWhatsApp?: () => void;
  onOpenBranchSwitcher?: () => void;
  onOpenBluetoothPrinter?: () => void;
  onOpenHappyHours?: () => void;
  onOpenRainMode?: () => void;
  onOpenUserGuide?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onProfileUpdated,
  onLogout,
  onNavigateTab,
  onOpenOperations,
  onOpenStaff,
  onOpenDisputes,
  onOpenPackaging,
  onOpenTableQr,
  onOpenClosingChecklist,
  onOpenLoyaltyCampaigns,
  onOpenRawInventory,
  onOpenDineInPos,
  onOpenEodWhatsApp,
  onOpenBranchSwitcher,
  onOpenBluetoothPrinter,
  onOpenHappyHours,
  onOpenRainMode,
  onOpenUserGuide,
}) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    contactEmail: profile?.contactEmail || '',
    contactPhone: profile?.contactPhone || '',
    tags: Array.isArray(profile?.tags) ? profile?.tags.join(', ') : profile?.tags || '',
    image: profile?.image || '',
    address: profile?.address || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        contactEmail: profile.contactEmail || '',
        contactPhone: profile.contactPhone || '',
        tags: Array.isArray(profile.tags) ? profile.tags.join(', ') : profile.tags || '',
        image: profile.image || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res.url) {
        setFormData((prev) => ({ ...prev, image: res.url || '' }));
        const updateRes = await api.updateProfile({ image: res.url });
        if (updateRes.profile) {
          onProfileUpdated(updateRes.profile);
        }
        notificationManager.showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Restaurant banner photo updated successfully.',
        });
      }
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Upload Error',
        message: 'Something went wrong while uploading photo.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await api.updateProfile({
        name: formData.name,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        tags: formData.tags,
        image: formData.image,
        address: formData.address,
      });

      if (res.success && res.profile) {
        onProfileUpdated(res.profile);
        notificationManager.showToast({
          type: 'success',
          title: 'Profile Saved',
          message: 'Your restaurant profile has been updated.',
        });
      }
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to SachBite server.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const planName = (profile?.subscriptionPlan || 'free').toUpperCase();
  const planStatus = (profile?.subscriptionStatus || 'inactive').toLowerCase();
  const isActivePlan = planStatus === 'active';
  const isPendingPlan = planStatus === 'pending';

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Restaurant Header Card with Banner Upload */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-100"
      >
        {/* Banner / Cover */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-orange-400 to-amber-500 overflow-hidden">
          {formData.image ? (
            <img
              src={formData.image}
              alt={formData.name || 'Restaurant Cover'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/90 bg-[#ff7a1a]/80">
              <Store className="w-12 h-12 opacity-40 mb-1" />
              <span className="text-xs font-semibold tracking-wider uppercase opacity-75">
                No Restaurant Banner Uploaded
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            {isUploading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
          </button>
        </div>

        {/* Profile Info Summary */}
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">
                  {formData.name || 'Unnamed Restaurant'}
                </h1>
                <CheckCircle className="w-4 h-4 text-[#16a34a]" />
              </div>
              <p className="text-xs text-[#6b7280] mt-0.5">
                {formData.tags || 'Cuisines & Specialities'}
              </p>
            </div>

            {/* Quick Subscription Chip */}
            <div
              onClick={() => onNavigateTab('subscription')}
              className="self-start sm:self-auto inline-flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/25 text-[#b25511] hover:bg-[#ffe5d0] transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider block leading-none">
                  {planName} PLAN
                </span>
                <span className={`text-[10px] font-semibold leading-tight flex items-center gap-1 ${
                  isActivePlan ? 'text-[#16a34a]' : isPendingPlan ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isActivePlan ? 'bg-[#16a34a]' : isPendingPlan ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  {isActivePlan ? 'Active' : isPendingPlan ? 'Verification Pending' : 'Inactive'}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#b25511]/60" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Partner Complete Hub Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#1e1e1e] ml-1">
          Partner Hub & Merchant Tools
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Customer Loyalty & WhatsApp Campaigns */}
          {onOpenLoyaltyCampaigns && (
            <button
              onClick={onOpenLoyaltyCampaigns}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">VIP Loyalty & Offers</span>
                <span className="text-[10px] text-[#6b7280]">WhatsApp re-order</span>
              </div>
            </button>
          )}

          {/* Raw Material Inventory */}
          {onOpenRawInventory && (
            <button
              onClick={onOpenRawInventory}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Raw Stock & Buffer</span>
                <span className="text-[10px] text-[#6b7280]">Paneer & cheese alert</span>
              </div>
            </button>
          )}

          {/* Dine-In Counter POS */}
          {onOpenDineInPos && (
            <button
              onClick={onOpenDineInPos}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Dine-In POS Billing</span>
                <span className="text-[10px] text-[#6b7280]">Table bills & thermal print</span>
              </div>
            </button>
          )}

          {/* Daily EOD WhatsApp Closing */}
          {onOpenEodWhatsApp && (
            <button
              onClick={onOpenEodWhatsApp}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-green-50 text-[#25D366] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">EOD WhatsApp Report</span>
                <span className="text-[10px] text-[#6b7280]">11:30 PM store closure</span>
              </div>
            </button>
          )}

          {/* Bluetooth ESC/POS Thermal Printer */}
          {onOpenBluetoothPrinter && (
            <button
              onClick={onOpenBluetoothPrinter}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#bc5a13] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Thermal Printer</span>
                <span className="text-[10px] text-[#6b7280]">Bluetooth 58/80mm</span>
              </div>
            </button>
          )}

          {/* Happy Hours & Dynamic Time Pricing */}
          {onOpenHappyHours && (
            <button
              onClick={onOpenHappyHours}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Happy Hours & Slots</span>
                <span className="text-[10px] text-[#6b7280]">Lunch & late night</span>
              </div>
            </button>
          )}

          {/* Rain Mode Surge */}
          {onOpenRainMode && (
            <button
              onClick={onOpenRainMode}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Rain Mode Surge</span>
                <span className="text-[10px] text-[#6b7280]">Weather prep buffer</span>
              </div>
            </button>
          )}

          {/* Branch Switcher */}
          {onOpenBranchSwitcher && (
            <button
              onClick={onOpenBranchSwitcher}
              className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1e1e1e] block">Branch Switcher</span>
                <span className="text-[10px] text-[#6b7280]">Multi-outlet franchise</span>
              </div>
            </button>
          )}

          {/* Operations */}
          <button
            onClick={onOpenOperations}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Store Timings</span>
              <span className="text-[10px] text-[#6b7280]">Online/Offline & 7-Day</span>
            </div>
          </button>

          {/* Staff Accounts & PIN Lock */}
          <button
            onClick={onOpenStaff}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Staff & PIN Lock</span>
              <span className="text-[10px] text-[#6b7280]">Chef & Cashier roles</span>
            </div>
          </button>

          {/* Customer Disputes & Complaints */}
          <button
            onClick={onOpenDisputes}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Order Disputes</span>
              <span className="text-[10px] text-[#6b7280]">Spill & missing claims</span>
            </div>
          </button>

          {/* Packaging & Basket Rules */}
          <button
            onClick={onOpenPackaging}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Packaging Charges</span>
              <span className="text-[10px] text-[#6b7280]">Container fee & basket</span>
            </div>
          </button>

          {/* Table / Counter QR Standee */}
          <button
            onClick={onOpenTableQr}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Table QR Standee</span>
              <span className="text-[10px] text-[#6b7280]">Printable counter QR</span>
            </div>
          </button>

          {/* Store Closing Checklist */}
          <button
            onClick={onOpenClosingChecklist}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Closing Checklist</span>
              <span className="text-[10px] text-[#6b7280]">Nightly handover</span>
            </div>
          </button>

          {/* App Guidelines & Training Manual */}
          {onOpenUserGuide && (
            <button
              onClick={onOpenUserGuide}
              className="p-3.5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 shadow-2xs hover:border-orange-300 transition-all text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#bc5a13] text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#b25511] block">App Guidelines</span>
                <span className="text-[10px] text-orange-700">Staff training manual</span>
              </div>
            </button>
          )}

          {/* Marketing / Coupons */}
          <button
            onClick={() => onNavigateTab('marketing')}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Offers & Coupons</span>
              <span className="text-[10px] text-[#6b7280]">Discounts & Promo</span>
            </div>
          </button>

          {/* Reviews */}
          <button
            onClick={() => onNavigateTab('reviews')}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">Reviews & Ratings</span>
              <span className="text-[10px] text-[#6b7280]">Reply to foodies</span>
            </div>
          </button>

          {/* Subscription */}
          <button
            onClick={() => onNavigateTab('subscription')}
            className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-orange-200 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#fff1e6] text-[#b25511] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1e1e1e] block">0% Commission</span>
              <span className="text-[10px] text-[#6b7280]">UPI Memberships</span>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-gray-100"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-[#ff7a1a]" />
            <h2 className="text-base font-bold text-[#1e1e1e]">Restaurant Details</h2>
          </div>
          <span className="text-[11px] text-[#6b7280] font-medium">Editable Fields</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
              Restaurant Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
                Contact Email
              </label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
              Store Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Shop No, Building, Road, City, Pincode"
              className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
              Cuisines / Food Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Biryani, North Indian, Chinese, Fast Food"
              className="w-full px-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Security & Account Actions */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 divide-y divide-gray-100">
        <div className="flex items-center justify-between pb-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gray-100 text-[#1e1e1e] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1e1e1e]">Partner Portal Password</p>
              <p className="text-[11px] text-[#6b7280]">Keep your login secure</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1e1e1e] text-xs font-bold transition-colors cursor-pointer"
          >
            Change Password
          </button>
        </div>

        <div className="flex items-center justify-between pt-3.5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-red-50 text-[#dc2626] flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#dc2626]">Sign Out Session</p>
              <p className="text-[11px] text-[#6b7280]">Log out from this device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#dc2626] border border-red-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Official SachBite Partner Verification Badge */}
      <div className="bg-gradient-to-br from-white to-[#fff7ed] rounded-3xl p-6 shadow-xs border border-orange-100 flex flex-col items-center text-center space-y-2">
        <SachBiteLogo
          variant="full"
          size="md"
          showTagline={true}
          showPartnerBadge={true}
        />
        <p className="text-[11px] text-gray-500 max-w-xs pt-1">
          Authorized Restaurant Merchant Account • 24x7 SachBite Partner Helpdesk active
        </p>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};
