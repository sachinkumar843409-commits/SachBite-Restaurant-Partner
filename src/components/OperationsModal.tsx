import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Store,
  Clock,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { OperatingHours, RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface OperationsModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onProfileUpdated: (p: RestaurantProfile) => void;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const OperationsModal: React.FC<OperationsModalProps> = ({
  isOpen,
  profile,
  onProfileUpdated,
  onClose,
}) => {
  const [isOpenStore, setIsOpenStore] = useState(profile?.isOpen !== false);
  const [autoAccept, setAutoAccept] = useState(profile?.autoAcceptOrders || false);
  const [rushBuffer, setRushBuffer] = useState(profile?.rushModeBuffer || 0);
  const [activeSubTab, setActiveSubTab] = useState<'quick' | 'weekly'>('quick');

  // Weekly Schedule State
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, OperatingHours>>(
    profile?.weeklySchedule || {
      Monday: { open: '10:30', close: '23:30', isClosedOnDay: false },
      Tuesday: { open: '10:30', close: '23:30', isClosedOnDay: false },
      Wednesday: { open: '10:30', close: '23:30', isClosedOnDay: false },
      Thursday: { open: '10:30', close: '23:30', isClosedOnDay: false },
      Friday: { open: '10:30', close: '00:00', isClosedOnDay: false },
      Saturday: { open: '10:00', close: '00:30', isClosedOnDay: false },
      Sunday: { open: '10:00', close: '00:30', isClosedOnDay: false },
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleDayChange = (day: string, field: keyof OperatingHours, val: string | boolean) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: val,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    sounds.playTapSound();

    try {
      const res = await api.updateProfile({
        isOpen: isOpenStore,
        autoAcceptOrders: autoAccept,
        rushModeBuffer: rushBuffer,
        weeklySchedule,
      });

      if (res.profile) {
        onProfileUpdated(res.profile);
      }
      notificationManager.showToast({
        type: 'success',
        title: 'Operations & Timings Saved',
        message: `Store is ${isOpenStore ? 'ONLINE' : 'OFFLINE'} with updated 7-day schedule.`,
      });
      onClose();
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not sync operational settings.',
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
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Outlet Timings & Controls</h3>
                <p className="text-xs text-[#6b7280]">Store visibility, 7-day hours & auto-accept</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-tab switcher */}
          <div className="px-5 pt-3 flex items-center space-x-2 border-b border-gray-100 pb-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('quick')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'quick' ? 'bg-[#bc5a13] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Quick Controls
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('weekly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'weekly' ? 'bg-[#bc5a13] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7-Day Weekly Hours
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
            {activeSubTab === 'quick' ? (
              <>
                {/* Store Status Toggle */}
                <div className="p-4 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1e1e1e] block">
                      Store Live Status
                    </span>
                    <p className="text-[11px] text-[#6b7280]">
                      {isOpenStore ? 'Accepting customer orders now' : 'Store marked closed on customer app'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpenStore(!isOpenStore)}
                    className="cursor-pointer focus:outline-none"
                  >
                    {isOpenStore ? (
                      <ToggleRight className="w-9 h-9 text-[#16a34a]" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Auto Accept Orders */}
                <div className="p-4 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1e1e1e] block">
                      Auto-Accept Incoming Orders
                    </span>
                    <p className="text-[11px] text-[#6b7280]">
                      Instantly send orders directly to KDS without manual tap
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoAccept(!autoAccept)}
                    className="cursor-pointer focus:outline-none"
                  >
                    {autoAccept ? (
                      <ToggleRight className="w-9 h-9 text-[#16a34a]" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Rush Mode Extra Buffer */}
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Rush Mode / Kitchen Buffer
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Normal (+0m)', val: 0 },
                      { label: 'Busy (+15m)', val: 15 },
                      { label: 'Peak (+30m)', val: 30 },
                    ].map((b) => (
                      <button
                        key={b.val}
                        type="button"
                        onClick={() => setRushBuffer(b.val)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          rushBuffer === b.val
                            ? 'bg-[#fff1e6] border-[#ff7a1a] text-[#b25511]'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Weekly Schedule View */
              <div className="space-y-2.5">
                {DAYS_OF_WEEK.map((day) => {
                  const sched = weeklySchedule[day] || { open: '10:30', close: '23:30', isClosedOnDay: false };
                  return (
                    <div
                      key={day}
                      className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-[#1e1e1e] w-24 shrink-0">
                        {day}
                      </span>

                      {!sched.isClosedOnDay ? (
                        <div className="flex items-center space-x-1.5 flex-1 justify-center">
                          <input
                            type="time"
                            value={sched.open}
                            onChange={(e) => handleDayChange(day, 'open', e.target.value)}
                            className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                          />
                          <span className="text-xs text-gray-400">to</span>
                          <input
                            type="time"
                            value={sched.close}
                            onChange={(e) => handleDayChange(day, 'close', e.target.value)}
                            className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex-1 text-center">
                          ● Closed on {day}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDayChange(day, 'isClosedOnDay', !sched.isClosedOnDay)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          sched.isClosedOnDay ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {sched.isClosedOnDay ? 'Open Day' : 'Day Off'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Apply Controls'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
