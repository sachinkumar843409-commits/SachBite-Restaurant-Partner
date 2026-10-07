import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  Truck,
  Sparkles,
  Utensils,
  ArrowUpRight,
} from 'lucide-react';
import { RawIngredient } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface RawInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RawInventoryModal: React.FC<RawInventoryModalProps> = ({ isOpen, onClose }) => {
  const [ingredients, setIngredients] = useState<RawIngredient[]>([
    {
      id: 'ing-1',
      name: 'Fresh Malai Paneer',
      category: 'Dairy',
      currentStock: 1.8,
      unit: 'kg',
      minThreshold: 3.0,
      costPerUnit: 340,
      linkedDishesCount: 6,
      lastRestocked: 'Yesterday, 4:00 PM',
      supplierName: 'Sudha Dairy Patna',
    },
    {
      id: 'ing-2',
      name: 'Mozzarella Pizza Cheese',
      category: 'Dairy',
      currentStock: 4.5,
      unit: 'kg',
      minThreshold: 2.0,
      costPerUnit: 480,
      linkedDishesCount: 4,
      lastRestocked: '2 days ago',
      supplierName: 'Amul Wholesale',
    },
    {
      id: 'ing-3',
      name: 'Fresh Chicken Breast / Curry Cut',
      category: 'Meat & Poultry',
      currentStock: 2.2,
      unit: 'kg',
      minThreshold: 5.0,
      costPerUnit: 220,
      linkedDishesCount: 8,
      lastRestocked: 'Today, 8:00 AM',
      supplierName: 'Quality Poultry Farms',
    },
    {
      id: 'ing-4',
      name: 'Aromatic Basmati Rice',
      category: 'Grains & Flour',
      currentStock: 18.0,
      unit: 'kg',
      minThreshold: 10.0,
      costPerUnit: 110,
      linkedDishesCount: 5,
      lastRestocked: '3 days ago',
      supplierName: 'India Gate Traders',
    },
    {
      id: 'ing-5',
      name: 'Meal Packaging Boxes (750ml)',
      category: 'Packaging',
      currentStock: 45,
      unit: 'units',
      minThreshold: 100,
      costPerUnit: 6,
      linkedDishesCount: 14,
      lastRestocked: '5 days ago',
      supplierName: 'EcoPack India',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newUnit, setNewUnit] = useState<RawIngredient['unit']>('kg');
  const [newMin, setNewMin] = useState('');

  if (!isOpen) return null;

  const lowStockCount = ingredients.filter((i) => i.currentStock <= i.minThreshold).length;

  const filtered = ingredients.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || i.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleRestock = (id: string, amount: number) => {
    sounds.playSuccessSound();
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, currentStock: Math.round((i.currentStock + amount) * 10) / 10 } : i
      )
    );
    notificationManager.showToast({
      type: 'success',
      title: 'Stock Updated',
      message: `Restocked ${amount} units.`,
    });
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newStock) return;

    sounds.playSuccessSound();
    const item: RawIngredient = {
      id: `ing-${Date.now()}`,
      name: newName,
      category: 'Dairy',
      currentStock: parseFloat(newStock) || 1,
      unit: newUnit,
      minThreshold: parseFloat(newMin) || 2,
      costPerUnit: 100,
      linkedDishesCount: 1,
      lastRestocked: 'Just now',
    };

    setIngredients([item, ...ingredients]);
    setNewName('');
    setNewStock('');
    setNewMin('');
    setIsAddingNew(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1e1e1e] to-neutral-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-300 block">
                  KITCHEN RAW INVENTORY
                </span>
                <h3 className="text-base font-black">Ingredient Stock & Depletion Warnings</h3>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Low Stock Urgent Warning Banner */}
            {lowStockCount > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-rose-900">
                      {lowStockCount} Raw Ingredients Below Safe Buffer!
                    </h4>
                    <p className="text-[11px] text-rose-700">
                      Restock soon to avoid kitchen delays & order rejections.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search raw items (Paneer, Rice)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ingredient</span>
              </button>
            </div>

            {/* Add Ingredient Form */}
            {isAddingNew && (
              <form onSubmit={handleAddNew} className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-3">
                <h4 className="text-xs font-black text-[#b25511] uppercase">Track New Raw Item</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Item Name (e.g. Butter)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold"
                    required
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Current Qty"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold"
                    required
                  />
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as RawIngredient['unit'])}
                    className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="units">units</option>
                    <option value="packets">packets</option>
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Min Alert Qty"
                    value={newMin}
                    onChange={(e) => setNewMin(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#bc5a13] text-white text-xs font-bold shadow-xs"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            )}

            {/* Ingredients Table */}
            <div className="space-y-2.5">
              {filtered.map((ing) => {
                const isLow = ing.currentStock <= ing.minThreshold;
                return (
                  <div
                    key={ing.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLow
                        ? 'bg-rose-50/60 border-rose-200 shadow-2xs'
                        : 'bg-[#fafafa] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black text-[#1e1e1e]">{ing.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold">
                          {ing.category}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black animate-pulse">
                            LOW STOCK
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#6b7280]">
                        Linked to {ing.linkedDishesCount} dishes • Supplier: {ing.supplierName || 'Local Mandi'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-[#1e1e1e]'}`}>
                          {ing.currentStock} {ing.unit}
                        </span>
                        <span className="text-[10px] text-gray-400 block">Min: {ing.minThreshold} {ing.unit}</span>
                      </div>

                      {/* Quick Restock Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleRestock(ing.id, 1)}
                          className="px-2 py-1 bg-white border border-gray-200 hover:bg-orange-50 text-[#bc5a13] font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                          title="Add 1 unit"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRestock(ing.id, 5)}
                          className="px-2 py-1 bg-white border border-gray-200 hover:bg-orange-50 text-[#bc5a13] font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Total {ingredients.length} ingredients tracked
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
