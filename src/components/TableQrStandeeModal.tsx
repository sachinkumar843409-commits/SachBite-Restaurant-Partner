import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  QrCode,
  Sparkles,
  Download,
} from 'lucide-react';
import { RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { SachBiteLogo } from './SachBiteLogo';

interface TableQrStandeeModalProps {
  isOpen: boolean;
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const TableQrStandeeModal: React.FC<TableQrStandeeModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  if (!isOpen) return null;

  const restaurantName = profile?.name || 'Tandoori Tales & Biryani Hub';
  const qrUrl = `https://sachbite.in/order?restaurant=${encodeURIComponent(restaurantName)}`;

  const handlePrint = () => {
    window.print();
    notificationManager.showToast({
      type: 'success',
      title: 'Standee Ready',
      message: 'Print standee sent to printer.',
    });
  };

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
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-[#ff7a1a]" />
              <h3 className="text-base font-bold text-[#1e1e1e]">Dine-In / Counter QR Standee</h3>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Standee Preview for Printing */}
          <div className="p-6 overflow-y-auto flex flex-col items-center justify-center bg-gradient-to-b from-[#fff1e6]/40 to-white">
            <div className="w-full max-w-xs p-6 bg-white rounded-3xl border-4 border-[#ff7a1a] shadow-xl text-center space-y-4">
              {/* Official Brand Logo */}
              <div className="flex flex-col items-center">
                <SachBiteLogo
                  variant="full"
                  size="md"
                  showTagline={true}
                  showPartnerBadge={false}
                />
                <p className="text-[10px] font-bold text-[#b25511] uppercase tracking-widest mt-2">
                  Scan & Order Directly
                </p>
              </div>

              {/* Restaurant Name */}
              <div className="py-2 border-y border-dashed border-gray-200">
                <h4 className="text-base font-black text-[#1e1e1e] line-clamp-2">
                  {restaurantName}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {profile?.tags || 'Delicious food served hot & fresh'}
                </p>
              </div>

              {/* QR Code */}
              <div className="p-3 bg-white rounded-2xl border-2 border-gray-100 inline-block shadow-xs">
                <QRCodeSVG value={qrUrl} size={150} level="H" includeMargin={false} fgColor="#1e1e1e" />
              </div>

              {/* Instruction */}
              <div className="space-y-1">
                <span className="text-xs font-black text-[#bc5a13] block">
                  Scan with Camera or Google Pay / Paytm
                </span>
                <p className="text-[10px] text-gray-500">
                  Instant digital menu • 0% hassle • Contactless ordering
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-white bg-[#bc5a13] hover:bg-[#e85d04] rounded-full flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print A5 Standee</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
