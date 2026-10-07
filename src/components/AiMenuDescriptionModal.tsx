import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Bot,
  CheckCircle,
  Copy,
  Tag,
  Flame,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { MenuItem } from '../types';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface AiMenuDescriptionModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onDescriptionApplied: (itemId: string, description: string, allergens: string[]) => void;
  onClose: () => void;
}

export const AiMenuDescriptionModal: React.FC<AiMenuDescriptionModalProps> = ({
  isOpen,
  item,
  onDescriptionApplied,
  onClose,
}) => {
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(['Dairy / Milk', 'Gluten']);
  const [isGenerating, setIsGenerating] = useState(false);

  React.useEffect(() => {
    if (item) {
      // Auto craft mouthwatering description template based on item name and category
      const dish = item.name;
      const cat = item.category;
      const isVeg = item.isVeg !== false;
      const spice = item.spiceLevel || 'Medium';

      const promptOutputs = [
        `Authentic ${dish} cooked to perfection using slow-dum techniques with aromatic whole spices, infused with rich butter gravy and garnished with fresh coriander. A signature ${cat} specialty!`,
        `Tender and flavourful ${dish}, marinated in freshly ground herbs and simmered in our chef's secret recipe sauce. Rich, succulent, and perfectly paired with butter naan or steamed basmati rice.`,
        `A crowd favorite! Crispy, rich, and mouth-watering ${dish} prepared fresh upon order with pure ingredients and traditional spices. Rated 4.9 by food lovers!`,
      ];

      setGeneratedDesc(promptOutputs[Math.floor(Math.random() * promptOutputs.length)]);
      if (!isVeg) {
        setSelectedAllergens(['Meat / Poultry', 'Dairy']);
      } else {
        setSelectedAllergens(['Dairy / Milk', 'Gluten']);
      }
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleRegenerate = () => {
    setIsGenerating(true);
    sounds.playTapSound();
    setTimeout(() => {
      setIsGenerating(false);
      const variations = [
        `Handcrafted ${item.name} featuring premium farm-fresh ingredients simmered in a velvety, spice-rich tomato-cashew curry. A truly royal delight!`,
        `Experience bursting flavors with our chef-curated ${item.name}. Packed with authentic aroma, balanced spice, and rich texture that melts in your mouth.`,
        `Special homestyle ${item.name} prepared with 100% pure desi ghee and slow-roasted tandoori spices. Perfectly spiced and served piping hot!`,
      ];
      setGeneratedDesc(variations[Math.floor(Math.random() * variations.length)]);
      sounds.playSuccessSound();
    }, 600);
  };

  const toggleAllergen = (alg: string) => {
    sounds.playTapSound();
    setSelectedAllergens((prev) =>
      prev.includes(alg) ? prev.filter((a) => a !== alg) : [...prev, alg]
    );
  };

  const handleApply = () => {
    sounds.playSuccessSound();
    onDescriptionApplied(item._id || item.id || '', generatedDesc, selectedAllergens);
    notificationManager.showToast({
      type: 'success',
      title: 'AI Description Applied',
      message: `Updated description and allergen tags for ${item.name}.`,
    });
    onClose();
  };

  const allergenOptions = [
    'Dairy / Milk',
    'Gluten / Wheat',
    'Nuts & Cashews',
    'Soy / Soya',
    'Eggs',
    'Mustard Seeds',
    '100% Nut-Free',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg p-4 sm:p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1e1e1e]">AI Smart Menu Writer</h3>
                <p className="text-xs text-[#6b7280]">
                  Mouth-watering descriptions for {item.name}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Output Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-purple-600" />
                <span>Generated Dish Description:</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Rewrite with AI</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={generatedDesc}
              onChange={(e) => setGeneratedDesc(e.target.value)}
              className="w-full p-3 bg-purple-50/50 border border-purple-200 rounded-2xl text-xs font-medium text-purple-950 focus:outline-none focus:border-purple-500 leading-relaxed shadow-inner"
            />
          </div>

          {/* Allergen & Dietary Tags */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-700 block">
              Allergen & Dietary Safety Tags:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allergenOptions.map((alg) => {
                const isSelected = selectedAllergens.includes(alg);
                return (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => toggleAllergen(alg)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? `✓ ${alg}` : `+ ${alg}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply to Dish</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
