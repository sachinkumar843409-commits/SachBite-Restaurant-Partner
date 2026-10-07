import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FolderPlus,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: string[];
  onUpdateCategories: (cats: string[]) => void;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  categories,
  onUpdateCategories,
  onClose,
}) => {
  const [catsList, setCatsList] = useState<string[]>(categories.filter((c) => c !== 'All'));
  const [newCatName, setNewCatName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed || catsList.includes(trimmed)) return;

    sounds.playSuccessSound();
    const updated = [...catsList, trimmed];
    setCatsList(updated);
    onUpdateCategories(['All', ...updated]);
    setNewCatName('');
    notificationManager.showToast({
      type: 'success',
      title: 'Category Added',
      message: `"${trimmed}" is now available in your menu categories.`,
    });
  };

  const handleDelete = (cat: string) => {
    sounds.playTapSound();
    const updated = catsList.filter((c) => c !== cat);
    setCatsList(updated);
    onUpdateCategories(['All', ...updated]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= catsList.length) return;

    const copy = [...catsList];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setCatsList(copy);
    onUpdateCategories(['All', ...copy]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Menu Category Manager</h3>
                <p className="text-xs text-[#6b7280]">Add new categories & reorder display order</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="p-4 bg-[#fafafa] border-b border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Ramadan Specials or Rolls & Wraps"
              className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#ff7a1a]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#bc5a13] text-white text-xs font-bold hover:bg-[#e85d04] flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Category List */}
          <div className="p-4 overflow-y-auto space-y-2 flex-1">
            {catsList.map((cat, idx) => (
              <div
                key={cat}
                className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between shadow-2xs"
              >
                <span className="text-xs font-bold text-[#1e1e1e]">{cat}</span>

                <div className="flex items-center space-x-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === catsList.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#bc5a13] text-white text-xs font-bold cursor-pointer"
            >
              Done Managing Categories
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
