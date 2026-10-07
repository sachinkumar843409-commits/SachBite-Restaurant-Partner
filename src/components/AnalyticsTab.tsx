import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Clock,
  ArrowUpRight,
  Flame,
  Award,
  Calendar,
  Users,
} from 'lucide-react';
import { MenuItem, Order, RestaurantProfile } from '../types';

interface AnalyticsTabProps {
  orders: Order[];
  menuItems: MenuItem[];
  profile: RestaurantProfile | null;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ orders, menuItems, profile }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Compute metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const rating = profile?.rating || 4.6;
  const ratingsCount = profile?.totalRatingsCount || 348;

  // Compute dish sales leaderboard
  const dishSalesMap: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((ord) => {
    ord.items.forEach((it) => {
      if (!dishSalesMap[it.name]) {
        dishSalesMap[it.name] = { count: 0, revenue: 0 };
      }
      dishSalesMap[it.name].count += it.quantity;
      dishSalesMap[it.name].revenue += it.price * it.quantity;
    });
  });

  const topDishes = Object.entries(dishSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Weekly Revenue Trend data (Mocked based on real totals)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyRevenue = [4200, 5800, 5100, 6900, 8400, 11200, 9800];
  const maxWeekly = Math.max(...weeklyRevenue);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-[#ff7a1a]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Sales & Growth Hub</h1>
          </div>
          <p className="text-xs text-[#6b7280]">
            Performance metrics, revenue analytics & dish popularity
          </p>
        </div>

        {/* Time range pill selector */}
        <div className="flex items-center space-x-1 p-1 bg-white border border-gray-200 rounded-2xl self-start sm:self-auto shadow-2xs">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                timeRange === r ? 'bg-[#bc5a13] text-white shadow-2xs' : 'text-gray-500 hover:text-[#1e1e1e]'
              }`}
            >
              {r === 'today' ? 'Today' : r === 'week' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Sales */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Net Revenue</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-[#1e1e1e]">
              ₹{totalRevenue.toLocaleString()}
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-[#16a34a] mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14.8% vs last period</span>
            </div>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Total Orders</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-[#1e1e1e]">
              {totalOrdersCount}
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-[#16a34a] mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>98% fulfillment rate</span>
            </div>
          </div>
        </motion.div>

        {/* Avg Order Value (AOV) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Avg Order (AOV)</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-[#1e1e1e]">
              ₹{aov}
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-[#6b7280] mt-1">
              <span>Healthy basket size</span>
            </div>
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Store Rating</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-[#1e1e1e]">
              {rating} ★
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-[#6b7280] mt-1">
              <span>{ratingsCount} verified ratings</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Visual Revenue Graph */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1e1e1e]">Weekly Revenue Trend</h3>
            <p className="text-xs text-[#6b7280]">Daily earnings for the last 7 active business days</p>
          </div>
          <span className="text-xs font-black text-[#16a34a] bg-[#e8f8ee] px-2.5 py-1 rounded-full border border-emerald-300">
            Peak: Sat (₹11.2k)
          </span>
        </div>

        {/* Chart Bars */}
        <div className="pt-4 pb-2 flex items-end justify-between h-44 gap-2">
          {days.map((day, idx) => {
            const amt = weeklyRevenue[idx];
            const heightPercent = Math.round((amt / maxWeekly) * 100);
            const isToday = idx === 6;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#b25511] transition-colors">
                  ₹{(amt / 1000).toFixed(1)}k
                </span>
                <div className="w-full bg-gray-100 rounded-xl h-full max-h-32 flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`w-full rounded-xl transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-[#bc5a13] to-[#ff7a1a] shadow-xs'
                        : 'bg-gradient-to-t from-orange-300 to-orange-400 group-hover:from-orange-400 group-hover:to-orange-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-bold ${isToday ? 'text-[#ff7a1a]' : 'text-gray-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Dishes Leaderboard */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#ff7a1a]" />
            <h3 className="text-sm font-bold text-[#1e1e1e]">Top Selling Dishes Leaderboard</h3>
          </div>
          <span className="text-xs text-[#6b7280]">By volume & revenue</span>
        </div>

        <div className="space-y-2">
          {topDishes.length === 0 ? (
            <p className="text-xs text-gray-500 py-3 text-center">No orders recorded yet.</p>
          ) : (
            topDishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="p-3 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-orange-50/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${
                    idx === 0
                      ? 'bg-amber-100 text-amber-800'
                      : idx === 1
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-orange-50 text-[#b25511]'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1e1e1e]">{dish.name}</h4>
                    <p className="text-[11px] text-[#6b7280]">{dish.count} portions sold</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#1e1e1e]">₹{dish.revenue}</span>
                  <span className="text-[10px] text-[#16a34a] font-bold block">★ Bestseller</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Operational Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[#ff7a1a]">
            <Clock className="w-4 h-4" />
            <h4 className="text-xs font-bold text-[#1e1e1e]">Peak Ordering Hours</h4>
          </div>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Your restaurant receives <strong>64% of total orders</strong> between <strong>1:00 PM – 3:30 PM</strong> (Lunch) and <strong>8:00 PM – 10:45 PM</strong> (Dinner).
          </p>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center space-x-2 text-[#16a34a]">
            <Award className="w-4 h-4" />
            <h4 className="text-xs font-bold text-[#1e1e1e]">Preparation Efficiency</h4>
          </div>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Average kitchen prep time is <strong>14.2 minutes</strong>. You beat 88% of restaurants in your zone for fast rider handover!
          </p>
        </div>
      </div>
    </div>
  );
};
