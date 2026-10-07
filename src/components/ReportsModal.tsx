import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  Receipt,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Order, RestaurantProfile } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface ReportsModalProps {
  isOpen: boolean;
  orders: Order[];
  profile: RestaurantProfile | null;
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  orders,
  profile,
  onClose,
}) => {
  const [reportType, setReportType] = useState<'sales_csv' | 'gst_tax' | 'itemwise'>('sales_csv');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    sounds.playSuccessSound();

    setTimeout(() => {
      // Build CSV content
      if (reportType === 'sales_csv') {
        const headers = 'Order ID,Date,Customer Name,Items Count,Payment Method,Status,Grand Total (INR)\n';
        const rows = orders
          .map((o) =>
            `"${o.orderId || o._id}","${new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}","${o.customerName}",${o.items.length},"${o.paymentMethod || 'Prepaid'}","${o.status}",${o.grandTotal}`
          )
          .join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SachBite_Sales_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (reportType === 'gst_tax') {
        const headers = 'Order ID,Date,Food Total (INR),GST Tax 5% (INR),Grand Total (INR)\n';
        const rows = orders
          .map((o) => {
            const food = o.itemTotal || Math.round(o.grandTotal * 0.95);
            const tax = o.taxTotal || o.grandTotal - food;
            return `"${o.orderId || o._id}","${new Date(o.createdAt || o.date || Date.now()).toLocaleDateString()}",${food},${tax},${o.grandTotal}`;
          })
          .join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SachBite_GST_Tax_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const headers = 'Item Name,Units Sold,Revenue (INR)\n';
        const map: Record<string, { count: number; rev: number }> = {};
        orders.forEach((o) => {
          o.items.forEach((it) => {
            if (!map[it.name]) map[it.name] = { count: 0, rev: 0 };
            map[it.name].count += it.quantity;
            map[it.name].rev += it.price * it.quantity;
          });
        });
        const rows = Object.entries(map)
          .map(([name, d]) => `"${name}",${d.count},${d.rev}`)
          .join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `SachBite_Item_Sales_Summary_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsExporting(false);
      notificationManager.showToast({
        type: 'success',
        title: 'Report Downloaded',
        message: 'CSV statement has been saved to your device.',
      });
      onClose();
    }, 600);
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
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Export Reports & Statements</h3>
                <p className="text-xs text-[#6b7280]">Download CSV records for accounting & GST filing</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Report Type Options */}
          <div className="space-y-2.5">
            {[
              {
                id: 'sales_csv' as const,
                title: 'Complete Orders Ledger (CSV)',
                desc: 'Detailed breakdown of all customer orders, IDs & payments',
                icon: FileText,
              },
              {
                id: 'gst_tax' as const,
                title: 'GST / Tax Filing Statement',
                desc: 'Taxable food value, 5% GST calculation & net totals',
                icon: Receipt,
              },
              {
                id: 'itemwise' as const,
                title: 'Dish Popularity & Volume Report',
                desc: 'Units sold per item and total revenue generated per dish',
                icon: FileSpreadsheet,
              },
            ].map((opt) => {
              const isSelected = reportType === opt.id;
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => setReportType(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#fff1e6] border-[#ff7a1a] ring-1 ring-[#ff7a1a]/30'
                      : 'bg-[#fafafa] border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-[#b25511] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1e1e1e]">{opt.title}</h4>
                      <p className="text-[10px] text-[#6b7280]">{opt.desc}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#bc5a13] bg-[#bc5a13] text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer disabled:opacity-70"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating CSV...' : 'Download Statement'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
