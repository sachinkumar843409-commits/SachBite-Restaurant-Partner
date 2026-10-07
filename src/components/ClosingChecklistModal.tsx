import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sparkles,
} from 'lucide-react';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface ClosingChecklistModalProps {
  isOpen: boolean;
  onCompleteClosing: () => void;
  onClose: () => void;
}

export const ClosingChecklistModal: React.FC<ClosingChecklistModalProps> = ({
  isOpen,
  onCompleteClosing,
  onClose,
}) => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Daily cash drawer tallied with SachBite order total', done: false },
    { id: 2, text: 'Main commercial gas burner & tandoor valves securely closed', done: false },
    { id: 3, text: 'Deep freezers sealed & temperature verified (-18°C)', done: false },
    { id: 4, text: 'Raw material inventory updated & tomorrow 86 list checked', done: false },
    { id: 5, text: 'Kitchen exhaust fans, fryers & lights switched off', done: false },
  ]);

  if (!isOpen) return null;

  const toggleTask = (id: number) => {
    sounds.playTapSound();
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const isAllDone = doneCount === tasks.length;

  const handleFinishClosing = () => {
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Store Closed for the Night',
      message: 'Daily closing checklist completed. Outlet marked offline.',
    });
    onCompleteClosing();
    onClose();
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
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Daily Store Closing Checklist</h3>
                <p className="text-xs text-[#6b7280]">Complete mandatory checks before turning offline</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">Checklist Progress:</span>
              <span className={isAllDone ? 'text-[#16a34a]' : 'text-[#bc5a13]'}>
                {doneCount} of {tasks.length} Completed ({Math.round((doneCount / tasks.length) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isAllDone ? 'bg-[#16a34a]' : 'bg-[#ff7a1a]'}`}
                style={{ width: `${(doneCount / tasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center space-x-3 cursor-pointer ${
                  t.done ? 'bg-[#e8f8ee] border-emerald-200 text-emerald-900' : 'bg-[#fafafa] border-gray-200 text-gray-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                  t.done ? 'bg-[#16a34a] border-[#16a34a] text-white' : 'border-gray-300 bg-white'
                }`}>
                  {t.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs font-semibold ${t.done ? 'line-through opacity-80' : ''}`}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleFinishClosing}
              disabled={!isAllDone}
              className="px-5 py-2.5 rounded-full bg-[#1e1e1e] hover:bg-black text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>Complete Handover & Close</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
