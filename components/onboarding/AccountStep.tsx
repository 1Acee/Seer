// components/onboarding/AccountStep.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AccountData {
  name: string;
  businessName?: string;
  email: string;
  password: string;
}

interface AccountStepProps {
  accountData: AccountData;
  setAccountData: (data: AccountData) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Partial<AccountData>;
}

export default function AccountStep({ accountData, setAccountData, onSubmit, errors }: AccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Implementation would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-50 to-amber-50/10 py-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            className="text-4xl mb-6 font-extralight text-stone-700"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ◉
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-4 tracking-tight">
            Welcome to <span className="font-light italic">Seer</span>
          </h1>
          <p className="text-lg text-stone-600 font-light">
            Create your intelligence profile
          </p>
        </div>

        {/* Form Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-stone-200/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Violet accent line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-violet-600 to-transparent" />
          
          <div className="p-8">
            {/* Account Type Toggle */}
            <div className="flex gap-2 mb-8 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setIsBusinessAccount(false)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  !isBusinessAccount ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => setIsBusinessAccount(true)}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  isBusinessAccount ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'
                }`}
              >
                Business
              </button>
            </div>

            {/* Social Sign-up Options */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => handleSocialSignup('google')}
                className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-stone-700 font-light text-sm">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignup('microsoft')}
                className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                  <path fill="#7FBA00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                  <path fill="#00A4EF" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                  <path fill="#FFB900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                </svg>
                <span className="text-stone-700 font-light text-sm">Microsoft</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignup('facebook')}
                className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-stone-700 font-light text-sm">Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignup('apple')}
                className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-stone-700 font-light text-sm">Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-stone-500">or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {isBusinessAccount ? 'Business name' : 'Full name'}
                </label>
                <input
                  type="text"
                  value={isBusinessAccount ? accountData.businessName || '' : accountData.name}
                  onChange={(e) => {
                    if (isBusinessAccount) {
                      setAccountData({ ...accountData, businessName: e.target.value });
                    } else {
                      setAccountData({ ...accountData, name: e.target.value });
                    }
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-stone-50/50 border rounded-xl text-stone-900 
                             placeholder-stone-400 transition-all duration-300
                             ${focusedField === 'name' ? 'border-violet-600 ring-2 ring-violet-600/20' : 'border-stone-200'}
                             ${errors.name || errors.businessName ? 'border-red-300' : ''}`}
                  placeholder={isBusinessAccount ? "Your business name" : "First and last name"}
                />
                {(errors.name || errors.businessName) && (
                  <p className="mt-2 text-xs text-red-600">This field is required</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-stone-50/50 border rounded-xl text-stone-900 
                             placeholder-stone-400 transition-all duration-300
                             ${focusedField === 'email' ? 'border-violet-600 ring-2 ring-violet-600/20' : 'border-stone-200'}
                             ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={accountData.password}
                    onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 pr-12 bg-stone-50/50 border rounded-xl text-stone-900 
                               placeholder-stone-400 transition-all duration-300
                               ${focusedField === 'password' ? 'border-violet-600 ring-2 ring-violet-600/20' : 'border-stone-200'}
                               ${errors.password ? 'border-red-300' : ''}`}
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-600">{errors.password}</p>
                )}
                <p className="mt-2 text-xs text-stone-500">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  className="w-full py-4 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white 
                           rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Continue
                </button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-stone-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-violet-600 hover:text-violet-700">Terms</a>{' '}
                and{' '}
                <a href="#" className="text-violet-600 hover:text-violet-700">Privacy Policy</a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Sign In Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8 text-stone-600"
        >
          Already have an account?{' '}
          <a href="/login" className="text-violet-600 hover:text-violet-700 font-medium">Sign in</a>
        </motion.p>
      </motion.div>
    </div>
  );
}