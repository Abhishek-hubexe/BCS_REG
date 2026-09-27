import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, CheckCircle2, User, BookOpen, Layers, Heart, FileText, Sparkles, Search, Plus, X, Rocket, Trophy, Zap } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function RegistrationFlow({
  clubs = [],
  currentUser,
  preSelectedClubId = null,
  onCompleteRegistration,
  onNavigate
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    usn: '',
    department: 'CS',
    year: '1st Year',
    section: 'A',
    selectedClubs: preSelectedClubId ? [preSelectedClubId] : [],
    interests: []
  });

  const [clubSearch, setClubSearch] = useState('');
  const [customInterest, setCustomInterest] = useState('');

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Academic', icon: BookOpen },
    { number: 3, title: 'Clubs', icon: Layers },
    { number: 4, title: 'Interests', icon: Heart },
    { number: 5, title: 'Review', icon: FileText },
    { number: 6, title: 'Confirmation', icon: CheckCircle2 }
  ];

  const interestOptions = [
    'Technical & Coding',
    'Creative & UI/UX',
    'Cultural & Theatre',
    'Competitive Sports',
    'Photojournalism & Media',
    'Music & Production',
    'Public Speaking & Debating'
  ];

  // Motivational banners for each step
  const stepMotivation = {
    1: { emoji: '👋', headline: 'Let\'s get to know you!', color: '#C25E42' },
    2: { emoji: '🎓', headline: 'Your academic identity matters.', color: '#5D7A68' },
    3: { emoji: '🚀', headline: 'Pick your tribes!', color: '#C28B38' },
    4: { emoji: '💡', headline: 'What sparks your curiosity?', color: '#7C5CBF' },
    5: { emoji: '✅', headline: 'Almost there — one final look!', color: '#5D7A68' }
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, trimmed] }));
      setCustomInterest('');
    }
  };

  const handleCustomInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  // Validation
  const validateStep = (step) => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.name.trim()) return 'Please provide your full name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please provide a valid college email.';
      if (!formData.phone.trim()) return 'Please provide your WhatsApp phone number.';
    }
    if (step === 2) {
      if (!formData.usn.trim()) return 'Please provide your University Student Number (USN / ID).';
      if (!formData.department) return 'Please specify your academic department.';
    }
    if (step === 3) {
      if (clubs.length > 0 && formData.selectedClubs.length === 0) {
        return 'Please select at least one club to submit registration.';
      }
      if (formData.selectedClubs.length > 2) {
        return 'Institutional Rule: Each student can join a maximum of 2 clubs.';
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMessage(err);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setErrorMessage('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleClubSelection = (clubId) => {
    setErrorMessage('');
    const targetClub = clubs.find((c) => c.id === clubId);
    if (!targetClub) return;

    setFormData((prev) => {
      const exists = prev.selectedClubs.includes(clubId);
      if (exists) {
        return { ...prev, selectedClubs: prev.selectedClubs.filter((id) => id !== clubId) };
      }

      const currentSelectedClubs = clubs.filter((c) => prev.selectedClubs.includes(c.id));

      if (currentSelectedClubs.length >= 2) {
        setErrorMessage('Membership rule: You can join a maximum of 2 clubs.');
        return prev;
      }

      return { ...prev, selectedClubs: [...prev.selectedClubs, clubId] };
    });
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/clubs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.role === 'student' ? currentUser?.id : undefined,
          clubIds: formData.selectedClubs,
          studentInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            usn: formData.usn,
            department: formData.department,
            year: formData.year,
            avatar: formData.avatar
          },
          interests: formData.interests
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const regCode = data.registrations?.[0]?.reg_code || `REG-2026-${Math.floor(100 + Math.random() * 900)}`;
      setConfirmationData({
        regCode,
        user: data.user,
        selectedClubs: clubs.filter((c) => formData.selectedClubs.includes(c.id))
      });

      if (onCompleteRegistration) {
        onCompleteRegistration(data);
      }

      setCurrentStep(6);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredClubsForSelection = clubs.filter((c) =>
    c.name.toLowerCase().includes(clubSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(clubSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full space-y-10">
      {/* STEPPER HEADER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] text-[#C25E42] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collegiate Onboarding Wizard</span>
          </div>
          <span className="text-xs font-medium text-[#78716C]">
            Step 0{currentStep} of 06
          </span>
        </div>

        {/* Stepper pills */}
        <div className="grid grid-cols-6 gap-2">
          {steps.map((step) => {
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div
                key={step.number}
                className={`h-1.5 rounded-full transition-all ${
                  isDone ? 'bg-[#5D7A68]' : isCurrent ? 'bg-[#C25E42]' : 'bg-[#E7E0D8]'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-[#78716C] pt-1 font-medium hidden sm:flex">
          {steps.map((s) => (
            <span
              key={s.number}
              className={`${currentStep === s.number ? 'text-[#C25E42] font-semibold' : ''}`}
            >
              0{s.number} {s.title}
            </span>
          ))}
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-md bg-[#FDF1EF] border border-[#F0C9C2] text-[#963526] text-xs font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="underline text-[11px]">Dismiss</button>
        </div>
      )}

      {/* FORM CARD CONTAINER */}
      <div className="editorial-card p-8 sm:p-10 bg-white border-[#E7E0D8] space-y-8 overflow-hidden">
        {/* MOTIVATIONAL BANNER */}
        {currentStep < 6 && stepMotivation[currentStep] && (
          <motion.div
            key={`banner-${currentStep}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg border border-[#E7E0D8]"
            style={{ background: `${stepMotivation[currentStep].color}08` }}
          >
            <span className="text-2xl">{stepMotivation[currentStep].emoji}</span>
            <span className="text-sm font-medium" style={{ color: stepMotivation[currentStep].color }}>
              {stepMotivation[currentStep].headline}
            </span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
        {/* STEP 1: PERSONAL */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Personal Identity
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                Your info helps club leads reach you with audition schedules and exclusive updates. ✨
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Full Name <span className="text-[#C25E42]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  College Mail ID <span className="text-[#C25E42]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  WhatsApp Phone Number <span className="text-[#C25E42]">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="editorial-input"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ACADEMIC */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Academic Affiliation
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                This helps clubs verify eligibility and schedule around your timetable. 📚
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  University Student Number (USN / ID) <span className="text-[#C25E42]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.usn}
                  onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                  className="editorial-input uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Department / Branch <span className="text-[#C25E42]">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="editorial-input bg-white"
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

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Academic Year <span className="text-[#C25E42]">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="editorial-input bg-white"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CLUB SELECTION */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  Select Your Clubs
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                  Each student can join up to <strong>2 clubs</strong>: exactly <strong>1 Technical</strong> and <strong>1 Cultural</strong>.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#C25E42] bg-[#FAF0ED] px-3 py-1 rounded-full w-fit">
                {formData.selectedClubs.length} / 2 Selected
              </span>
            </div>

            {/* Rule Callout Banner */}
            <div className="p-3 bg-[#FAF0ED] border border-[#EAD8D2] rounded-md text-xs text-[#A94E35] flex items-center justify-between">
              <span>
                <strong>Institutional Rule:</strong> Maximum 2 clubs per student — 1 Technical &amp; 1 Cultural (cannot join 2 of the same category).
              </span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter societies by name or category..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                className="editorial-input text-xs"
              />
            </div>

            {/* Club Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {clubs.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 text-center py-10 bg-white border border-[#E7E0D8] rounded-lg p-6">
                  <p className="font-serif font-bold text-sm text-[#1C1917] mb-1">No clubs chartered yet</p>
                  <p className="text-xs text-[#78716C]">You can complete your general student enrollment profile now, and register for clubs once chartered.</p>
                </div>
              ) : (
                filteredClubsForSelection.map((club) => {
                const isSelected = formData.selectedClubs.includes(club.id);
                return (
                  <div
                    key={club.id}
                    onClick={() => toggleClubSelection(club.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#C25E42] bg-[#FAF0ED]/40 ring-1 ring-[#C25E42]'
                        : 'border-[#E7E0D8] bg-white hover:border-[#D4CBC0]'
                    }`}
                  >
                    <ClubLogo
                      src={club.logo}
                      name={club.name}
                      size="md"
                      accentColor={club.accent_color}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-bold text-[#1C1917] truncate">
                          {club.name}
                        </h4>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                            isSelected
                              ? 'bg-[#C25E42] border-[#C25E42] text-white'
                              : 'border-[#E7E0D8] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <span className="text-[11px] text-[#78716C] block">{club.category}</span>
                      <p className="text-[11px] text-[#78716C] line-clamp-1 mt-1">
                        {club.tagline || club.description}
                      </p>
                    </div>
                  </div>
                );
              }))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: INTERESTS */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Interests & Skill Tracks
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                Select what excites you — or add your own! Club leads use this to tailor workshops for you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {interestOptions.map((opt) => {
                const isChecked = formData.interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`p-3.5 text-left rounded-lg border text-xs font-medium transition-all group ${
                      isChecked
                        ? 'border-[#C25E42] bg-[#FAF0ED] text-[#C25E42] font-semibold shadow-sm'
                        : 'border-[#E7E0D8] bg-white text-[#78716C] hover:border-[#C25E42] hover:bg-[#FDF9F7] hover:text-[#1C1917]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#C25E42]" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CUSTOM INTEREST INPUT */}
            <div className="pt-4 border-t border-[#E7E0D8] space-y-3">
              <label className="block text-xs font-semibold text-[#1C1917]">
                ✨ Have something else in mind? Add your own interest:
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={handleCustomInterestKeyDown}
                    placeholder="e.g. Robotics, AI Research, Dance, Photography..."
                    className="editorial-input text-xs pr-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={!customInterest.trim()}
                  className="px-4 py-2.5 bg-[#C25E42] text-white rounded-md text-xs font-medium hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Custom tags display */}
              {formData.interests.filter(i => !interestOptions.includes(i)).length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C] self-center mr-1">Your interests:</span>
                  {formData.interests.filter(i => !interestOptions.includes(i)).map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-xs font-medium text-[#C25E42]"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className="hover:bg-[#C25E42] hover:text-white rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 5: REVIEW */}
        {currentStep === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                Review Your Information
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                Review all entries before submitting. You can navigate back to modify any section.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm divide-y divide-[#E7E0D8]">
              {/* Personal Summary */}
              <div className="pt-3 flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#78716C]">
                    Personal Identity
                  </span>
                  <p className="font-semibold text-[#1C1917] mt-0.5">{formData.name}</p>
                  <p className="text-[#78716C]">{formData.email} · {formData.phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#C25E42] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Academic Summary */}
              <div className="pt-3 flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#78716C]">
                    Academic Details
                  </span>
                  <p className="font-semibold text-[#1C1917] mt-0.5">{formData.usn}</p>
                  <p className="text-[#78716C]">{formData.department} · {formData.year}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#C25E42] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Clubs Selected */}
              <div className="pt-3 flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#78716C]">
                    Selected Clubs ({formData.selectedClubs.length})
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {clubs
                      .filter((c) => formData.selectedClubs.includes(c.id))
                      .map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E7E0D8] text-xs font-medium text-[#1C1917]"
                        >
                          <ClubLogo src={c.logo} name={c.name} size="xs" accentColor={c.accent_color} />
                          {c.name}
                        </span>
                      ))}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#C25E42] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 6: CONFIRMATION */}
        {currentStep === 6 && confirmationData && (
          <motion.div
            key="step-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col gap-8 justify-center items-center py-12"
          >
            {/* Content */}
            <div className="w-full max-w-xl flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#FAF0ED] text-[#C25E42] flex items-center justify-center border border-[#EAD8D2]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  Application Recorded
                </h2>
                <p className="text-sm text-[#78716C] mt-2 leading-relaxed">
                  You’re officially on your way. Your registrations have been sent to the society leads. Please await further instructions for your auditions.
                </p>
              </div>

              <div className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D8] space-y-3 text-left">
                <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-wider block">
                  Application Summary
                </span>
                <div className="space-y-2">
                  {confirmationData.selectedClubs.map((club, idx) => (
                    <div key={club.id} className={`flex justify-between items-center text-xs ${idx > 0 ? 'pt-2 border-t border-[#E7E0D8]' : ''}`}>
                      <span className="font-medium text-[#1C1917]">{club.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-4 bg-[#C25E42] text-white rounded font-semibold text-sm hover:bg-[#A94E35] transition-colors flex items-center justify-center gap-2 shadow-subtle mt-4"
              >
                Go to Profile
              </button>
            </div>
          </motion.div>
        )}

        </AnimatePresence>

        {/* STEP CONTROLS (STEPS 1-5) */}
        {currentStep < 6 && (
          <div className="pt-6 border-t border-[#E7E0D8] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#C25E42] text-white rounded text-xs font-medium hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-[#C25E42] text-white rounded text-xs font-medium hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Transmitting...' : 'Confirm & Submit Application'}</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
