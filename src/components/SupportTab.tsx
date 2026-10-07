import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  PhoneCall,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Headphones,
  LifeBuoy,
} from 'lucide-react';
import { AppSettings, SupportTicket } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface SupportTabProps {
  settings: AppSettings;
}

const FAQS = [
  {
    q: 'How do weekly payouts work on SachBite?',
    a: 'Every Monday morning, your earnings from the previous Monday–Sunday cycle are automatically deposited via NEFT/IMPS to your verified bank account.',
  },
  {
    q: 'How does the 0% Commission Direct Subscription work?',
    a: 'Under the SachBite PRO and BUSINESS tiers, you pay a flat monthly membership fee with 0% cut taken from your food sales. All customer payments go directly to your account.',
  },
  {
    q: 'What should I do if a rider is delayed for food pickup?',
    a: 'You can tap on the order in the Live Orders tab to call the assigned delivery partner directly, or use the emergency support button in this tab for instant re-assignment.',
  },
  {
    q: 'How do I toggle out-of-stock items (86 a dish)?',
    a: 'Go to the Menu tab and switch the toggle next to the dish. It instantly turns off on the customer ordering app so you never get orders for unavailable items.',
  },
];

export const SupportTab: React.FC<SupportTabProps> = ({ settings }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Orders');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getTickets().then((data) => {
      setTickets(data);
      if (data.length > 0) setActiveTicketId(data[0].id);
    });
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createTicket({ subject, category, message });
      setTickets((prev) => [created, ...prev]);
      setActiveTicketId(created.id);
      setIsCreatingTicket(false);
      setSubject('');
      setMessage('');
      notificationManager.showToast({
        type: 'success',
        title: 'Ticket Raised',
        message: `Ticket #${created.ticketNumber} created. Support team will respond within 10 mins.`,
      });
    } catch {
      notificationManager.showToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create support ticket.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (ticketId: string) => {
    if (!replyText.trim()) return;
    sounds.playTapSound();
    await api.replyTicket(ticketId, replyText.trim());

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, { sender: 'merchant', text: replyText.trim(), time: 'Just now' }],
            }
          : t
      )
    );
    setReplyText('');
  };

  const selectedTicket = tickets.find((t) => t.id === activeTicketId);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-28 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <LifeBuoy className="w-6 h-6 text-[#ff7a1a]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#1e1e1e]">Partner Help Desk & Support</h1>
          </div>
          <p className="text-xs text-[#6b7280]">
            Dedicated 24/7 priority support for restaurant merchant partners
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTicket(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-wide">Instant Merchant Helpline</h3>
            <p className="text-xs text-white/90">
              Direct phone support for urgent order or kitchen dispatch issues
            </p>
          </div>
        </div>

        <a
          href={`tel:${settings.supportPhone || '+919876543210'}`}
          className="self-start sm:self-auto px-4 py-2.5 rounded-full bg-white text-[#bc5a13] hover:bg-neutral-100 font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Desk: {settings.supportPhone || '+91 98765 43210'}</span>
        </a>
      </div>

      {/* Support Tickets Container */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1e1e1e]">Active Support Conversations</h3>

        {tickets.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">No open tickets. Need help? Raise a ticket above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Left list of tickets */}
            <div className="space-y-2">
              {tickets.map((t) => {
                const isSelected = t.id === activeTicketId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#fff1e6] border-[#ff7a1a] shadow-2xs'
                        : 'bg-[#fafafa] border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1e1e1e]">
                        {t.ticketNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1e1e1e] line-clamp-1 mt-1">
                      {t.subject}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Right chat message thread */}
            {selectedTicket && (
              <div className="md:col-span-2 bg-[#fafafa] rounded-2xl p-4 border border-gray-100 flex flex-col justify-between min-h-[280px]">
                <div className="pb-3 border-b border-gray-200">
                  <span className="text-xs font-bold text-[#1e1e1e]">{selectedTicket.subject}</span>
                  <p className="text-[10px] text-gray-500">Category: {selectedTicket.category}</p>
                </div>

                {/* Messages */}
                <div className="py-3 space-y-2.5 flex-1 overflow-y-auto max-h-48">
                  {selectedTicket.messages.map((m, idx) => {
                    const isMerchant = m.sender === 'merchant';
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isMerchant ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs ${
                            isMerchant
                              ? 'bg-[#bc5a13] text-white rounded-tr-xs'
                              : 'bg-white border border-gray-200 text-[#1e1e1e] rounded-tl-xs'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <div className="pt-2 border-t border-gray-200 flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message to support desk..."
                    className="flex-1 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage(selectedTicket.id);
                    }}
                  />
                  <button
                    onClick={() => handleSendMessage(selectedTicket.id)}
                    className="p-2 rounded-xl bg-[#bc5a13] hover:bg-[#e85d04] text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#1e1e1e]">Merchant Partner FAQs</h3>
        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-100 rounded-2xl overflow-hidden bg-[#fafafa]"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left text-xs font-bold text-[#1e1e1e] flex items-center justify-between cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-[#6b7280] leading-relaxed border-t border-gray-100/80 pt-2 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {isCreatingTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4"
            >
              <h3 className="text-base font-bold text-[#1e1e1e]">Raise Support Request</h3>

              <form onSubmit={handleCreateTicket} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full px-3 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs font-bold text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  >
                    <option value="Orders">Orders & Kitchen Dispatch</option>
                    <option value="Payments & Payouts">Payments & Payouts</option>
                    <option value="Menu & Catalog">Menu & Catalog Pricing</option>
                    <option value="Delivery Partner">Delivery Partner Issue</option>
                    <option value="Other">General Account Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details or order ID..."
                    className="w-full px-3.5 py-2.5 bg-[#fafafa] border border-gray-200 rounded-xl text-xs text-[#1e1e1e] focus:outline-none focus:border-[#ff7a1a]"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-[#bc5a13] hover:bg-[#e85d04] text-white text-xs font-bold shadow-md"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
