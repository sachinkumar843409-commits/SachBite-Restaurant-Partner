import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Camera,
  ShieldCheck,
  CheckCircle,
  Upload,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Order } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface PackingPhotoProofModalProps {
  isOpen: boolean;
  order: Order | null;
  onPhotoSaved: (orderId: string, photoUrl: string) => void;
  onClose: () => void;
}

export const PackingPhotoProofModal: React.FC<PackingPhotoProofModalProps> = ({
  isOpen,
  order,
  onPhotoSaved,
  onClose,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(order?.packingProofImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !order) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        sounds.playSuccessSound();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateQuickPhoto = () => {
    sounds.playTapSound();
    // Default placeholder photo proof of packed food container
    setCapturedImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop');
  };

  const handleSaveProof = () => {
    if (!capturedImage) {
      notificationManager.showToast({
        type: 'warning',
        title: 'No Photo Added',
        message: 'Please snap or upload a packing bag photo first.',
      });
      return;
    }

    sounds.playSuccessSound();
    onPhotoSaved(order._id || order.id || '', capturedImage);
    notificationManager.showToast({
      type: 'success',
      title: 'Packing Proof Saved',
      message: `Safety proof attached to #${order.orderId || 'order'} for dispute protection.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Food Packing Photo Proof</h3>
                <p className="text-xs text-[#6b7280]">
                  Order #{order.orderId || order._id?.slice(-5)} Protection
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Protection Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center space-x-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Snapping a photo of the sealed bag before rider handover 100% protects your payout from customer fake "missing item" or "spilled" dispute claims.
            </p>
          </div>

          {/* Camera Viewport / Photo Preview */}
          <div className="relative h-56 bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-700 flex flex-col items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Packed Order Proof" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4 space-y-2 text-gray-400">
                <Camera className="w-12 h-12 mx-auto text-gray-500 stroke-1" />
                <p className="text-xs font-medium text-gray-300">Snap picture of sealed box & bill tape</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateQuickPhoto}
                    className="px-3 py-1.5 rounded-xl bg-[#bc5a13] text-white text-xs font-bold cursor-pointer hover:bg-[#e85d04]"
                  >
                    Sample Photo
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            {capturedImage && (
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Retake
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveProof}
              className="flex-1 py-3 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>LOCK & ATTACH PROOF</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
