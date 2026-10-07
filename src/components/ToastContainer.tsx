import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';
import { notificationManager } from '../utils/notifications';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((list) => {
      setToasts(list);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none flex flex-col items-center space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto w-full p-3.5 rounded-2xl shadow-xl flex items-start space-x-3 border backdrop-blur-md ${
                isSuccess
                  ? 'bg-emerald-900/90 text-white border-emerald-500/30 shadow-emerald-950/20'
                  : isError
                  ? 'bg-rose-900/90 text-white border-rose-500/30 shadow-rose-950/20'
                  : 'bg-[#1e1e1e]/90 text-white border-neutral-700/50 shadow-black/30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-300" />}
                {isInfo && <Info className="w-5 h-5 text-[#ff7a1a]" />}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-bold leading-snug">{toast.title}</p>
                {toast.message && (
                  <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => notificationManager.dismissToast(toast.id)}
                className="shrink-0 text-gray-400 hover:text-white p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
