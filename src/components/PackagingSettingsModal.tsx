import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  Save,
  ShieldCheck,
  Bike,
} from 'lucide-react';
import { PackagingSettings, RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';

interface PackagingSettingsModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onProfileUpdated: (p: RestaurantProfile) => void;
  onClose: () => void;
}

export const PackagingSettingsModal: React.FC<PackagingSettingsModalProps> = ({
  isOpen,
  profile,
  onProfileUpdated,
  onClose,
}) => {
  const [fee, setFee] = useState(profile?.packagingSettings?.fixedFee || 20);
  const [minOrder, setMinOrder] = useState(profile?.packagingSettings?.minOrderValue || 149);
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(profile?.packagingSettings?.freeDeliveryAbove || 499);
  const [instructions, setInstructions] = useState(profile?.packagingSettings?.instructionsForRider || 'Handle with care. Hot biryani handi sealed.');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPackaging: PackagingSettings = {
      chargeType: 'fixed_per_order',
      fixedFee: Number(fee),
      minOrderValue: Number(minOrder),
      freeDeliveryAbove: Number(freeDeliveryAbove),
      instructionsForRider: instructions.trim(),
    };

    try {
      const res = await api.updateProfile({ packagingSettings: updatedPackaging });
      if (res.profile) {
        onProfileUpdated(res.profile);
      }
      notificationManager.showToast({
        type: 'success',
        title: 'Packaging Settings Saved',
        message: 'Order packaging fee and rider instructions updated.',
      });
      onClose();
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update packaging settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Packaging & Basket Rules</h3>
                <p className="text-xs text-[#6b7280]">Container charges & minimum order basket</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  Packaging Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  placeholder="20"
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                  Min Order Basket (₹)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  placeholder="149"
                  className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                Free Delivery Offer Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={freeDeliveryAbove}
                onChange={(e) => setFreeDeliveryAbove(Number(e.target.value))}
                placeholder="499"
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                Default Instructions for Delivery Rider
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Keep handi upright, do not tilt parcel..."
                className="w-full px-3.5 py-2 bg-[#fafafa] border border-gray-200 rounded-xl text-xs text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
