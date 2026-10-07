import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Store,
  MapPin,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { OutletBranch, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface BranchSwitcherModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onBranchSelected: (branch: OutletBranch) => void;
  onClose: () => void;
}

export const BranchSwitcherModal: React.FC<BranchSwitcherModalProps> = ({
  isOpen,
  profile,
  onBranchSelected,
  onClose,
}) => {
  const [branches, setBranches] = useState<OutletBranch[]>([
    {
      id: 'branch-1',
      name: profile?.name || 'SachBite Main Kitchen',
      area: 'Kankarbagh Main Rd',
      city: 'Patna, Bihar',
      phone: profile?.contactPhone || '+91 98765 43210',
      isOpen: true,
      activeOrdersCount: 4,
      todaySales: 18450,
      isCurrent: true,
    },
    {
      id: 'branch-2',
      name: `${profile?.name?.split(' ')[0] || 'SachBite'} Express`,
      area: 'Boring Road Crossing',
      city: 'Patna, Bihar',
      phone: '+91 98350 11928',
      isOpen: true,
      activeOrdersCount: 7,
      todaySales: 24200,
      isCurrent: false,
    },
    {
      id: 'branch-3',
      name: `${profile?.name?.split(' ')[0] || 'SachBite'} Cloud Hub`,
      area: 'Bailey Road, Saguna More',
      city: 'Patna, Bihar',
      phone: '+91 98350 77312',
      isOpen: false,
      activeOrdersCount: 0,
      todaySales: 9600,
      isCurrent: false,
    },
  ]);

  if (!isOpen) return null;

  const handleSelectBranch = (branch: OutletBranch) => {
    sounds.playSuccessSound();
    setBranches((prev) =>
      prev.map((b) => ({
        ...b,
        isCurrent: b.id === branch.id,
      }))
    );
    onBranchSelected(branch);
    notificationManager.showToast({
      type: 'success',
      title: 'Switched Outlet',
      message: `Now viewing ${branch.name} (${branch.area}).`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Switch Restaurant Outlet</h3>
                <p className="text-xs text-[#6b7280]">Single login for multi-branch franchise owners</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Branch List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {branches.map((b) => (
              <div
                key={b.id}
                onClick={() => handleSelectBranch(b)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  b.isCurrent
                    ? 'bg-[#fff1e6] border-[#ff7a1a] shadow-xs ring-2 ring-[#ff7a1a]/20'
                    : 'bg-[#fafafa] border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-black text-[#1e1e1e]">{b.name}</h4>
                      {b.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#bc5a13] text-white text-[9px] font-black uppercase">
                          Active Now
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-[#6b7280]">
                      <MapPin className="w-3.5 h-3.5 text-[#ff7a1a]" />
                      <span>{b.area}, {b.city}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                      b.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.isOpen ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                {/* Branch Stats Strip */}
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 font-bold text-gray-700">
                    <ShoppingBag className="w-3.5 h-3.5 text-gray-500" />
                    <span>{b.activeOrdersCount} Live Orders</span>
                  </div>
                  <div className="flex items-center space-x-1 font-black text-[#1e1e1e]">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Today: ₹{b.todaySales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Outlet Link */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sounds.playTapSound();
                notificationManager.showToast({
                  type: 'info',
                  title: 'Franchise Request',
                  message: 'To onboard a new branch, contact SachBite Admin.',
                });
              }}
              className="text-xs font-bold text-[#b25511] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Link Another Branch</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
