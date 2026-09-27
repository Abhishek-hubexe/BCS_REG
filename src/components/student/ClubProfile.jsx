import React, { useState } from 'react';
import { ArrowLeft, Users, Calendar, Award, CheckCircle2, Globe, Github, Instagram, Linkedin, Mail, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';
import ScrapbookFrame from '../common/ScrapbookFrame';

export default function ClubProfile({
  club,
  events = [],
  onBack,
  onJoinClub,
  isRegistered = false
}) {
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!club) return null;

  const clubEvents = events.filter((e) => e.club_id === club.id);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'membership', label: 'Membership' }
  ];

  return (
    <ScrapbookFrame scrapbookImages={club.scrapbook_images}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Guilds Directory</span>
        </button>

        {/* HERO SECTION WITH COVER & IDENTITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="editorial-card overflow-hidden bg-white"
        >
          {/* Cover image banner */}
          <div className="h-64 sm:h-80 w-full relative bg-[#E7E0D8]">
            <img
              src={club.cover_image}
              alt={`${club.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="terracotta">{club.category}</Badge>
            </div>
          </div>

          {/* Identity & Action bar */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 sm:-mt-16 mb-6">
              <div className="flex items-end gap-5">
                <div className="p-1 rounded-lg bg-white border-2 border-[#FAF8F5] shadow-card">
                  <ClubLogo
                    src={club.logo}
                    name={club.name}
                    size="xl"
                    accentColor={club.accent_color}
                    className="rounded-md"
                  />
                </div>
                <div className="mb-1">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] leading-tight">
                    {club.name}
                  </h1>
                  <p className="text-sm text-[#78716C] mt-1">{club.tagline}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-4 py-2 text-xs font-medium rounded-md border transition-colors ${isFollowing
                      ? 'bg-[#FAF0ED] text-[#C25E42] border-[#EAD8D2]'
                      : 'bg-white text-[#1C1917] border-[#E7E0D8] hover:bg-[#F4EFEA]'
                    }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>

                <button
                  onClick={() => onJoinClub(club)}
                  disabled={isRegistered}
                  className={`px-5 py-2 text-xs font-medium rounded-md transition-all shadow-subtle flex items-center gap-1.5 ${isRegistered
                      ? 'bg-[#EEF3F0] text-[#5D7A68] border border-[#C8D9CE] cursor-default'
                      : 'bg-[#C25E42] text-white hover:bg-[#A94E35]'
                    }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <>
                      <span>View Audition Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metadata chips */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#78716C] pt-4 border-t border-[#E7E0D8]">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C25E42]" />
                <strong className="text-[#1C1917]">{club.members_count}</strong> Active Members
              </span>

            </div>
          </div>
        </motion.div>

        {/* TABS NAVIGATION */}
        <div className="border-b border-[#E7E0D8]">
          <nav className="flex items-center gap-8 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'border-[#C25E42] text-[#C25E42] font-semibold'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pt-2"
          >
            {/* TAB 1: ABOUT (Two-column editorial layout) */}
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                  <div className="editorial-card p-8 bg-white space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Charter & Purpose</h3>
                    <p className="text-sm text-[#78716C] leading-relaxed font-normal">
                      {club.description}
                    </p>
                    <p className="text-sm text-[#78716C] leading-relaxed">
                      Founded as part of the Creative Spectrum collegiate initiative, this guild focuses on elevating undergraduate practical competencies, connecting students with cross-disciplinary peers, and hosting benchmark campus symposiums.
                    </p>
                  </div>


                </div>

                {/* Sidebar info */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="editorial-card p-6 bg-white space-y-4">
                    <h4 className="font-serif text-xl font-bold text-[#1C1917]">Leadership Council</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-[#78716C] block">Lead</span>
                        <span className="font-semibold text-[#1C1917]">{club.president || 'Elected Lead'}</span>
                      </div>
                      <div>
                        <span className="text-[#78716C] block">Co-lead of club</span>
                        <span className="font-semibold text-[#1C1917]">{club.vice_president || 'Elected Deputy'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="editorial-card p-6 bg-[#FAF0ED] border-[#EAD8D2] space-y-3">
                    <h4 className="font-serif text-base font-bold text-[#C25E42]">Join This Circle</h4>
                    <p className="text-xs text-[#78716C] leading-relaxed">
                      Ready to contribute your talents? Auditions and cohort applications are open for the current term.
                    </p>
                    <button
                      onClick={() => onJoinClub(club)}
                      className="w-full py-2.5 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors shadow-subtle"
                    >
                      View Audition Details
                    </button>
                  </div>
                </div>
              </div>
            )}




            {/* TAB 7: MEMBERSHIP */}
            {activeTab === 'membership' && (
              <div className="editorial-card p-8 bg-white space-y-6 max-w-3xl">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">Joining Criteria & Process</h3>
                  <p className="text-xs text-[#78716C]">Please review the membership standards before registering.</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#78716C] leading-relaxed">
                  <div className="p-4 rounded bg-[#FAF8F5] border border-[#E7E0D8]">
                    <strong className="text-[#1C1917] block mb-1">Eligibility:</strong>
                    {club.eligibility || 'Open to all enrolled undergraduate and postgraduate students.'}
                  </div>

                  <div className="p-4 rounded bg-[#FAF8F5] border border-[#E7E0D8]">
                    <strong className="text-[#1C1917] block mb-1">Audition & Evaluation:</strong>
                    {club.membership_info || 'Short initial portfolio or coding round followed by leadership conversation.'}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => onJoinClub(club)}
                      className="px-6 py-3 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors"
                    >
                      Proceed to Register for {club.name}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </ScrapbookFrame>
  );
}
