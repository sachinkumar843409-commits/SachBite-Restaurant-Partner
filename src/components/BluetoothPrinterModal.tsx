import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Bluetooth,
  Usb,
  Wifi,
  CheckCircle,
  Play,
  Sparkles,
  Settings,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { PrinterSettings } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface BluetoothPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BluetoothPrinterModal: React.FC<BluetoothPrinterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<PrinterSettings>({
    deviceType: 'bluetooth',
    printerName: 'SachBite POS-80 ESC/POS Thermal',
    paperWidth: '80mm',
    autoPrintOnNewOrder: true,
    printCopies: 1,
    isConnected: true,
    cutPaper: true,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [pairedPrinters, setPairedPrinters] = useState<string[]>([
    'SachBite POS-80 (Bluetooth)',
    'Epson TM-T82 (USB Hub)',
    'TVS RP-3200 Star (WiFi LAN)',
  ]);

  if (!isOpen) return null;

  const handleScanBluetooth = () => {
    setIsScanning(true);
    sounds.playTapSound();
    setTimeout(() => {
      setIsScanning(false);
      setPairedPrinters((prev) => [...prev, 'Everycom EC-58 Thermal (Discovered)']);
      notificationManager.showToast({
        type: 'success',
        title: 'Printer Discovered',
        message: 'Bluetooth ESC/POS thermal printer found.',
      });
    }, 1500);
  };

  const handleTestPrint = () => {
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Test KOT Sent',
      message: `Thermal print command sent to ${settings.printerName} (${settings.paperWidth}).`,
    });
    window.print();
  };

  const handleSave = () => {
    sounds.playSuccessSound();
    notificationManager.showToast({
      type: 'success',
      title: 'Printer Settings Saved',
      message: settings.autoPrintOnNewOrder
        ? 'Auto-print on incoming orders enabled.'
        : 'Printer settings updated.',
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
          className="bg-white rounded-3xl w-full max-w-md p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">Bluetooth & USB Printer</h3>
                <p className="text-xs text-[#6b7280]">Direct KOT auto-printing for kitchen counter</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Connection Status Card */}
          <div className="p-4 bg-[#fafafa] rounded-2xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Bluetooth className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-black text-[#1e1e1e]">{settings.printerName}</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-700 font-bold">Connected • Ready to Print</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleScanBluetooth}
              disabled={isScanning}
              className="p-2 rounded-xl bg-white border border-gray-200 text-[#bc5a13] hover:bg-orange-50 cursor-pointer"
              title="Pair New Bluetooth Device"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin text-[#ff7a1a]' : ''}`} />
            </button>
          </div>

          {/* Auto Print on New Order Toggle */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-[#1e1e1e]">⚡ Auto-Print On Order Arrival</h4>
              <p className="text-[10px] text-gray-600">Prints kitchen KOT ticket immediately when order lands</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoPrintOnNewOrder}
              onChange={(e) => setSettings({ ...settings, autoPrintOnNewOrder: e.target.checked })}
              className="w-5 h-5 accent-[#ff7a1a] cursor-pointer"
            />
          </div>

          {/* Configuration Settings */}
          <div className="space-y-3 pt-1">
            {/* Paper Size */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Thermal Paper Roll Width:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['58mm', '80mm'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSettings({ ...settings, paperWidth: w })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      settings.paperWidth === w
                        ? 'bg-[#bc5a13] text-white border-[#bc5a13] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {w} ({w === '80mm' ? 'Standard 3-inch' : 'Compact 2-inch'})
                  </button>
                ))}
              </div>
            </div>

            {/* Copies */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-700">Copies Per Order:</span>
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSettings({ ...settings, printCopies: num })}
                    className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer ${
                      settings.printCopies === num
                        ? 'bg-[#bc5a13] text-white'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test & Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleTestPrint}
              className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Test Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Printer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
