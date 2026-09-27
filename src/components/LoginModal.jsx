import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, LogIn, AlertCircle, User, UserPlus, Sparkles, ArrowRight, Hash, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating particle component
function Particle({ delay, size, x, y, duration }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0, 1, 1.2, 0],
        y: [y, y - 60 - Math.random() * 80],
        x: [x, x + (Math.random() - 0.5) * 40]
      }}
      transition={{ duration, delay, ease: "easeOut", repeat: Infinity, repeatDelay: Math.random() * 3 }}
      className="absolute rounded-full pointer-events-none"
      style={{ 
        width: size, 
        height: size, 
        left: `${x}%`, 
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(194,94,66,0.6) 0%, transparent 70%)`
      }}
    />
  );
}

// High Quality Success VFX Component
// High Quality Success VFX Component
function SuccessVFX() {
  const vibrantColors = ['#06b6d4', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    angle: (i / 80) * Math.PI * 2,
    speed: 1.5 + Math.random() * 3,
    size: 3 + Math.random() * 8,
    delay: Math.random() * 0.4,
    color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#030014]"
    >
      {/* Layered Shockwaves */}
      <motion.div
        initial={{ scale: 0, opacity: 1, borderWidth: '20px' }}
        animate={{ scale: [0, 15, 30], opacity: [1, 0.5, 0], borderWidth: ['20px', '2px', '0px'] }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-16 h-16 rounded-full border-cyan-400 mix-blend-screen"
      />
      <motion.div
        initial={{ scale: 0, opacity: 1, borderWidth: '15px' }}
        animate={{ scale: [0, 20], opacity: [1, 0], borderWidth: ['15px', '0px'] }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute w-16 h-16 rounded-full border-fuchsia-500 mix-blend-screen"
      />
      
      {/* Central Rotating Nebula Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: [0, 3, 2], opacity: [0, 0.8, 0], rotate: 180 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute w-80 h-80 rounded-full bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-cyan-400 via-fuchsia-500 to-indigo-500 blur-[80px] mix-blend-screen"
      />

      {/* High-velocity multi-color particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ 
            x: Math.cos(p.angle) * 400 * p.speed, 
            y: Math.sin(p.angle) * 400 * p.speed,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ duration: 1.8, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-sm shadow-[0_0_15px_currentColor]"
          style={{
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 2 : 1), // Some particles are lines
            backgroundColor: p.color,
            color: p.color
          }}
        />
      ))}

      {/* Holographic Badge */}
      <motion.div
        initial={{ scale: 0, rotateY: 270, y: 20 }}
        animate={{ scale: 1, rotateY: 0, y: 0 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.6 }}
        className="relative z-10 w-32 h-32 rounded-3xl bg-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-fuchsia-500/20" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.8)_360deg)] opacity-30" 
        />
        <div className="absolute inset-[2px] rounded-3xl bg-[#030014]/80 backdrop-blur-3xl z-0" />
        
        <Sparkles className="absolute -top-3 -right-3 w-10 h-10 text-cyan-300 animate-pulse z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <span className="text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-fuchsia-400 z-10 drop-shadow-sm">C</span>
      </motion.div>

      {/* Vibrant Success Text */}
      <motion.h3
        initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
        className="mt-10 text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 tracking-wide text-center"
      >
        Welcome to the Spectrum
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0em' }}
        animate={{ opacity: 1, letterSpacing: '0.4em' }}
        transition={{ duration: 1.2, delay: 1 }}
        className="mt-4 text-xs font-bold text-cyan-200/90 uppercase text-center"
      >
        Identity Established
      </motion.p>
    </motion.div>
  );
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('CS');
  const [year, setYear] = useState('1st Year');
  const [usn, setUsn] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showSuccessVfx, setShowSuccessVfx] = useState(false);
  const canvasRef = useRef(null);

  // Reset all input fields every time modal opens so sign-in credentials are required every time
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setUsn('');
      setPhone('');
      setError('');
    }
  }, [isOpen]);

  // Trigger intro animation when switching to register
  useEffect(() => {
    if (isRegister && isOpen) {
      setShowIntro(true);
      const timer = setTimeout(() => setShowIntro(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isRegister, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
    const bodyPayload = isRegister 
      ? { name, email, password, department, year, phone_whatsapp: phone, csn_esn: usn }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
      if (data.token) localStorage.setItem('cs_token', data.token);
      
      if (isRegister) {
        setShowSuccessVfx(true);
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
          setTimeout(() => setShowSuccessVfx(false), 500); // Reset after modal closes
        }, 2500);
      } else {
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.15,
    size: 3 + Math.random() * 5,
    x: 10 + Math.random() * 80,
    y: 30 + Math.random() * 60,
    duration: 2 + Math.random() * 2
  }));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Cinematic backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#0a0908]/80 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Main Container */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.85, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${isRegister ? 'max-w-3xl' : 'max-w-md'} rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
          style={{ perspective: '1200px' }}
        >
          
          <AnimatePresence>
            {showSuccessVfx && <SuccessVFX />}
          </AnimatePresence>

          {/* ===== INTRO FLASH OVERLAY ===== */}
          <AnimatePresence>
            {showIntro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1C1917] overflow-hidden"
              >
                {/* Radial pulse */}
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-48 h-48 rounded-full bg-[#C25E42]/40"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 6, opacity: 0 }}
                  transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
                  className="absolute w-32 h-32 rounded-full bg-white/10"
                />

                {/* Floating particles */}
                {particles.map((p, i) => (
                  <Particle key={i} {...p} />
                ))}

                {/* Center content */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 150, damping: 12 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C25E42] to-[#E8875A] flex items-center justify-center shadow-[0_0_60px_rgba(194,94,66,0.5)] relative z-10"
                >
                  <Sparkles className="w-9 h-9 text-white" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-6 text-xl font-serif font-bold text-white relative z-10"
                >
                  Let's build your identity
                </motion.p>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C25E42] to-transparent origin-center relative z-10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row min-h-[480px]">
            
            {/* ===== LEFT BRANDING PANEL ===== */}
            <AnimatePresence>
              {isRegister && !showIntro && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '40%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex flex-col justify-center bg-[#1C1917] relative overflow-hidden"
                >
                  {/* Animated orbiting glow */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[#C25E42]/15 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-30%] left-[-20%] w-64 h-64 bg-cyan-400/8 rounded-full blur-[60px]" />
                  </motion.div>

                  <div className="relative z-10 p-10 space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C25E42] to-[#E8875A] flex items-center justify-center shadow-[0_0_30px_rgba(194,94,66,0.3)]"
                    >
                      <span className="font-serif text-2xl font-bold text-white">C</span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-3xl font-bold font-serif text-white leading-snug"
                    >
                      Join the<br />
                      <span className="bg-gradient-to-r from-[#C25E42] to-[#E8875A] bg-clip-text text-transparent">Spectrum.</span>
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-sm text-white/50 leading-relaxed"
                    >
                      Your collegiate identity starts here. Unlock club auditions, events, and your academic portfolio.
                    </motion.p>

                    {/* Animated decorative dots */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="flex gap-2"
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 300 }}
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            background: i < 3 
                              ? `rgba(194,94,66,${1 - i * 0.3})` 
                              : `rgba(255,255,255,${0.15 - (i - 3) * 0.05})`
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== RIGHT FORM PANEL ===== */}
            <motion.div 
              layout
              className="flex-1 p-8 sm:p-12 relative bg-[#FAF8F5] flex flex-col justify-center"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-[#A8A29E] hover:text-[#1C1917] hover:bg-white/80 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <motion.div layout className="mb-8">
                <motion.h2 
                  layout
                  className="text-3xl font-bold font-serif text-[#1C1917] tracking-tight"
                >
                  {isRegister ? 'Create Profile' : 'Welcome Back'}
                </motion.h2>
                <p className="text-sm text-[#78716C] mt-2 font-medium">
                  {isRegister ? 'Set up your student profile to get started.' : 'Sign in to your dashboard and portfolio.'}
                </p>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }} 
                    animate={{ opacity: 1, y: 0, height: 'auto' }} 
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-5 p-4 rounded-xl bg-[#FDF1EF] border border-[#F0C9C2] text-[#963526] text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm" autoComplete="off">
                {/* Registration fields */}
                <AnimatePresence mode="popLayout">
                  {isRegister && !showIntro && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4 overflow-hidden"
                    >
                      {/* Full Name */}
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C25E42] transition-colors" />
                          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder=""
                            readOnly onFocus={(e) => e.target.removeAttribute('readOnly')}
                            className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 pl-11 pr-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium hover:border-[#C25E42]/40" />
                        </div>
                      </motion.div>

                      {/* Dept + Year row */}
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">Department</label>
                          <select value={department} onChange={(e) => setDepartment(e.target.value)}
                            className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 px-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium appearance-none hover:border-[#C25E42]/40 cursor-pointer">
                            <option value="CS">CS</option>
                            <option value="AIML">AIML</option>
                            <option value="MECH">MECH</option>
                            <option value="EEE">EEE</option>
                            <option value="ECS">ECS</option>
                            <option value="ECE">ECE</option>
                            <option value="IS">IS</option>
                            <option value="BT">BT</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">Year</label>
                          <select value={year} onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 px-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium appearance-none hover:border-[#C25E42]/40 cursor-pointer">
                            <option>1st Year</option>
                            <option>2nd Year</option>
                            <option>3rd Year</option>
                            <option>4th Year</option>
                          </select>
                        </div>
                      </motion.div>

                      {/* USN / ID and WhatsApp row */}
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">USN / ID</label>
                          <div className="relative group">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C25E42] transition-colors" />
                            <input type="text" required value={usn} onChange={(e) => setUsn(e.target.value)} placeholder=""
                              readOnly onFocus={(e) => e.target.removeAttribute('readOnly')}
                              className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 pl-11 pr-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium hover:border-[#C25E42]/40" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">WhatsApp</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C25E42] transition-colors" />
                            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder=""
                              readOnly onFocus={(e) => e.target.removeAttribute('readOnly')}
                              className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 pl-11 pr-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium hover:border-[#C25E42]/40" />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email or Username */}
                <div>
                  <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">
                    {isRegister ? 'College Email' : 'Email / Username'}
                  </label>
                  <div className="relative group">
                    {/* Hidden input to trick browser autofill */}
                    <input type="email" style={{display: 'none'}} autoComplete="email" />
                    
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C25E42] transition-colors" />
                    <input type={isRegister ? "email" : "text"} name="bcs_user_email_unique" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" autoComplete="off"
                      readOnly onFocus={(e) => e.target.removeAttribute('readOnly')}
                      className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 pl-11 pr-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium hover:border-[#C25E42]/40" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[#57534E] text-[10px] font-bold mb-1.5 uppercase tracking-widest">Password</label>
                  <div className="relative group">
                    {/* Hidden input to trick browser autofill */}
                    <input type="password" style={{display: 'none'}} autoComplete="new-password" />
                    
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C25E42] transition-colors" />
                    <input type="password" name="bcs_user_password_unique" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" autoComplete="new-password"
                      readOnly onFocus={(e) => e.target.removeAttribute('readOnly')}
                      className="w-full bg-white border border-[#E7E0D8] rounded-xl py-3 pl-11 pr-4 text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C25E42]/20 focus:border-[#C25E42] transition-all shadow-sm font-medium hover:border-[#C25E42]/40" />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-[#C25E42] to-[#D4714F] hover:from-[#A94E35] hover:to-[#C25E42] text-white font-bold text-sm shadow-[0_8px_24px_-8px_rgba(194,94,66,0.5)] transition-all flex items-center justify-center gap-2.5 group"
                >
                  {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{loading ? 'Processing...' : isRegister ? 'Create Profile' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </motion.button>
              </form>

              {/* Toggle */}
              <div className="mt-8 text-center">
                <p className="text-xs text-[#78716C]">
                  {isRegister ? 'Already have a profile?' : 'New student?'}
                </p>
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  className="mt-1.5 text-sm font-bold text-[#C25E42] hover:text-[#A94E35] transition-colors underline decoration-2 underline-offset-4 decoration-[#C25E42]/30 hover:decoration-[#C25E42]"
                >
                  {isRegister ? 'Sign in instead' : 'Create your profile →'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
