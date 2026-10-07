import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Layers,
  Search,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { MenuItem } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface BulkStockModalProps {
  isOpen: boolean;
  items: MenuItem[];
  onItemUpdated: (item: MenuItem) => void;
  onClose: () => void;
}

export const BulkStockModal: React.FC<BulkStockModalProps> = ({
  isOpen,
  items,
  onItemUpdated,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'General')))];

  const filteredItems = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggle = async (item: MenuItem) => {
    sounds.playTapSound();
    const next = !item.available;
    const updated = { ...item, available: next };
    onItemUpdated(updated);

    try {
      await api.updateMenuItem(item._id || item.id || '', { available: next });
    } catch {
      onItemUpdated(item);
    }
  };

  const handleTurnAllOn = async () => {
    sounds.playSuccessSound();
    for (const it of items) {
      if (!it.available) {
        onItemUpdated({ ...it, available: true });
        api.updateMenuItem(it._id || it.id || '', { available: true }).catch(() => {});
      }
    }
    notificationManager.showToast({
      type: 'success',
      title: 'All Items Active',
      message: 'All dishes marked in-stock for customer orders.',
    });
  };

  const availableCount = items.filter((i) => i.available !== false).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Quick Bulk Inventory & 86 Switch</h3>
                <p className="text-xs text-[#6b7280]">
                  {availableCount} of {items.length} dishes in stock
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleTurnAllOn}
                className="px-3 py-1.5 rounded-full bg-[#e8f8ee] text-[#15803d] border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Turn All In-Stock</span>
              </button>
              <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="p-4 bg-gray-50 border-b border-gray-200/80 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute inset-y-0 left-3 my-auto" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dish to toggle..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#ff7a1a]"
              />
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    activeCategory === cat ? 'bg-[#bc5a13] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Switchboard Grid */}
          <div className="p-4 overflow-y-auto flex-1 divide-y divide-gray-100">
            {filteredItems.map((it) => {
              const isAvailable = it.available !== false;
              return (
                <div key={it._id || it.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xl shrink-0">{it.icon || '🍲'}</span>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold block truncate ${isAvailable ? 'text-[#1e1e1e]' : 'text-gray-400 line-through'}`}>
                        {it.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {it.category} • ₹{it.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(it)}
                    className="cursor-pointer focus:outline-none shrink-0"
                    title={isAvailable ? 'Mark Out of Stock' : 'Mark Available'}
                  >
                    {isAvailable ? (
                      <ToggleRight className="w-8 h-8 text-[#16a34a]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#bc5a13] text-white text-xs font-bold hover:bg-[#e85d04] shadow-sm cursor-pointer"
            >
              Done Managing Stock
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
