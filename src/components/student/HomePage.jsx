import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Calendar, Users, Sparkles, MapPin, Clock, Quote, Compass, Instagram, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';
import CommunityChannels from '../common/CommunityChannels';

export default function HomePage({ clubs = [], events = [], spectrumConfig = {}, onNavigate, onSelectClub }) {
  const upcomingEvents = events.slice(0, 3);
  const totalMembers = clubs.reduce((sum, c) => sum + (c.members_count || 0), 0);

  /* === MOTION LAYER: Stat Count-Up === */
  const statsRef = useRef(null);
  const hasCountedRef = useRef(false);

  const animateCountUp = useCallback((el, target) => {
    const duration = 700;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!statsRef.current || hasCountedRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasCountedRef.current) {
          hasCountedRef.current = true;
          const counters = statsRef.current.querySelectorAll('[data-countup]');
          counters.forEach((el) => {
            const target = parseInt(el.getAttribute('data-countup'), 10);
            if (!isNaN(target)) animateCountUp(el, target);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [clubs.length, totalMembers, events.length, animateCountUp]);
  /* === END MOTION LAYER === */

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-8 pb-12 md:pt-14 md:pb-20 px-4 sm:px-6 lg:px-8 w-full overflow-hidden bg-[#EAD8D2]">
        {/* Campus Photo Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80" 
            alt="Campus Students Collaborating" 
            className="w-full h-full object-cover opacity-75 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-7"
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.05] uppercase">
              <span className="text-[#C25E42]">Many</span> Worlds.<br />
              One <span className="italic font-normal">Campus.</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl text-[#78716C] max-w-lg font-serif italic leading-relaxed"
            >
              Ideas. Art. Code. Stories. Beats.<br/>
              Find your people. Find your place.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={() => onNavigate('discovery')}
                className="px-8 py-4 bg-[#1C1917] text-white rounded-md text-sm font-semibold tracking-wider uppercase hover:bg-[#C25E42] transition-colors shadow-subtle flex items-center gap-2 group"
              >
                <span>Explore Clubs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="px-8 py-4 bg-white/80 backdrop-blur border border-[#E7E0D8] text-[#1C1917] rounded-md text-sm font-semibold tracking-wider uppercase hover:bg-white hover:border-[#D4CBC0] transition-colors flex items-center gap-2"
              >
                <span>View Events</span>
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="pt-8"
            >
              <p className="font-['Caveat',cursive] text-2xl text-[#C25E42] transform -rotate-2">
                "Different minds. Different stories."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section className="py-16 bg-[#F4EFEA] border-y border-[#E7E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 reveal-item">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#C25E42] uppercase">
                Curated Guilds
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
                Featured Communities
              </h2>
            </div>
            <button
              onClick={() => onNavigate('discovery')}
              className="mt-4 md:mt-0 text-sm font-medium text-[#C25E42] hover:text-[#A94E35] flex items-center gap-1 group"
            >
              <span>View all {clubs.length} clubs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {clubs.length === 0 ? (
              <div className="col-span-1 text-center py-12 bg-white rounded-lg border border-[#E7E0D8] p-8">
                <Compass className="w-8 h-8 text-[#C25E42] mx-auto mb-3 opacity-60" />
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">No chartered societies yet</h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-md mx-auto">
                  New student clubs and guilds will be featured here once registered by the administrative council.
                </p>
              </div>
            ) : (
              clubs.map((club, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
                  key={club.id}
                  onClick={() => onSelectClub(club)}
                  className="editorial-card group cursor-pointer flex flex-col h-full bg-white overflow-hidden hover:border-[#C25E42]"
                >
                  {/* Club Cover Image */}
                  <div className="h-48 w-full overflow-hidden bg-[#FAF8F5] relative">
                    <img
                      src={club.cover_image}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={club.category === 'Technical' ? 'terracotta' : 'neutral'}>
                        {club.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Club Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <ClubLogo
                          src={club.logo}
                          name={club.name}
                          size="md"
                          accentColor={club.accent_color}
                        />
                        <div>
                          <h3 className="font-serif text-xl font-bold text-[#1C1917] group-hover:text-[#C25E42] transition-colors leading-snug">
                            {club.name}
                          </h3>
                          <span className="text-xs text-[#78716C]">{club.members_count} Members</span>
                        </div>
                      </div>

                      <p className="text-sm text-[#78716C] line-clamp-2 leading-relaxed">
                        {club.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-between text-xs font-medium text-[#C25E42]">
                      <span>Explore Profile</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#C25E42] uppercase">
              What's Happening
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Upcoming Gatherings & Events
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="mt-4 md:mt-0 text-sm font-medium text-[#C25E42] hover:text-[#A94E35] flex items-center gap-1 group"
          >
            <span>Full event schedule</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="divide-y divide-[#E7E0D8] border-y border-[#E7E0D8]">
          {upcomingEvents.map((evt, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={evt.id}
              className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#FAF8F5] px-4 -mx-4 transition-colors rounded-md"
            >
              {/* Date Block */}
              <div className="flex items-center gap-6 min-w-[200px]">
                <div className="w-14 h-14 rounded border border-[#E7E0D8] bg-[#F4EFEA] flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C25E42]">
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="font-serif text-xl font-bold text-[#1C1917] leading-none">
                    {new Date(evt.date).getDate()}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-[#78716C] block">{evt.club_name}</span>
                  <Badge variant="neutral" size="xs" className="mt-0.5">
                    {evt.category}
                  </Badge>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex-1 max-w-xl">
                <h3 className="font-serif text-lg font-bold text-[#1C1917] hover:text-[#C25E42] transition-colors cursor-pointer">
                  {evt.title}
                </h3>
                <p className="text-xs text-[#78716C] line-clamp-1 mt-1 leading-relaxed">
                  {evt.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#78716C]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                    {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A8A29E]" />
                    {evt.location}
                  </span>
                </div>
              </div>

              {/* RSVP Action */}
              <div>
                <button
                  onClick={() => onNavigate('events')}
                  className="px-4 py-2 border border-[#E7E0D8] hover:border-[#C25E42] text-xs font-medium rounded text-[#1C1917] hover:text-[#C25E42] transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>




      {/* FINAL EDITORIAL CALL TO ACTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="p-12 sm:p-16 rounded-xl bg-[#FAF0ED] border border-[#EAD8D2] max-w-4xl mx-auto space-y-6"
        >
          <span className="text-xs font-semibold tracking-wider text-[#C25E42] uppercase">
            Fall 2026 Cohort
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917]">
            Your next chapter starts with a community.
          </h2>
          <p className="text-base text-[#78716C] max-w-xl mx-auto leading-relaxed">
            Whether your focus is algorithmic systems, visual design, stage drama, or athletics, discover where you belong today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3.5 bg-[#C25E42] text-white rounded-md text-sm font-medium hover:bg-[#A94E35] transition-all shadow-subtle inline-flex items-center gap-2 group"
            >
              <span>Begin Registration</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* DEDICATED SOCIAL & COMMUNITY CHANNELS SECTION */}
      <CommunityChannels spectrumConfig={spectrumConfig} />
    </div>
  );
}
