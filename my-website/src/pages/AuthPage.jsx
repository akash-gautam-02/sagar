import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPInput from '../components/auth/OTPInput';
import Button from '../components/ui/Button';
import { Phone, Mail, ArrowRight, ShieldCheck, Zap, Globe, Layout as LayoutIcon, User, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import authBanner from './auth_banner_image_1775065056800.png';

const AuthPage = () => {
  const { authStep, sendOTP, verifyOTP, setAuthStep, loading, identifier: storedIdentifier, authType } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSendOTP = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!inputValue) {
      setError(`Please enter your ${loginMethod}.`);
      return;
    }

    try {
      await sendOTP(inputValue);
    } catch (err) {
      setError(err);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setError('');
    try {
      const res = await verifyOTP(otp);
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-brand-white dark:bg-[#0F1115] transition-colors duration-500">
      <div id="recaptcha-container"></div>
      {/* Left Side: Brand Visuals (Desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-brand-black relative overflow-hidden">
        <img 
          src={authBanner} 
          alt="Digital Core Brand" 
          className="absolute inset-0 w-auto h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-br from-brand-accent/30 to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div className="font-syne font-bold text-2xl flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center">
              <Zap size={20} fill="currentColor" />
            </div>
            <span>DIGITALCORE</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-6xl font-syne font-bold leading-tight">
              Design the future <br /> 
              <span className="text-brand-accent">with us.</span>
            </h1>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-3">
                <Globe className="text-brand-accent" size={28} />
                <h4 className="font-syne font-bold text-lg">Global Reach</h4>
                <p className="text-sm text-gray-400 font-dm-sans leading-relaxed">Scaling brands across borders with elite digital design.</p>
              </div>
              <div className="space-y-3">
                <LayoutIcon className="text-brand-accent" size={28} />
                <h4 className="font-syne font-bold text-lg">Smart UI/UX</h4>
                <p className="text-sm text-gray-400 font-dm-sans leading-relaxed">Custom dashboards built for high-performance data tracking.</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 font-dm-sans flex items-center gap-4">
            <span>© 2024 DigitalCore Agency.</span>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center items-center px-6 sm:px-12 lg:px-24 py-8 lg:py-12 relative bg-white dark:bg-[#0F1115] min-h-screen transition-colors duration-500">
        
        {/* Mobile Header - Now part of flow on mobile to prevent overlap */}
        <div className="lg:hidden w-full mb-12 flex justify-start items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-syne font-bold text-xl text-brand-black dark:text-white">DIGITAL<span className="text-brand-accent">CORE</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {authStep === 'login' ? (
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-syne font-bold text-brand-black dark:text-white tracking-tight text-center sm:text-left">
                  {activeTab === 'login' ? 'Welcome back' : 'Start your journey'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-dm-sans text-base sm:text-lg text-center sm:text-left">
                  {activeTab === 'login' ? 'Sign in to your premium dashboard.' : 'Join the elite 1% of digital pioneers.'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl">
                {['login', 'register'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "flex-1 py-3 text-sm font-bold font-syne rounded-xl transition-all duration-300 uppercase tracking-wider",
                      activeTab === tab ? "bg-white dark:bg-brand-accent text-brand-black dark:text-white shadow-sm" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Input Method Switcher */}
              <div className="flex justify-center gap-4 text-sm font-dm-sans border-b border-gray-100 dark:border-white/5 pb-2">
                <button 
                  onClick={() => setLoginMethod('phone')}
                  className={clsx(
                    "flex items-center gap-2 pb-2 px-4 transition-all border-b-2",
                    loginMethod === 'phone' ? "border-brand-accent text-brand-black dark:text-white font-bold" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  )}
                >
                  <Phone size={16} /> Phone
                </button>
                <button 
                  onClick={() => setLoginMethod('email')}
                  className={clsx(
                    "flex items-center gap-2 pb-2 px-4 transition-all border-b-2",
                    loginMethod === 'email' ? "border-brand-accent text-brand-black dark:text-white font-bold" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  )}
                >
                  <Mail size={16} /> Email
                </button>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
                    {loginMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors">
                      {loginMethod === 'phone' ? <Phone size={20} /> : <Mail size={20} />}
                    </div>
                    <input 
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      placeholder={loginMethod === 'phone' ? '+91 00000 00000' : 'john@digitalcore.agency'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-brand-accent focus:bg-white dark:focus:bg-brand-black rounded-2xl outline-none transition-all font-dm-sans text-brand-black dark:text-white font-medium text-lg shadow-xs"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-500 text-sm font-medium ml-1 bg-red-50 p-3 rounded-lg border border-red-100"
                  >
                    {error}
                  </motion.p>
                )}

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full! py-4! text-lg! group rounded-2xl h-16" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {activeTab === 'login' ? `Continue with ${loginMethod}` : 'Create Account'}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="flex items-center gap-3 text-gray-400 text-xs px-2 pt-4 border-t border-gray-50">
                  <ShieldCheck size={16} className="shrink-0 text-brand-accent" />
                  <p className="leading-relaxed">Premium security protocol via {loginMethod === 'phone' ? 'Twilio' : 'Resend'}. Data is end-to-end encrypted.</p>
                </div>
              </form>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-brand-accent-light rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-accent shadow-sm">
                  <ShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-syne font-bold text-brand-black tracking-tight">One-Time Password</h2>
                <p className="text-gray-500 font-dm-sans text-lg">
                  Verification code sent to your {authType}: <br />
                  <span className="font-bold text-brand-black">{storedIdentifier}</span>
                </p>
              </div>

              <div className="space-y-8">
                <OTPInput length={6} onComplete={handleVerifyOTP} />
                
                {error && (
                  <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
                )}

                <div className="text-center space-y-6 pt-4">
                  <p className="text-sm text-gray-400 font-dm-sans">
                    Didn't receive the secure code? 
                    <button 
                      onClick={handleSendOTP}
                      className="ml-2 text-brand-accent font-bold hover:text-brand-accent-hover transition-colors"
                      disabled={loading}
                    >
                      RESEND CODE
                    </button>
                  </p>
                  
                  <button 
                    onClick={() => setAuthStep('login')}
                    className="flex items-center justify-center gap-2 mx-auto text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-black transition-all hover:-translate-x-1"
                  >
                    <ChevronLeft size={16} /> 
                    Back to {activeTab}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
