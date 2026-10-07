import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Send,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import { CustomerReview, RestaurantProfile } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface ReviewsTabProps {
  profile: RestaurantProfile | null;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ profile }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    api.getReviews().then(setReviews);
  }, []);

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    sounds.playTapSound();
    await api.replyReview(reviewId, replyText.trim());

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, merchantReply: replyText.trim(), repliedAt: new Date().toISOString() } : r
      )
    );

    setReplyingId(null);
    setReplyText('');
    notificationManager.showToast({
      type: 'success',
      title: 'Reply Published',
      message: 'Your response is now visible to the customer on SachBite.',
    });
  };

  const rating = profile?.rating || 4.6;
  const count = profile?.totalRatingsCount || 348;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-[#ff7a1a] fill-[#ff7a1a]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Customer Reviews & Ratings</h1>
        </div>
        <p className="text-xs text-[#6b7280]">
          Verified feedback from foodies who ordered from your kitchen
        </p>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-amber-800 shrink-0">
            <span className="text-3xl font-black">{rating}</span>
            <div className="flex items-center space-x-0.5 text-amber-500 mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-2.5 h-2.5 fill-current" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#1e1e1e]">Superb Food & Packing</h3>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Based on <strong>{count} customer ratings</strong> on SachBite.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#e8f8ee] text-[#15803d] text-[10px] font-bold">
                ✓ 96% Positive Reviews
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] text-[10px] font-bold">
                ★ Top Rated in Biryani
              </span>
            </div>
          </div>
        </div>

        {/* Rating distribution mini bars */}
        <div className="space-y-1.5 min-w-[160px] text-xs font-semibold text-gray-500">
          <div className="flex items-center space-x-2">
            <span>5 ★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-full w-[78%]" />
            </div>
            <span className="text-[10px]">78%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>4 ★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-400 h-full w-[16%]" />
            </div>
            <span className="text-[10px]">16%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>3 ★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-300 h-full w-[4%]" />
            </div>
            <span className="text-[10px]">4%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>2 ★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gray-300 h-full w-[1%]" />
            </div>
            <span className="text-[10px]">1%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>1 ★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gray-300 h-full w-[1%]" />
            </div>
            <span className="text-[10px]">1%</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            layout
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#1e1e1e]">{rev.customerName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    Verified Buyer
                  </span>
                </div>
                <span className="text-[11px] text-[#6b7280]">Order #{rev.orderId}</span>
              </div>

              {/* Star Badge */}
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-black">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-[#1e1e1e] leading-relaxed font-medium">
              "{rev.comment}"
            </p>

            {/* Food Praise Tags */}
            {rev.tags && (
              <div className="flex flex-wrap gap-1.5">
                {rev.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold"
                  >
                    👍 {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Merchant Reply Section */}
            {rev.merchantReply ? (
              <div className="p-3 bg-[#fff1e6]/60 rounded-2xl border border-[#ff7a1a]/20 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-[#b25511] font-bold">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Restaurant Response:</span>
                </div>
                <p className="text-xs text-[#1e1e1e] pl-5 leading-relaxed">
                  {rev.merchantReply}
                </p>
              </div>
            ) : replyingId === rev.id ? (
              <div className="pt-2 space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a polite response to thank the customer or address feedback..."
                  className="w-full px-3.5 py-2 bg-[#fafafa] border border-gray-200 rounded-2xl text-xs text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                />
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setReplyingId(null);
                      setReplyText('');
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    setReplyingId(rev.id);
                    setReplyText('');
                  }}
                  className="text-xs font-bold text-[#b25511] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply to Customer</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
