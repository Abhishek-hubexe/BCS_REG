import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, MapPin, Clock, Users, ArrowRight, Search, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';

export default function EventsExplorer({ events = [], clubs = [], onSelectClub, onNavigate }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');

  const filteredEvents = events.filter((evt) => {
    const matchesClub = selectedClubFilter === 'All' || evt.club_name === selectedClubFilter;
    const matchesSearch =
      !searchQuery ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClub && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('discovery')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clubs
      </button>

      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] text-[#C25E42] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collegiate Calendar</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
            Campus Events & Gatherings
          </h1>
          <p className="text-sm sm:text-base text-[#78716C] max-w-xl">
            Keynotes, technical hackathons, artistic revues, and open auditions across all collegiate societies.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-md bg-[#F4EFEA] border border-[#E7E0D8]">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-white text-[#1C1917] shadow-subtle' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'calendar' ? 'bg-white text-[#1C1917] shadow-subtle' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar Grid</span>
          </button>
        </div>
      </motion.div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by keyword or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            className="editorial-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#78716C]">Society:</span>
          <select
            value={selectedClubFilter}
            onChange={(e) => setSelectedClubFilter(e.target.value)}
            className="editorial-input py-1.5 text-xs bg-white w-auto"
          >
            <option value="All">All Societies</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      {viewMode === 'list' && (
        <div className="relative border-l border-[#EAD8D2] ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12 py-4">
          {filteredEvents.length === 0 ? (
            <div className="editorial-card p-12 text-center bg-white border-[#E7E0D8]">
              <p className="text-sm text-[#78716C]">No events match your selected filters.</p>
            </div>
          ) : (
            filteredEvents.map((evt, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: (index % 5) * 0.1 }}
                key={evt.id}
                className="relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[37px] sm:-left-[53px] top-6 w-3.5 h-3.5 rounded-full border-2 border-[#FAF8F5] bg-[#C25E42] group-hover:scale-125 transition-transform" />
                
                <div className="editorial-card-interactive p-6 bg-white hover:border-[#C25E42] transition-colors border-[#E7E0D8]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#C25E42] uppercase tracking-wider">{evt.date}</span>
                        <span className="w-1 h-1 bg-[#E7E0D8] rounded-full" />
                        <span className="text-xs text-[#78716C]">{evt.club_name}</span>
                      </div>
                      
                      <h3 className="font-serif text-2xl font-bold text-[#1C1917]">{evt.title}</h3>
                      <p className="text-sm text-[#78716C] max-w-2xl leading-relaxed">{evt.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#1C1917] pt-2">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#A8A29E]" /> {evt.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#A8A29E]" /> {evt.location}</span>
                        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#A8A29E]" /> {evt.registered_count || 0} / {evt.capacity} seats</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
                      <button
                        onClick={() => onNavigate('register')}
                        className="w-full px-6 py-2.5 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center justify-center gap-1.5"
                      >
                        <span>RSVP / Register</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="w-full px-6 py-2.5 bg-white border border-[#E7E0D8] text-[#1C1917] text-xs font-medium rounded hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="editorial-card p-6 bg-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E0D8]">
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">October 2026 Schedule</h3>
            <span className="text-xs text-[#78716C]">{filteredEvents.length} Gatherings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredEvents.map((evt, index) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: (index % 6) * 0.05 }}
                key={evt.id} 
                className="p-4 rounded-lg border border-[#E7E0D8] bg-[#FAF8F5] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C25E42]">{evt.date}</span>
                  <Badge variant="neutral" size="xs">{evt.category}</Badge>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1C1917] line-clamp-2">{evt.title}</h4>
                <p className="text-[11px] text-[#78716C] line-clamp-2">{evt.description}</p>
                <div className="text-[10px] text-[#A8A29E] space-y-0.5 pt-2 border-t border-[#E7E0D8]">
                  <p>📍 {evt.location}</p>
                  <p>⏰ {evt.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
