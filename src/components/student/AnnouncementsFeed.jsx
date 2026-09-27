import React, { useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../common/Badge';

export default function AnnouncementsFeed({ announcements = [], clubs = [], onNavigate }) {
  const [filter, setFilter] = useState('All');
  
  const filters = ['All', 'General', 'Auditions', 'Opportunities'];

  // Dummy announcements if none provided
  const displayAnnouncements = announcements.length > 0 ? announcements : [
    { id: 1, title: 'Orientation Week 2026', club_name: 'BEC Creative Spectrum', date: '2026-09-20', category: 'General', description: 'Welcome to the new academic year. Join us for orientation week across all venues.' },
    { id: 2, title: 'Club Auditions Open', club_name: 'BEC Swara', date: '2026-09-18', category: 'Auditions', description: 'Auditions for vocalists, instrumentalists and performers are now live.' },
    { id: 3, title: 'Call for Volunteers', club_name: 'Creative Spectrum', date: '2026-09-15', category: 'Opportunities', description: 'Be part of something bigger. We need volunteers for upcoming fests.' },
    { id: 4, title: 'Technical Workshop', club_name: 'Developers Club', date: '2026-09-10', category: 'General', description: 'Hands-on workshop for interested students on building web apps.' }
  ];

  const filteredAnnouncements = filter === 'All' 
    ? displayAnnouncements 
    : displayAnnouncements.filter(a => a.category === filter);

  return (
    <div className="flex-1 flex flex-col py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Announcements
        </h1>
        <p className="text-base text-[#78716C] mt-2 italic font-serif">
          "Updates. Opportunities. Community."
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <Filter className="w-4 h-4 text-[#C25E42] shrink-0" />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-[#C25E42] text-white' 
                : 'bg-white border border-[#E7E0D8] text-[#78716C] hover:border-[#C25E42] hover:text-[#1C1917]'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.1 }}
            key={item.id} 
            className="editorial-card-interactive p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="neutral" size="xs">{item.category}</Badge>
                <span className="text-xs text-[#A8A29E] font-medium">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#C25E42] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#C25E42] font-semibold tracking-wide uppercase mt-1">
                {item.club_name}
              </p>
              <p className="text-sm text-[#78716C] mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="sm:pl-4 flex items-center justify-end">
              <div className="w-10 h-10 rounded-full border border-[#E7E0D8] flex items-center justify-center group-hover:bg-[#FAF0ED] group-hover:border-[#C25E42] transition-colors">
                <ChevronRight className="w-5 h-5 text-[#C25E42]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center border-t border-[#E7E0D8] pt-8">
        <p className="font-['Caveat',cursive] italic text-[#C25E42] text-2xl">
          “Small updates.<br/>Bigger possibilities.”
        </p>
      </div>
    </div>
  );
}
