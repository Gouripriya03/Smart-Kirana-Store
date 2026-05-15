import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, ShoppingBasket, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole, AuthMode, User as UserType } from '@/src/types';

interface AuthPageProps {
  onAuth: (user: UserType) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onAuth({
        id: Math.random().toString(36).substr(2, 9),
        email,
        role
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-[1100px] bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-emerald-900/5 flex flex-col md:flex-row min-h-[700px] border border-emerald-100/50">
        
        {/* Left Side: Visual/Branding */}
        <div className="w-full md:w-[45%] bg-emerald-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
             <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="bg-emerald-600 p-2 rounded-xl border border-white/20">
                <Store className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SmartKirana</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold leading-[1.1] tracking-tight"
              >
                {mode === 'signin' ? 'Manage your daily essentials' : 'Digitalize your Kirana store'}
              </motion.h1>
              <p className="text-emerald-50/80 text-lg max-w-sm">
                The smartest way to shop for daily kirana essentials and manage your neighborhood store.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/30 p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Authentic Kirana Items</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/30 p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-sm font-medium text-emerald-50">Local Shop Efficiency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
               <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8">
                <button
                  onClick={() => setMode('signin')}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    mode === 'signin' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    mode === 'signup' ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-gray-500">
                Please enter your details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.CUSTOMER)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                    role === UserRole.CUSTOMER 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  )}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.SHOPKEEPER)}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                    role === UserRole.SHOPKEEPER
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  )}
                >
                  <Store className="w-5 h-5" />
                  <span className="font-semibold">Shopkeeper</span>
                </button>
              </div>

              <div className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    {mode === 'signin' && (
                      <button type="button" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
