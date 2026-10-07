import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { notificationManager } from '../utils/notifications';
import { SachBiteLogo } from './SachBiteLogo';

interface LoginScreenProps {
  onLoginSuccess: (restaurantName?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.login(username.trim(), password.trim());
      if (res.success) {
        notificationManager.showToast({
          type: 'success',
          title: 'Welcome Back!',
          message: `Logged in as ${res.restaurantName || 'Restaurant Partner'}`,
        });
        onLoginSuccess(res.restaurantName);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setErrorMessage('Network error connecting to SachBite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername('demo');
    setPassword('sachbite123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffffff] via-[#fafafa] to-[#fff7ed] flex flex-col justify-center items-center px-4 py-8 relative select-none">
      {/* Subtle decorative background ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff7a1a]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 z-10"
      >
        {/* Official SachBite Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <SachBiteLogo
            variant="full"
            size="lg"
            showTagline={true}
            showPartnerBadge={true}
            className="mb-2"
          />

          <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xs">
            Sign in to manage orders, live kitchen KDS & payouts
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-[#dc2626]"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
              Username / Partner ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. tandooritales or partner_id"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1e1e1e] uppercase tracking-wider mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 bg-[#fafafa] border border-gray-200 rounded-2xl text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:border-[#ff7a1a] focus:ring-2 focus:ring-[#ff7a1a]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#bc5a13] to-[#e85d04] hover:from-[#e85d04] hover:to-[#ff7a1a] active:scale-[0.98] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Partner Credentials...</span>
                </>
              ) : (
                <span>Sign In to Partner App</span>
              )}
            </button>
          </div>
        </form>

        {/* Demo Fast Fill Button */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-2.5 px-4 rounded-xl bg-[#fff1e6] hover:bg-[#ffe5d0] border border-[#ff7a1a]/30 text-[#b25511] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff7a1a]" />
            <span>Use Demo Partner Credentials (Instant Test)</span>
          </button>
        </div>

        {/* Helper Note from user spec */}
        <div className="mt-5 text-center px-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            Login credentials nahi hain? <br className="hidden sm:inline" />
            <span className="text-gray-900 font-semibold">SachBite admin se contact karein.</span>
          </p>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-gray-500 flex items-center gap-3">
        <span>Live API: <strong className="text-emerald-700">sachbite.in/api</strong></span>
        <span>•</span>
        <span>Secure Merchant Portal</span>
      </div>
    </div>
  );
};
