import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Send,
  Sparkles,
} from 'lucide-react';
import { DisputeClaim } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface DisputesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisputesModal: React.FC<DisputesModalProps> = ({ isOpen, onClose }) => {
  const [disputes, setDisputes] = useState<DisputeClaim[]>([]);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    api.getDisputes().then(setDisputes);
  }, []);

  if (!isOpen) return null;

  const handleResolve = async (id: string, resolution: DisputeClaim['status']) => {
    sounds.playSuccessSound();
    await api.resolveDispute(id, resolution, resolutionNote);
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: resolution, merchantNotes: resolutionNote } : d))
    );
    setActiveClaimId(null);
    setResolutionNote('');
    notificationManager.showToast({
      type: 'success',
      title: 'Claim Resolved',
      message: 'Resolution submitted to SachBite merchant desk.',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Order Complaints & Lost Sales</h3>
                <p className="text-xs text-[#6b7280]">Review customer refund disputes & spill claims</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-3.5">
            {disputes.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No active customer disputes. Keep up the high quality!</p>
            ) : (
              disputes.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-[#fafafa] border border-gray-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#1e1e1e]">Order #{d.orderId}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {d.issueType}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6b7280]">Customer: {d.customerName}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-rose-600">Claim: ₹{d.claimAmount}</span>
                      <span className="text-[10px] block font-semibold text-gray-500">{d.status}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 italic">
                    "{d.customerComment}"
                  </p>

                  {d.merchantNotes && (
                    <p className="text-xs text-emerald-800 bg-[#e8f8ee] p-2 rounded-xl border border-emerald-200">
                      <strong>Resolution:</strong> {d.merchantNotes}
                    </p>
                  )}

                  {d.status === 'Pending Review' && activeClaimId === d.id ? (
                    <div className="pt-2 space-y-2">
                      <input
                        type="text"
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="Resolution note (e.g. Approved refund credit / Checked CCTV packaging ok)..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setActiveClaimId(null)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleResolve(d.id, 'Contested by Merchant')}
                          className="px-3.5 py-1.5 rounded-full bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 cursor-pointer"
                        >
                          Contest Claim
                        </button>
                        <button
                          onClick={() => handleResolve(d.id, 'Resolved (Merchant Credit)')}
                          className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          Approve Credit (₹{d.claimAmount})
                        </button>
                      </div>
                    </div>
                  ) : d.status === 'Pending Review' ? (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => setActiveClaimId(d.id)}
                        className="px-4 py-1.5 rounded-full bg-[#bc5a13] text-white text-xs font-bold hover:bg-[#e85d04] cursor-pointer"
                      >
                        Take Action
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
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
