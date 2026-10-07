import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Sparkles,
  Percent,
  Plus,
  Flame,
  CheckCircle,
  Moon,
  Sun,
  Utensils,
} from 'lucide-react';
import { HappyHourRule } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface HappyHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HappyHoursModal: React.FC<HappyHoursModalProps> = ({ isOpen, onClose }) => {
  const [rules, setRules] = useState<HappyHourRule[]>([
    {
      id: 'hh-1',
      title: '🌞 Afternoon Lunch Rush Deal',
      tagline: 'Flat 15% OFF on Thalis & Biryani combos',
      discountPercent: 15,
      startTime: '12:00',
      endTime: '15:30',
      isActive: true,
      daysActive: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    {
      id: 'hh-2',
      title: '🌙 Late Night Biryani Craving (10 PM+)',
      tagline: 'Buy Any Biryani, Get 20% OFF on Tandoori items',
      discountPercent: 20,
      startTime: '22:00',
      endTime: '02:00',
      isActive: true,
      daysActive: ['Fri', 'Sat', 'Sun'],
    },
    {
      id: 'hh-3',
      title: '☕ Evening Chai & Snacks Combo',
      tagline: 'Flat 10% OFF on Pakoras, Rolls & Samosas',
      discountPercent: 10,
      startTime: '16:30',
      endTime: '19:00',
      isActive: false,
      daysActive: ['All Days'],
    },
  ]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    sounds.playTapSound();
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleSave = () => {
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Happy Hours Updated',
      message: 'Time-based automated discount schedules active.',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Happy Hours & Late Night Deals</h3>
                <p className="text-xs text-[#6b7280]">Automated time-based slot discounts & surges</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Rules List */}
          <div className="space-y-3">
            {rules.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-2xl border transition-all ${
                  r.isActive
                    ? 'bg-gradient-to-r from-orange-50/70 to-amber-50/70 border-[#ff7a1a]/40 shadow-2xs'
                    : 'bg-[#fafafa] border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#1e1e1e]">{r.title}</h4>
                    <p className="text-[11px] text-[#6b7280]">{r.tagline}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#bc5a13] font-mono text-[10px] font-black flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.startTime} - {r.endTime}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#bc5a13] text-white text-[10px] font-black">
                        {r.discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={r.isActive}
                    onChange={() => handleToggle(r.id)}
                    className="w-5 h-5 accent-[#ff7a1a] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Auto-applies to menu during time window</span>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Happy Hours
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
