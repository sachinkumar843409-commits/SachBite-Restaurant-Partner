import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileCheck,
  ShieldCheck,
  Building,
  Award,
  Save,
} from 'lucide-react';
import { RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';

interface ComplianceVaultModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onProfileUpdated: (p: RestaurantProfile) => void;
  onClose: () => void;
}

export const ComplianceVaultModal: React.FC<ComplianceVaultModalProps> = ({
  isOpen,
  profile,
  onProfileUpdated,
  onClose,
}) => {
  const [fssai, setFssai] = useState(profile?.fssaiNumber || '10423000001928');
  const [gstin, setGstin] = useState(profile?.gstin || '10AAACT1234F1Z8');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await api.updateProfile({
        fssaiNumber: fssai.trim(),
        gstin: gstin.trim().toUpperCase(),
      });

      if (res.profile) {
        onProfileUpdated(res.profile);
      }
      notificationManager.showToast({
        type: 'success',
        title: 'Documents Updated',
        message: 'FSSAI License and GSTIN numbers updated in registry.',
      });
      onClose();
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not update regulatory details.',
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
              <div className="w-9 h-9 rounded-2xl bg-[#e8f8ee] text-[#16a34a] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">FSSAI & Regulatory Vault</h3>
                <p className="text-xs text-[#6b7280]">Mandatory food safety and GST credentials</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* FSSAI */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#1e1e1e] uppercase tracking-wider">
                  FSSAI 14-Digit License Number
                </label>
                <span className="text-[10px] font-bold text-[#16a34a] bg-[#e8f8ee] px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={14}
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                placeholder="10423000001928"
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
              <p className="text-[10px] text-[#6b7280] mt-1">
                Display badge printed on customer food bills as per Govt. norms.
              </p>
            </div>

            {/* GSTIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#1e1e1e] uppercase tracking-wider">
                  GSTIN Registration Number
                </label>
                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <input
                type="text"
                maxLength={15}
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="10AAACT1234F1Z8"
                className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 text-xs text-[#6b7280] space-y-1">
              <span className="font-bold text-[#1e1e1e] block">Trade Verification:</span>
              <p>Registered Entity: <strong>{profile?.name}</strong></p>
              <p>Audit Status: <strong>100% Compliant Partner</strong></p>
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
                {isSaving ? 'Saving...' : 'Update License'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
