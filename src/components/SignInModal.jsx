import React, { useState } from 'react';
import { X, User, Mail, Building, Calendar, Phone, Hash, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import BCSLogo from './BCSLogo';

export default function SignInModal({ isOpen, onClose, onSuccessRegistration }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'CS',
    year: '1st Year',
    phone_whatsapp: '',
    csn_esn: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Create Password and Confirm Password do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      onSuccessRegistration(data.message || 'Registration successful! You can now log in.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <BCSLogo className="w-12 h-12" animated={false} />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">Student Registration</h2>
          <p className="text-xs text-cyan-300">Create your account to register for club auditions</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          {/* 2. Mail ID */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Mail ID *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          {/* 3 & 4. Department & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Department *</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input bg-[#0f172a] text-white"
                >
                  <option value="EEE">EEE</option>
                  <option value="ECE">ECE</option>
                  <option value="CS">CS</option>
                  <option value="ECS">ECS</option>
                  <option value="ME">ME</option>
                  <option value="CV">CV</option>
                  <option value="IS">IS</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="BT">BT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">Year *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input bg-[#0f172a] text-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5 & 6. Phone (WhatsApp) & CSN/ESN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Phone Number (WhatsApp) *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone_whatsapp"
                  required
                  value={formData.phone_whatsapp}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">CSN / ESN *</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="csn_esn"
                  required
                  value={formData.csn_esn}
                  onChange={handleChange}
                  placeholder="CSN2026001 / ESN99"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          {/* 7 & 8. Create Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input"
                />
              </div>
            </div>
          </div>

          {/* Submit Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'SIGN IN / REGISTER'}
          </button>
        </form>
      </div>
    </div>
  );
}
