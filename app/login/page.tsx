// app/login/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const authData = localStorage.getItem("seerAuth") || sessionStorage.getItem("seerAuth");
      if (authData) {
        const auth = JSON.parse(authData);
        if (auth.rememberMe && auth.expires) {
          if (new Date().getTime() < auth.expires) {
            router.push("/dashboard");
          } else {
            localStorage.removeItem("seerAuth");
          }
        } else if (!auth.rememberMe) {
          router.push("/dashboard");
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (rememberMe) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem("seerAuth", JSON.stringify({
        email,
        expires: expirationDate.getTime(),
        rememberMe: true
      }));
    } else {
      sessionStorage.setItem("seerAuth", JSON.stringify({
        email,
        rememberMe: false
      }));
    }

    router.push("/dashboard");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implementation would go here
  };

  // Floating particles for ambient effect
  const particles = Array.from({ length: 5 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-violet-600/30 rounded-full"
      initial={{ y: 0, x: 0, opacity: 0 }}
      animate={{
        y: [-20, -100],
        x: [0, 30],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 6,
        delay: i * 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ left: `${20 + i * 15}%` }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#ede8e3] to-[#e8e2db]">
      {/* Background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles}
      </div>

      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#ede8e3] to-[#e8e2db] p-12 items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent"></div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-md"
          >
            <h1 className="text-7xl font-extralight text-stone-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Seer
            </h1>
            <p className="text-2xl text-stone-600 font-extralight italic mb-8">Intelligence unfolds</p>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-violet-600 mt-2"></div>
                <p className="text-stone-600">Surface tomorrow&apos;s trends today with AI-powered predictions</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-violet-600 mt-2"></div>
                <p className="text-stone-600">Evidence-backed insights with clear lead times</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-violet-600 mt-2"></div>
                <p className="text-stone-600">Stay ahead of the curve in your domains</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-5xl font-extralight text-stone-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Seer
              </h1>
              <p className="text-lg text-stone-600 font-extralight italic">Intelligence unfolds</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-stone-200/50">
              <h2 className="text-2xl font-extralight text-stone-900 mb-2">Welcome back</h2>
              <p className="text-stone-500 mb-8">Sign in to continue to your dashboard</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all bg-white/50"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-stone-700">
                      Password
                    </label>
                    <Link href="#" className="text-sm text-violet-600 hover:text-violet-700 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all bg-white/50"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-violet-600 focus:ring-violet-600/20"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-stone-600 cursor-pointer">
                    Keep me signed in for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-stone-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Options - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-stone-600 text-sm">Google</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('microsoft')}
                  className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                    <path fill="#7FBA00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                    <path fill="#00A4EF" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                    <path fill="#FFB900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                  </svg>
                  <span className="text-stone-600 text-sm">Microsoft</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-stone-600 text-sm">Facebook</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  className="py-3 px-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="text-stone-600 text-sm">Apple</span>
                </button>
              </div>

              <p className="text-center mt-8 text-stone-600">
                Don&apos;t have an account?
                <Link href="/onboarding" className="text-violet-600 hover:text-violet-700 transition-colors font-medium ml-1">
                  Sign up
                </Link>
              </p>
            </div>

            <p className="text-center text-sm text-stone-500 mt-6">
              By signing in, you agree to our
              <Link href="#" className="text-violet-600 hover:underline mx-1">Terms of Service</Link>
              and
              <Link href="#" className="text-violet-600 hover:underline ml-1">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}