import React from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  UtensilsCrossed,
  TrendingUp,
  Wallet,
  Menu as MenuIcon,
  Store,
  Crown,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { TabType } from '../types';

export type { TabType };

interface BottomTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  activeOrdersCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  activeOrdersCount = 0,
}) => {
  const primaryTabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: activeOrdersCount,
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: UtensilsCrossed,
    },
    {
      id: 'analytics',
      label: 'Sales',
      icon: TrendingUp,
    },
    {
      id: 'finance',
      label: 'Payouts',
      icon: Wallet,
    },
    {
      id: 'profile',
      label: 'Hub',
      icon: Store,
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    if (tabId !== activeTab) {
      sounds.playTapSound();
      onSelectTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {primaryTabs.map((tab) => {
          // If in subtab like 'marketing', 'reviews', 'subscription', 'support', we can consider if Hub is active
          const isHubTab = ['profile', 'marketing', 'reviews', 'subscription', 'support'].includes(activeTab);
          const isActive = tab.id === activeTab || (tab.id === 'profile' && isHubTab);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-[#bc5a13]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Active Indicator Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#fff1e6] rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#ff7a1a] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] mt-1 font-bold tracking-tight transition-colors ${
                isActive ? 'text-[#b25511]' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
