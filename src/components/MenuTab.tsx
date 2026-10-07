import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  UtensilsCrossed,
  Edit2,
  Trash2,
  Camera,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
  Flame,
  Star,
  Clock,
  FolderPlus,
} from 'lucide-react';
import { MenuItem, MenuVariant, MenuAddOn } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';
import { CategoryManagerModal } from './CategoryManagerModal';

interface MenuTabProps {
  items: MenuItem[];
  onItemAdded: (item: MenuItem) => void;
  onItemUpdated: (item: MenuItem) => void;
  onItemDeleted: (itemId: string) => void;
  onOpenAiMenuWriter?: (item: MenuItem) => void;
  isLoading?: boolean;
}

const DEFAULT_CATEGORIES = [
  'All',
  'Biryani',
  'Main Course',
  'Starters',
  'Breads',
  'Beverages',
  'Desserts',
  'Fast Food',
  'Combos',
];

const EMOJI_ICONS = ['🍗', '🧀', '🫓', '🍢', '🥢', '🍯', '🥛', '🍕', '🍔', '🥗', '🍲', '🍚', '🥪', '☕'];

export const MenuTab: React.FC<MenuTabProps> = ({
  items,
  onItemAdded,
  onItemUpdated,
  onItemDeleted,
  onOpenAiMenuWriter,
  isLoading,
}) => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<number | string>('');
  const [originalPrice, setOriginalPrice] = useState<number | string>('');
  const [itemCategory, setItemCategory] = useState('Main Course');
  const [itemIcon, setItemIcon] = useState('🍲');
  const [itemImage, setItemImage] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemIsVeg, setItemIsVeg] = useState(true);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(15);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<MenuItem['spiceLevel']>('Medium');
  const [stockQuantity, setStockQuantity] = useState<number | string>('');

  // Variants
  const [variants, setVariants] = useState<MenuVariant[]>([]);
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState<number | string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setItemName('');
    setItemPrice('');
    setOriginalPrice('');
    setItemCategory('Main Course');
    setItemIcon('🍲');
    setItemImage('');
    setItemDescription('');
    setItemIsVeg(true);
    setPrepTimeMinutes(15);
    setIsBestSeller(false);
    setIsRecommended(false);
    setSpiceLevel('Medium');
    setStockQuantity('');
    setVariants([]);
    setVariantName('');
    setVariantPrice('');
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setOriginalPrice(item.originalPrice || '');
    setItemCategory(item.category || 'Main Course');
    setItemIcon(item.icon || '🍲');
    setItemImage(item.image || '');
    setItemDescription(item.description || '');
    setItemIsVeg(item.isVeg !== undefined ? item.isVeg : true);
    setPrepTimeMinutes(item.prepTimeMinutes || 15);
    setIsBestSeller(item.isBestSeller || false);
    setIsRecommended(item.isRecommended || false);
    setSpiceLevel(item.spiceLevel || 'Medium');
    setStockQuantity(item.stockQuantity !== undefined ? item.stockQuantity : '');
    setVariants(item.variants || []);
    setIsAddModalOpen(true);
  };

  const handleAddVariant = () => {
    const p = Number(variantPrice);
    if (!variantName.trim() || isNaN(p) || p <= 0) return;
    setVariants([...variants, { name: variantName.trim(), price: p }]);
    setVariantName('');
    setVariantPrice('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      if (res.url) {
        setItemImage(res.url);
        notificationManager.showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Item image has been uploaded.',
        });
      }
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Upload Failed',
        message: 'Could not upload item photo.',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(itemPrice);
    if (!itemName.trim() || isNaN(priceNum) || priceNum <= 0) {
      notificationManager.showToast({
        type: 'error',
        title: 'Invalid Fields',
        message: 'Please enter a valid item name and positive price.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: itemName.trim(),
        price: priceNum,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category: itemCategory,
        icon: itemIcon,
        image: itemImage,
        description: itemDescription,
        isVeg: itemIsVeg,
        foodType: itemIsVeg ? ('veg' as const) : ('non-veg' as const),
        prepTimeMinutes: Number(prepTimeMinutes) || 15,
        isBestSeller,
        isRecommended,
        spiceLevel,
        stockQuantity: stockQuantity !== '' ? Number(stockQuantity) : undefined,
        variants: variants.length > 0 ? variants : undefined,
      };

      if (editingItem) {
        const itemId = editingItem._id || editingItem.id || '';
        const res = await api.updateMenuItem(itemId, payload);

        if (res.success && res.item) {
          onItemUpdated(res.item);
          notificationManager.showToast({
            type: 'success',
            title: 'Item Updated',
            message: `${itemName} updated in your catalog.`,
          });
          setIsAddModalOpen(false);
          resetForm();
        }
      } else {
        const res = await api.addMenuItem({
          ...payload,
          available: true,
        });

        if (res.success && res.item) {
          onItemAdded(res.item);
          notificationManager.showToast({
            type: 'success',
            title: 'Item Created',
            message: `${itemName} is now listed in your menu.`,
          });
          setIsAddModalOpen(false);
          resetForm();
        }
      }
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to communicate with SachBite backend.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    const itemId = item._id || item.id || '';
    const nextState = !item.available;
    sounds.playTapSound();

    const updated = { ...item, available: nextState };
    onItemUpdated(updated);

    try {
      await api.updateMenuItem(itemId, { available: nextState });
      notificationManager.showToast({
        type: nextState ? 'success' : 'info',
        title: nextState ? 'Item Available' : 'Item 86’d (Sold Out)',
        message: `${item.name} marked as ${nextState ? 'in stock' : 'sold out for today'}.`,
      });
    } catch {
      onItemUpdated(item);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItemId) return;
    try {
      await api.deleteMenuItem(deletingItemId);
      onItemDeleted(deletingItemId);
      notificationManager.showToast({
        type: 'success',
        title: 'Item Deleted',
        message: 'Menu item has been removed.',
      });
    } finally {
      setDeletingItemId(null);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const availableCount = items.filter((i) => i.available !== false).length;
  const unavailableCount = items.length - availableCount;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e] flex items-center gap-2">
            <span>Menu Catalog</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] font-bold border border-[#ff7a1a]/25">
              {items.length} Items
            </span>
          </h1>
          <p className="text-xs text-[#6b7280]">
            Manage items, portion sizes, spice levels & live instant availability
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCatManagerOpen(true)}
            className="px-3.5 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
            title="Manage Categories"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#ff7a1a]" />
            <span>Categories</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] active:scale-95 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* Metric summary chips */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col">
          <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">Total</span>
          <span className="text-base sm:text-lg font-black text-[#1e1e1e] mt-0.5">{items.length}</span>
        </div>
        <div className="p-3 bg-[#e8f8ee] rounded-2xl border border-emerald-200/60 shadow-xs flex flex-col">
          <span className="text-[10px] text-[#15803d] font-bold uppercase tracking-wider">In Stock</span>
          <span className="text-base sm:text-lg font-black text-[#16a34a] mt-0.5">{availableCount}</span>
        </div>
        <div className="p-3 bg-gray-100 rounded-2xl border border-gray-200 shadow-xs flex flex-col">
          <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">Sold Out (86'd)</span>
          <span className="text-base sm:text-lg font-black text-gray-700 mt-0.5">{unavailableCount}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes, size variants, categories..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-0.5 mr-1" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                sounds.playTapSound();
                setSelectedCategory(cat);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#bc5a13] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Dishes List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs animate-pulse flex items-center space-x-3.5">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                <div className="h-3 bg-gray-100 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs text-center flex flex-col items-center justify-center my-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#fff1e6] flex items-center justify-center text-3xl mb-3">
            🍲
          </div>
          <h3 className="text-base font-bold text-[#1e1e1e]">No Menu Items Found</h3>
          <p className="text-xs text-[#6b7280] max-w-xs mt-1 mb-4">
            {searchQuery
              ? `No dishes matched "${searchQuery}".`
              : 'Add your delicious items to start taking customer orders on SachBite.'}
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Dish</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const itemId = item._id || item.id || '';
              const isAvailable = item.available !== false;

              return (
                <motion.div
                  key={itemId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-white rounded-3xl p-4 border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAvailable ? 'border-gray-100' : 'border-gray-200 bg-gray-50/60 opacity-80'
                  }`}
                >
                  {/* Left: Thumbnail + Item Details */}
                  <div className="flex items-start space-x-3.5">
                    {/* Item Image / Icon */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-orange-50 shrink-0 border border-gray-100 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover transition-all ${
                            !isAvailable ? 'grayscale opacity-75' : ''
                          }`}
                        />
                      ) : (
                        <span className="text-3xl">{item.icon || '🍲'}</span>
                      )}

                      {/* Veg / Non-Veg Indicator */}
                      <div className="absolute top-1.5 left-1.5 p-0.5 rounded-sm bg-white/90 shadow-xs">
                        <div className={`w-3 h-3 border flex items-center justify-center rounded-[2px] ${
                          item.isVeg !== false ? 'border-emerald-600' : 'border-rose-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg !== false ? 'bg-emerald-600' : 'bg-rose-600'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-[#1e1e1e] line-clamp-1">
                          {item.name}
                        </h3>
                        {item.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 text-amber-600" />
                            <span>Bestseller</span>
                          </span>
                        )}
                        {item.spiceLevel && (
                          <span className="text-[10px] text-rose-600 font-semibold">
                            {item.spiceLevel === 'Hot & Spicy' || item.spiceLevel === 'Extra Fiery' ? '🌶️🌶️' : '🌶️'}
                          </span>
                        )}
                        {!isAvailable && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
                            Sold Out
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[11px] text-[#6b7280] font-medium">
                          {item.category || 'General'}
                        </span>
                        <span>•</span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-sm font-black text-[#1e1e1e]">
                            ₹{item.price}
                          </span>
                          {Boolean(item.originalPrice && item.originalPrice > item.price) && (
                            <span className="text-xs line-through text-gray-400">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Variants preview */}
                      {item.variants && item.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.variants.map((v, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {v.name}: ₹{v.price}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.description && (
                        <p className="text-[11px] text-[#6b7280] line-clamp-1 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] font-semibold text-gray-500">
                        {isAvailable ? 'In Stock' : '86’d'}
                      </span>
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        title={isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                        className="cursor-pointer focus:outline-none"
                      >
                        {isAvailable ? (
                          <ToggleRight className="w-8 h-8 text-[#16a34a]" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      {onOpenAiMenuWriter && (
                        <button
                          type="button"
                          onClick={() => onOpenAiMenuWriter(item)}
                          className="p-2 rounded-xl text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="AI Description & Allergens"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl text-gray-500 hover:text-[#ff7a1a] hover:bg-orange-50 transition-colors cursor-pointer"
                        title="Edit Dish Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingItemId(itemId)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCatManagerOpen}
        categories={categories}
        onUpdateCategories={(newCats) => setCategories(newCats)}
        onClose={() => setIsCatManagerOpen(false)}
      />

      {/* Add / Edit Dish Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 my-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#fff1e6] flex items-center justify-center text-[#ff7a1a]">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1e1e1e]">
                      {editingItem ? 'Edit Dish' : 'Add New Dish'}
                    </h3>
                    <p className="text-xs text-[#6b7280]">
                      Configure sizes, spice levels, pricing & photos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
                {/* Photo & Emoji */}
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5">
                    Dish Photo & Icon
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-20 h-20 rounded-2xl bg-orange-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {itemImage ? (
                        <img src={itemImage} alt="Dish preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{itemIcon}</span>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="absolute inset-0 bg-black/40 hover:bg-black/60 flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="w-4 h-4 mb-0.5" />
                        <span>{isUploadingImage ? '...' : 'Upload'}</span>
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {EMOJI_ICONS.slice(0, 8).map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setItemIcon(emoji)}
                            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                              itemIcon === emoji
                                ? 'bg-[#fff1e6] border border-[#ff7a1a] scale-110'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1.5 text-[11px] font-bold text-[#b25511] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Upload Custom Image</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dish Name */}
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Special Chicken Dum Biryani"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="280"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Original / MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="340 (Optional)"
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                </div>

                {/* Category & Prep Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    >
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Kitchen Prep Time (mins)
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={prepTimeMinutes}
                      onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-sm text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    />
                  </div>
                </div>

                {/* Spice Level & Diet Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Spice Level
                    </label>
                    <select
                      value={spiceLevel}
                      onChange={(e) => setSpiceLevel(e.target.value as MenuItem['spiceLevel'])}
                      className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Mild">Mild ������️</option>
                      <option value="Medium">Medium 🌶️🌶️</option>
                      <option value="Hot & Spicy">Hot & Spicy 🌶️🌶️🌶️</option>
                      <option value="Extra Fiery">Extra Fiery 🔥</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                      Dietary Type
                    </label>
                    <div className="flex items-center space-x-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setItemIsVeg(true)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          itemIsVeg ? 'bg-[#e8f8ee] text-[#15803d] border-emerald-400' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        🌱 Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemIsVeg(false)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          !itemIsVeg ? 'bg-rose-50 text-rose-700 border-rose-400' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        🍗 Non-Veg
                      </button>
                    </div>
                  </div>
                </div>

                {/* Portion Sizes / Variants */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                  <span className="text-xs font-bold text-[#1e1e1e] block">
                    Portion Sizes / Variants (Optional)
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="e.g. Half Portion"
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-[#1e1e1e]"
                    />
                    <input
                      type="number"
                      value={variantPrice}
                      onChange={(e) => setVariantPrice(e.target.value)}
                      placeholder="₹ Price"
                      className="w-24 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-[#1e1e1e]"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-1.5 bg-[#bc5a13] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  {variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {variants.map((v, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
                          <span>{v.name} (₹{v.price})</span>
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-gray-400 hover:text-rose-600">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Key spices, portion size, serving tips..."
                    className="w-full px-3.5 py-2 bg-[#fafafa] border border-gray-200 rounded-xl text-xs text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-3 flex items-center justify-end space-x-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#6b7280] hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{editingItem ? 'Save Updates' : 'Add to Menu'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingItemId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1e1e1e]">Delete Menu Item?</h3>
              <p className="text-xs text-[#6b7280] mt-1 mb-5">
                Are you sure you want to remove this dish permanently from your catalog?
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setDeletingItemId(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 bg-gray-100 cursor-pointer"
                >
                  Keep Dish
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
