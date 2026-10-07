import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CloudRain,
  CloudLightning,
  Clock,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { RainModeSettings } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface RainModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RainModeModal: React.FC<RainModeModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<RainModeSettings>({
    isRainActive: false,
    extraPrepMinutes: 15,
    restrictedRadiusKm: 4,
    weatherNotice: 'Monsoon Rain / Waterlogging in city. Delivery ETA +15 mins extended.',
  });

  if (!isOpen) return null;

  const handleToggleRain = () => {
    const next = !settings.isRainActive;
    sounds.playSuccessSound();
    setSettings({ ...settings, isRainActive: next });
    notificationManager.showToast({
      type: next ? 'warning' : 'success',
      title: next ? '🌧️ Rain Mode Activated' : '☀️ Rain Mode Deactivated',
      message: next
        ? `Added +${settings.extraPrepMinutes}m prep buffer and informed riders.`
        : 'Standard kitchen timers restored.',
    });
  };

  const handleSave = () => {
    sounds.playSuccessSound();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Rain Mode & Weather Surge</h3>
                <p className="text-xs text-[#6b7280]">Protect kitchen speed from rain & traffic jams</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Rain Switch Card */}
          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
            settings.isRainActive
              ? 'bg-sky-50 border-sky-300 shadow-xs'
              : 'bg-[#fafafa] border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white ${
                settings.isRainActive ? 'bg-sky-600 animate-pulse' : 'bg-gray-400'
              }`}>
                <CloudLightning className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#1e1e1e]">
                  {settings.isRainActive ? '🌧️ Rain Mode ACTIVE' : '☀️ Normal Weather'}
                </h4>
                <p className="text-xs text-gray-600">
                  {settings.isRainActive ? `+${settings.extraPrepMinutes}m buffer added to all orders` : 'Standard timers'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleRain}
              className={`px-4 py-2 rounded-full text-xs font-black shadow-md cursor-pointer transition-all ${
                settings.isRainActive
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
            >
              {settings.isRainActive ? 'Turn OFF' : 'Turn ON'}
            </button>
          </div>

          {/* Buffer configuration */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Extra Prep Time Buffer For Kitchen:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 25].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSettings({ ...settings, extraPrepMinutes: mins })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      settings.extraPrepMinutes === mins
                        ? 'bg-[#bc5a13] text-white border-[#bc5a13]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    +{mins} Mins
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Customer Notice:</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                "{settings.weatherNotice}"
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
