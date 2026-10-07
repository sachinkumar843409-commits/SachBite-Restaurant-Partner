import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Volume2,
  ChefHat,
  Printer,
  Bike,
  Camera,
  Utensils,
  Package,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SachBiteLogo } from './SachBiteLogo';
import { sounds } from '../utils/sound';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  if (!isOpen) return null;

  const guideSections = [
    {
      id: 'live_orders',
      icon: Volume2,
      color: 'bg-orange-500',
      badge: 'Step 1: Orders & Voice',
      title: 'Incoming Orders & Voice Assistant',
      desc: 'Naya order aane par live siren ring hoti hai aur kitchen speaker zor se Hindi/English me bolkar dishes batata hai.',
      steps: [
        '🔔 Naya order aane par screen par pop-up aayega aur siren bajegi.',
        '🗣️ App bolkar batayega: *"SachBite par naya order aaya hai — 2 Paneer Butter Masala aur 4 Naan"*.',
        '⏳ 20 ya 30 mins prep time select karke "Accept & Start Prep" dabayein.',
        '🔊 Header ke Bell icon se siren tone (Loud Alert, Scooter Horn, Chime) aur bhasha (Hindi, Hinglish, EN) customize kar sakte hain.',
      ],
      tip: 'Chef ko phone touch karne ki zaroorat nahi hai, aawaz sunkar hi tandoor/fryer line shuru ho sakti hai.',
    },
    {
      id: 'kds_kot',
      icon: ChefHat,
      color: 'bg-neutral-900',
      badge: 'Step 2: KDS & Kitchen Print',
      title: 'Kitchen Display (KDS) & KOT Print',
      desc: 'Kitchen tablet par live orders ka timer chalta hai aur 1-click me thermal printer se KOT nikalta hai.',
      steps: [
        '👨‍🍳 Header ke "KDS Tablet" button ko dabakar full-screen kitchen monitor open karein.',
        '🖨️ "Print KOT" dabakar Bluetooth/USB 58mm/80mm printer se receipt print karein.',
        '⏱️ Live timer batata hai ki khana kitne time me ready hona hai (e.g. 15m remaining).',
        '✅ Khana banne ke baad "Mark Food Ready" dabayein taaki Delivery Rider ko pickup notification chala jaye.',
      ],
      tip: 'Bluetooth thermal printer ko auto-print mode par rakhein taaki order aate hi bina click kiye slip nikal jaye.',
    },
    {
      id: 'photo_proof',
      icon: Camera,
      color: 'bg-emerald-600',
      badge: 'Step 3: Dispute Protection',
      title: 'Food Packing Photo Proof',
      desc: 'Customer ke jhoothe complaints (spilled/missing item) se bachne ke liye dabbe ki safety photo.',
      steps: [
        '📦 Food pack karne ke baad order card par "Attach Photo / 📸" button dabayein.',
        '📷 Packed bag aur containers ki photo upload ya camera se capture karein.',
        '🛡️ Photo SachBite server par save ho jati hai. Agar koi customer refund claim karega toh ye photo dispute cancel kar degi.',
      ],
      tip: 'High-value orders (₹500+) me photo zaroor attach karein taaki 100% payment guaranteed rahe.',
    },
    {
      id: 'rider_radar',
      icon: Bike,
      color: 'bg-amber-600',
      badge: 'Step 4: Delivery Radar',
      title: 'Live Rider GPS Radar & Contact',
      desc: 'Delivery partner ka real-time location map, vehicle number aur live ETA countdown.',
      steps: [
        '🛵 Order card par "Track Rider" button dabayein.',
        '🗺️ Map par dekhein rider kitni door hai aur kab tak pickup counter par pahuchega.',
        '📞 "Call" ya "WhatsApp" button dabakar rider ko instant pickup instruction bhejein.',
        '🤝 Rider aane par packaging bag handover karein aur OTP verify karein.',
      ],
      tip: 'Agar barish ho rahi ho, toh "Rain Mode" on kar dein taaki +10 min ka extra prep buffer mil sake.',
    },
    {
      id: 'dinein_pos',
      icon: Utensils,
      color: 'bg-rose-600',
      badge: 'Step 5: Counter POS & Standees',
      title: 'Table QR POS & Counter Billing',
      desc: 'Dine-in tables (T-1 to T-6) aur counter takeaway ke liye complete billing software.',
      steps: [
        '🍽️ "Counter POS" button dabakar table choose karein (e.g. Table T-2).',
        '🥘 Dishes add karein aur discount (5%, 10%, 15%) apply karein.',
        '💳 Payment mode (UPI, Cash, Card) select karke "Settle & Print" dabayein.',
        '🪧 Table Standee modal se printable A5 QR code print karke restaurant tables par lagayein.',
      ],
      tip: 'Customer table par baithe-baithe scan karke order karega aur order sidha aapke KDS par aayega.',
    },
    {
      id: 'marketing_eod',
      icon: MessageSquare,
      color: 'bg-indigo-600',
      badge: 'Step 6: Growth & Daily Closing',
      title: 'WhatsApp Marketing & Night Closing',
      desc: 'Repeat customer offers aur raat 11:30 PM ka complete P&L settlement report.',
      steps: [
        '💬 "WhatsApp Loyalty": Jo customer pehle order kar chuke hain unko 1-tap me 10% OFF ka promo bhejein.',
        '📊 "EOD WhatsApp Report": Raat ko store band karte waqt 1-click me total sales, net bank payout aur top dishes ka summary WhatsApp par generate karein.',
        '🌙 "Closing Checklist": Gas band, fridge temperature, cash counter tally karke store close karein.',
      ],
      tip: 'Happy Hours set karein (12 PM - 3 PM lunch discount) taaki slow hours me bhi orders aate rahein.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Top Header */}
          <div className="p-4 bg-gradient-to-r from-[#1e1e1e] to-neutral-800 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ff7a1a] text-white flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-300 block">
                  PARTNER TRAINING MANUAL
                </span>
                <h3 className="text-base font-black">
                  SachBite App Complete User Guide
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Guide Body */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Nav Topics */}
            <div className="md:col-span-4 p-3 bg-gray-50 border-r border-gray-200 overflow-y-auto space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-2 block mb-1">
                Topics & Modules
              </span>
              {guideSections.map((sec, idx) => {
                const Icon = sec.icon;
                const isSelected = activeSection === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      sounds.playTapSound();
                      setActiveSection(idx);
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center space-x-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#ff7a1a] shadow-2xs ring-1 ring-[#ff7a1a]'
                        : 'bg-transparent border-transparent hover:bg-white/70 text-gray-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl ${sec.color} text-white flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-gray-400 font-bold block leading-none truncate">
                        {sec.badge}
                      </span>
                      <h4 className="text-xs font-black text-[#1e1e1e] truncate mt-0.5">
                        {sec.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Topic Details */}
            <div className="md:col-span-8 p-5 overflow-y-auto flex flex-col justify-between space-y-4 bg-white">
              {(() => {
                const cur = guideSections[activeSection];
                const CurIcon = cur.icon;
                return (
                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#b25511] bg-[#fff1e6] px-2.5 py-0.5 rounded-full border border-[#ff7a1a]/20">
                          {cur.badge}
                        </span>
                        <h2 className="text-lg font-black text-[#1e1e1e] mt-1.5">
                          {cur.title}
                        </h2>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                          {cur.desc}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl ${cur.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                        <CurIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step by step checklist */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                        Kaise Use Karein (Step-by-Step Instructions):
                      </h4>
                      <div className="space-y-2">
                        {cur.steps.map((st, i) => (
                          <div
                            key={i}
                            className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-start space-x-2.5 text-xs text-[#1e1e1e] leading-relaxed"
                          >
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-[#bc5a13] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tip Box */}
                    <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-950">
                      <Sparkles className="w-4 h-4 text-[#ff7a1a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-black text-[#bc5a13]">Pro Tip for Kitchen Staff:</strong>
                        <span>{cur.tip}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Footer Pagination */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  disabled={activeSection === 0}
                  onClick={() => {
                    sounds.playTapSound();
                    setActiveSection((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous Step
                </button>

                {activeSection < guideSections.length - 1 ? (
                  <button
                    onClick={() => {
                      sounds.playTapSound();
                      setActiveSection((prev) => Math.min(guideSections.length - 1, prev + 1));
                    }}
                    className="px-5 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Done Reading ✅
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
