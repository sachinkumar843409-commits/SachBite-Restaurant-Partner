import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  Bell,
  Play,
  Check,
  Radio,
  Sliders,
  Sparkles,
  Mic,
} from 'lucide-react';
import { RingtoneType, VoiceAnnouncementLang, sounds } from '../utils/sound';
import { notificationManager } from '../utils/notifications';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({ isOpen, onClose }) => {
  const [selectedTone, setSelectedTone] = useState<RingtoneType>(sounds.selectedRingtone);
  const [volume, setVolume] = useState<number>(sounds.volume);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(sounds.voiceEnabled);
  const [voiceLang, setVoiceLang] = useState<VoiceAnnouncementLang>(sounds.voiceLang);

  if (!isOpen) return null;

  const ringtones: Array<{ id: RingtoneType; name: string; desc: string; icon: string }> = [
    { id: 'chime', name: 'SachBite Classic Chime', desc: 'Pleasant harmonious double bell', icon: '🔔' },
    { id: 'loud_urgent', name: 'Loud Kitchen Alert (High dB)', desc: 'Sharp attention buzzer for busy tandoor/fryer line', icon: '📢' },
    { id: 'scooter_horn', name: 'Delivery Scooter Horn', desc: 'Friendly delivery horn beep-beep', icon: '🛵' },
    { id: 'marimba', name: 'Mellow Marimba Notes', desc: 'Soft acoustic musical sequence', icon: '🎵' },
  ];

  const handleTestTone = (tone: RingtoneType) => {
    sounds.playNewOrderSound(tone);
  };

  const handleTestVoice = () => {
    sounds.voiceLang = voiceLang;
    sounds.voiceEnabled = true;
    sounds.announceOrderSpeech(
      '#SB-TEST',
      '2 Chicken Biryani aur 1 Cold Drink',
      480
    );
  };

  const handleSave = () => {
    sounds.selectedRingtone = selectedTone;
    sounds.volume = volume;
    sounds.voiceEnabled = voiceEnabled;
    sounds.voiceLang = voiceLang;
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Sound & Voice Settings Saved',
      message: 'Incoming order alert ringtone & voice announcer updated.',
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
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Sound & Voice Alerts</h3>
                <p className="text-xs text-[#6b7280]">Customize siren bell & kitchen voice announcer</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Announcement Section */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#bc5a13] text-white flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1e1e1e]">Voice Order Announcer</h4>
                  <p className="text-[10px] text-gray-600">Speaks out dishes loudly when order arrives</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#ff7a1a] cursor-pointer"
              />
            </div>

            {voiceEnabled && (
              <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1">
                  {(['hinglish', 'hi', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setVoiceLang(lang)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold capitalize cursor-pointer ${
                        voiceLang === lang
                          ? 'bg-[#bc5a13] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang === 'hi' ? 'हिन्दी' : lang === 'hinglish' ? 'Hinglish' : 'English'}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="px-2.5 py-1 bg-white border border-orange-300 text-[#b25511] font-bold text-[10px] rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer hover:bg-orange-100"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Test Voice</span>
                </button>
              </div>
            )}
          </div>

          {/* Ringtone Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Siren & Alarm Bell Tone:</label>
            {ringtones.map((r) => {
              const isSelected = selectedTone === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedTone(r.id)}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#fff1e6] border-[#ff7a1a] shadow-xs'
                      : 'bg-[#fafafa] border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xl">{r.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1e1e1e]">{r.name}</h4>
                      <p className="text-[10px] text-[#6b7280]">{r.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestTone(r.id);
                      }}
                      className="p-1 rounded-lg bg-white border border-gray-200 text-[#b25511] hover:bg-orange-50 shadow-2xs cursor-pointer text-[10px] font-bold flex items-center gap-0.5"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Test</span>
                    </button>

                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#bc5a13] bg-[#bc5a13] text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volume Slider */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1e1e1e]">
              <span>Alert Loudness & Siren Gain</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                sounds.volume = v;
              }}
              className="w-full accent-[#ff7a1a]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Alert Preference
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
