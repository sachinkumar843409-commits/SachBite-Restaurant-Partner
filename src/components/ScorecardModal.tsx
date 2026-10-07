import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
} from 'lucide-react';
import { RestaurantProfile } from '../types';

interface ScorecardModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({ isOpen, profile, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Kitchen Health & Scorecard</h3>
                <p className="text-xs text-[#6b7280]">Real-time operational speed & hygiene metrics</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Overall Health Score */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-[#e8f8ee] to-teal-50 border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#15803d]">
                  Overall Merchant Grade
                </span>
                <h4 className="text-2xl font-black text-emerald-950 mt-0.5">Top Tier (96/100)</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Qualifies for <strong>Homepage Priority Spotlight</strong>
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-3xl">
                🏆
              </div>
            </div>

            {/* Metric Bars */}
            <div className="space-y-3">
              {/* Acceptance Rate */}
              <div className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Order Acceptance Rate</span>
                  <span className="text-[#16a34a]">99.2% (Excellent)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#16a34a] h-full w-[99.2%]" />
                </div>
              </div>

              {/* Kitchen Prep Speed */}
              <div className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Average Cooking & Packing Time</span>
                  <span className="text-[#ff7a1a]">13.8 mins (Fast)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#ff7a1a] h-full w-[88%]" />
                </div>
              </div>

              {/* Rider Handover Delay */}
              <div className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Rider Handover Delay</span>
                  <span className="text-[#16a34a]">1.4 mins (On-Time)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#16a34a] h-full w-[94%]" />
                </div>
              </div>

              {/* Customer Food Rating */}
              <div className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-600">Customer Food Quality Rating</span>
                  <span className="text-amber-600">{profile?.rating || 4.6} / 5.0 ★</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[92%]" />
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                Earned Partner Badges
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[#ff7a1a]" />
                  <span className="text-xs font-bold text-[#b25511]">Superfast Kitchen</span>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                  <span className="text-xs font-bold text-[#15803d]">Top Food Hygiene</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#bc5a13] text-white text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
