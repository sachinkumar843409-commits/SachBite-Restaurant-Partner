import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Plus,
  Trash2,
  Lock,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { StaffMember } from '../types';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { sounds } from '../utils/sound';

interface StaffManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffManagerModal: React.FC<StaffManagerModalProps> = ({ isOpen, onClose }) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Store Manager');
  const [pin, setPin] = useState('');

  useEffect(() => {
    api.getStaff().then(setStaff);
  }, []);

  if (!isOpen) return null;

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || pin.length < 4) {
      notificationManager.showToast({
        type: 'error',
        title: 'Invalid Fields',
        message: 'Please provide full name, mobile number and a 4-digit security PIN.',
      });
      return;
    }

    sounds.playSuccessSound();
    const created = await api.addStaff({
      name: name.trim(),
      phone: phone.trim(),
      role,
      pin,
      isActive: true,
    });

    setStaff((prev) => [...prev, created]);
    setIsAdding(false);
    setName('');
    setPhone('');
    setPin('');
    notificationManager.showToast({
      type: 'success',
      title: 'Staff Member Added',
      message: `${created.name} registered as ${created.role} (PIN: ${created.pin}).`,
    });
  };

  const handleDelete = async (id: string) => {
    sounds.playTapSound();
    await api.deleteStaff(id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    notificationManager.showToast({
      type: 'info',
      title: 'Staff Removed',
      message: 'Account credentials revoked.',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#ff7a1a] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1e1e1e]">Staff Accounts & PIN Lock</h3>
                <p className="text-xs text-[#6b7280]">Manage kitchen chefs, cashiers & store managers</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAdding(true)}
                className="px-3 py-1.5 rounded-full bg-[#bc5a13] text-white text-xs font-bold hover:bg-[#e85d04] flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff</span>
              </button>
              <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {isAdding && (
              <form onSubmit={handleAddStaff} className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3">
                <span className="text-xs font-bold text-[#b25511] uppercase tracking-wider block">
                  Add New Team Member
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765..."
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Store Manager">Store Manager</option>
                      <option value="Kitchen Chef">Kitchen Chef</option>
                      <option value="Cashier">Cashier</option>
                      <option value="Dispatcher">Order Dispatcher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">4-Digit Access PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-center"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-gray-500 bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#bc5a13] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 bg-[#fafafa] rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-bold text-sm text-[#bc5a13]">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#1e1e1e]">{member.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] text-[10px] font-bold">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6b7280]">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      PIN: {member.pin}
                    </span>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 cursor-pointer"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#bc5a13] text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
