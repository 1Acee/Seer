"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AccountData {
  name: string;
  businessName?: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AccountStepProps {
  accountData: AccountData;
  setAccountData: (data: AccountData) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Partial<AccountData>;
}

export default function AccountStep({ accountData, setAccountData, onSubmit, errors }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-75 to-stone-100 flex items-center justify-center p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-16">
          {/* Geometric symbol */}
          <motion.div 
            className="text-5xl mb-8 font-extralight"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgb(74, 67, 59)' }}
          >
            ◉
          </motion.div>
          
          <h1 className="text-7xl md:text-8xl font-extralight text-stone-900 mb-6 tracking-tight leading-none">
            Begin your <span className="font-light italic">journey</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-light">
            Create your personal intelligence profile
          </p>
        </div>

        {/* Form Card */}
        <motion.div 
          className="relative bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,248,246,0.9))'
          }}
        >
          {/* Accent line */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgb(255, 107, 107), transparent)' }}
          />
          
          <div className="p-12">
            <form onSubmit={onSubmit} className="space-y-8">
              
              {/* Name and Company Row */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                               placeholder-stone-400 transition-all duration-300 font-light
                               ${focusedField === 'name' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                               ${errors.name ? 'ring-2 ring-red-300' : ''}`}
                    placeholder="Your full name"
                    style={{ outline: 'none' }}
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-500 font-light">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Company <span className="text-stone-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={accountData.businessName}
                    onChange={(e) => setAccountData({ ...accountData, businessName: e.target.value })}
                    onFocus={() => setFocusedField('company')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                               placeholder-stone-400 transition-all duration-300 font-light
                               ${focusedField === 'company' ? 'bg-white shadow-lg scale-[1.02]' : ''}`}
                    placeholder="Organization"
                    style={{ outline: 'none' }}
                  />
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                  Email address
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-4 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                             placeholder-stone-400 transition-all duration-300 font-light
                             ${focusedField === 'email' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                             ${errors.email ? 'ring-2 ring-red-300' : ''}`}
                  placeholder="you@domain.com"
                  style={{ outline: 'none' }}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500 font-light">{errors.email}</p>
                )}
              </motion.div>

              {/* Phone and Username Row */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                               placeholder-stone-400 transition-all duration-300 font-light
                               ${focusedField === 'phone' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                               ${errors.phone ? 'ring-2 ring-red-300' : ''}`}
                    placeholder="+1 (555) 000-0000"
                    style={{ outline: 'none' }}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-xs text-red-500 font-light">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Username
                  </label>
                  <input
                    type="text"
                    value={accountData.username}
                    onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-4 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                               placeholder-stone-400 transition-all duration-300 font-light
                               ${focusedField === 'username' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                               ${errors.username ? 'ring-2 ring-red-300' : ''}`}
                    placeholder="Choose username"
                    style={{ outline: 'none' }}
                  />
                  {errors.username && (
                    <p className="mt-2 text-xs text-red-500 font-light">{errors.username}</p>
                  )}
                </motion.div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={accountData.password}
                      onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-4 pr-12 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                                 placeholder-stone-400 transition-all duration-300 font-light
                                 ${focusedField === 'password' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                                 ${errors.password ? 'ring-2 ring-red-300' : ''}`}
                      placeholder="Min 8 characters"
                      style={{ outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? '◡' : '◉'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500 font-light">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-light text-stone-600 mb-2 tracking-wide">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={accountData.confirmPassword}
                      onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-4 pr-12 bg-stone-50/50 border-0 rounded-2xl text-stone-900 
                                 placeholder-stone-400 transition-all duration-300 font-light
                                 ${focusedField === 'confirmPassword' ? 'bg-white shadow-lg scale-[1.02]' : ''}
                                 ${errors.confirmPassword ? 'ring-2 ring-red-300' : ''}`}
                      placeholder="Confirm password"
                      style={{ outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showConfirmPassword ? '◡' : '◉'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500 font-light">{errors.confirmPassword}</p>
                  )}
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-4"
              >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 px-8 bg-stone-900 hover:bg-stone-800 text-white text-lg 
                           font-light rounded-full transition-all duration-300 shadow-2xl 
                           hover:shadow-3xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Continue to personalization</span>
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Coral accent dot */}
                  <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-2 rounded-full 
                                opacity-0 group-hover:opacity-100 transition-all duration-300"
                       style={{ background: 'rgb(255, 107, 107)' }} />
                </motion.button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                By continuing, you acknowledge our{' '}
                <a href="#" className="underline hover:text-stone-700 transition-colors">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-stone-700 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Ambient floating elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-stone-300 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}