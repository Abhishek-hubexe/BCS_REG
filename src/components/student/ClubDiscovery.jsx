import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, Users, Calendar, ShieldCheck, ChevronRight, BookOpen, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';
import ScrapbookFrame from '../common/ScrapbookFrame';
import MarkdownRenderer from '../common/MarkdownRenderer';

export default function ClubDiscovery({ clubs = [], events = [], onSelectClub, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular'); // 'popular', 'alpha', 'members'
  const [expandedClubIds, setExpandedClubIds] = useState({});

  const categories = [
    'All',
    'Technical',
    'Cultural'
  ];

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedClubIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter & sort clubs
  const filteredClubs = useMemo(() => {
    return clubs
      .filter((club) => {
        const matchesCategory =
          selectedCategory === 'All' || club.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery =
          !searchQuery ||
          club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          club.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (selectedSort === 'members') {
          const diff = (b.members_count || 0) - (a.members_count || 0);
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        }
        if (selectedSort === 'alpha') return a.name.localeCompare(b.name);
        // 'popular' — sort by member count desc, then alphabetical
        const diff = (b.members_count || 0) - (a.members_count || 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
  }, [clubs, selectedCategory, searchQuery, selectedSort]);

  return (
    <>
      {/* ── hero drift keyframes ── */}
      <style>{`
        @keyframes drift-1  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(10px,-12px)} }
        @keyframes drift-2  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-14px,8px)}  }
        @keyframes drift-3  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(12px,10px)}  }
        @keyframes drift-4  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-8px,-14px)} }
        @keyframes drift-5  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(14px,6px)}   }
        @keyframes drift-6  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-10px,12px)} }
        @keyframes drift-7  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(8px,-8px)}   }
        @keyframes drift-8  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-12px,-10px)}}
        @keyframes drift-9  { 0%,100%{transform:translate(0,0)}   50%{transform:translate(9px,14px)}   }
        @keyframes drift-10 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-13px,7px)}  }
        @keyframes drift-11 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(11px,-9px)}  }
        @keyframes drift-12 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-9px,-13px)} }
        @keyframes drift-13 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(13px,11px)}  }
        @keyframes drift-14 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-11px,9px)}  }
        @keyframes drift-15 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(8px,-12px)}  }
        @keyframes drift-16 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-14px,-8px)} }
        @keyframes drift-17 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(12px,13px)}  }
        @keyframes drift-18 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-8px,11px)}  }
        @keyframes drift-19 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(10px,-10px)} }
        @keyframes drift-20 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-12px,12px)} }
        @keyframes drift-21 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(9px,-14px)}  }
        @keyframes drift-22 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-10px,-11px)}}
        @keyframes drift-23 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(14px,8px)}   }
        @keyframes drift-24 { 0%,100%{transform:translate(0,0)}   50%{transform:translate(-13px,10px)} }
        .hero-drift { animation-timing-function:ease-in-out; animation-iteration-count:infinite; }
        @media(prefers-reduced-motion:reduce){ .hero-drift{ animation:none!important; } }
      `}</style>

      <div className="py-10 sm:py-14 w-full space-y-10 relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] rounded-3xl p-8 mb-10 border border-[#E7E0D8]/50 shadow-inner">
        {/* Floating gradient blobs for visual interest */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none z-0">
          <motion.div 
            animate={{ 
              x: [0, 30, -20, 0], 
              y: [0, 40, 10, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-5%] w-72 h-72 rounded-full bg-[#C25E42]/5 blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -40, 20, 0], 
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-5%] w-96 h-96 rounded-full bg-[#EAD8D2]/30 blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, 50, -30, 0], 
              y: [0, -20, 30, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[40%] w-56 h-56 rounded-full bg-orange-400/5 blur-3xl"
          />
        </div>

        {/* ── Floating dots (18 total) scattered in right 2/3 of hero ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0" aria-hidden="true">

          {/* ROW 1 — upper right quadrant */}
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:5,height:5,top:'8%',left:'62%',opacity:.22,animationName:'drift-1',animationDuration:'9.2s',animationDelay:'0s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:4,height:4,top:'13%',left:'74%',opacity:.17,animationName:'drift-2',animationDuration:'7.6s',animationDelay:'-2.1s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:7,height:7,top:'6%',left:'83%',opacity:.19,animationName:'drift-3',animationDuration:'11.4s',animationDelay:'-4.3s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:5,height:5,top:'18%',left:'91%',opacity:.16,animationName:'drift-4',animationDuration:'8.8s',animationDelay:'-1.5s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:9,height:9,top:'22%',left:'67%',opacity:.20,animationName:'drift-5',animationDuration:'13.1s',animationDelay:'-6.0s'}} />

          {/* ROW 2 — mid-right */}
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:6,height:6,top:'34%',left:'58%',opacity:.18,animationName:'drift-6',animationDuration:'10.3s',animationDelay:'-3.7s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:4,height:4,top:'38%',left:'77%',opacity:.24,animationName:'drift-7',animationDuration:'6.7s',animationDelay:'-0.9s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:8,height:8,top:'42%',left:'87%',opacity:.16,animationName:'drift-8',animationDuration:'12.5s',animationDelay:'-5.2s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:5,height:5,top:'28%',left:'95%',opacity:.21,animationName:'drift-9',animationDuration:'9.8s',animationDelay:'-2.8s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:6,height:6,top:'50%',left:'63%',opacity:.17,animationName:'drift-10',animationDuration:'7.3s',animationDelay:'-4.6s'}} />

          {/* ROW 3 — lower-right */}
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:10,height:10,top:'60%',left:'71%',opacity:.18,animationName:'drift-11',animationDuration:'14.0s',animationDelay:'-7.1s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:4,height:4,top:'65%',left:'82%',opacity:.22,animationName:'drift-12',animationDuration:'8.1s',animationDelay:'-1.3s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:6,height:6,top:'72%',left:'92%',opacity:.19,animationName:'drift-13',animationDuration:'11.7s',animationDelay:'-3.0s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:5,height:5,top:'78%',left:'60%',opacity:.16,animationName:'drift-14',animationDuration:'9.5s',animationDelay:'-5.8s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:7,height:7,top:'84%',left:'75%',opacity:.20,animationName:'drift-15',animationDuration:'6.9s',animationDelay:'-2.4s'}} />

          {/* EXTRAS — scattered fill */}
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:9,height:9,top:'55%',left:'55%',opacity:.16,animationName:'drift-16',animationDuration:'13.6s',animationDelay:'-6.5s'}} />
          <span className="hero-drift absolute rounded-full bg-[#C25E42]" style={{width:4,height:4,top:'46%',left:'97%',opacity:.23,animationName:'drift-17',animationDuration:'7.9s',animationDelay:'-0.4s'}} />
          <span className="hero-drift absolute rounded-full bg-[#1C1917]" style={{width:5,height:5,top:'90%',left:'68%',opacity:.18,animationName:'drift-18',animationDuration:'10.8s',animationDelay:'-4.0s'}} />

          {/* ── 6 Thin outline icons ── */}

          {/* Lightbulb — upper-mid right */}
          <svg className="hero-drift absolute" style={{width:16,height:16,top:'11%',left:'79%',opacity:.22,color:'#C25E42',animationName:'drift-19',animationDuration:'8.4s',animationDelay:'-3.3s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          </svg>

          {/* Pencil — mid right */}
          <svg className="hero-drift absolute" style={{width:14,height:14,top:'44%',left:'84%',opacity:.20,color:'#1C1917',animationName:'drift-20',animationDuration:'11.2s',animationDelay:'-5.5s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>

          {/* Spark / plus — upper far right */}
          <svg className="hero-drift absolute" style={{width:15,height:15,top:'30%',left:'89%',opacity:.19,color:'#C25E42',animationName:'drift-21',animationDuration:'7.1s',animationDelay:'-1.8s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>

          {/* Circle-and-stem (cherry/circle top) — lower-mid right */}
          <svg className="hero-drift absolute" style={{width:13,height:13,top:'68%',left:'88%',opacity:.21,color:'#1C1917',animationName:'drift-22',animationDuration:'12.9s',animationDelay:'-6.2s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <line x1="12" y1="12" x2="12" y2="20" />
          </svg>

          {/* X-mark — mid-left-of-right-zone */}
          <svg className="hero-drift absolute" style={{width:14,height:14,top:'57%',left:'61%',opacity:.18,color:'#C25E42',animationName:'drift-23',animationDuration:'9.7s',animationDelay:'-0.7s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>

          {/* Cross (equal-armed) — lower far right */}
          <svg className="hero-drift absolute" style={{width:15,height:15,top:'81%',left:'94%',opacity:.20,color:'#1C1917',animationName:'drift-24',animationDuration:'13.8s',animationDelay:'-4.9s'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>

        </div>

        {/* Subtle decorative background art element */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2 }}
          className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl"
        >
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full text-[#C25E42] fill-current origin-center scale-[1.5]"
          >
            <path d="M0,0 L100,0 L100,100 L0,100 Z M50,10 C20,10 10,40 10,50 C10,60 20,90 50,90 C80,90 90,60 90,50 C90,40 80,10 50,10 Z M50,20 C70,20 80,40 80,50 C80,60 70,80 50,80 C30,80 20,60 20,50 C20,40 30,20 50,20 Z M50,35 C60,35 65,45 65,50 C65,55 60,65 50,65 C40,65 35,55 35,50 C35,45 40,35 50,35 Z" />
          </motion.svg>
        </motion.div>

        {/* ================= PAGE HEADER ================= */}
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-[#C25E42] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <span className="text-sm">✦</span>
            <span>OUR CLUBS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.08]">
            {clubs.length === 8 ? 'Eight' : clubs.length} clubs.<br />
            Infinite possibilities.
          </h1>

          <p className="font-['Caveat',cursive] text-2xl sm:text-3xl text-[#C25E42] transform -rotate-1">
            "Different passions. One Spectrum."
          </p>
        </div>

        {/* ================= SEARCH & FILTERS BAR ================= */}
        <div className="space-y-4 pt-1 relative z-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clubs, interests or activities…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                className="editorial-input pr-4 py-3 text-sm bg-white/95 backdrop-blur-xs shadow-xs"
              />
            </div>

            {/* Secondary Sorting */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#78716C] font-medium hidden sm:inline">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="editorial-input py-2.5 px-3.5 text-xs bg-white/95 cursor-pointer w-auto shadow-xs font-medium"
              >
                <option value="popular">Curated Popularity</option>
                <option value="members">Most Members</option>
                <option value="alpha">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C25E42] text-white shadow-subtle'
                    : 'bg-white/90 border border-[#E7E0D8] text-[#78716C] hover:text-[#1C1917] hover:border-[#C25E42]/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CLUBS SHOWCASE LIST (GRID FORMAT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 relative z-10">
          {filteredClubs.length === 0 ? (
            <div className="lg:col-span-2 text-center py-16 bg-white/90 rounded-2xl border border-[#E7E0D8] p-8 max-w-xl mx-auto shadow-subtle">
              <Sparkles className="w-8 h-8 text-[#C25E42] mx-auto mb-3 opacity-70" />
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">No societies match your filter</h3>
              <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
                Try searching with different keywords or switch back to the "All" category filter.
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-5 px-5 py-2 bg-[#1C1917] text-white text-xs font-medium rounded hover:bg-[#C25E42] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredClubs.map((club, index) => {
              const isExpanded = !!expandedClubIds[club.id];
              const isFirst = false;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: "easeOut" }}
                  key={club.id}
                  className={`group bg-white/70 backdrop-blur-md rounded-2xl border border-[#E7E0D8]/80 shadow-md hover:shadow-[0_20px_40px_-15px_rgba(194,94,66,0.15)] hover:-translate-y-2 hover:border-[#C25E42]/50 transition-all duration-500 overflow-hidden flex flex-col relative ${isFirst ? 'lg:col-span-2 lg:flex-row' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                  {/* TOP / LEFT COLUMN: Large Framed Club Artwork / Cover Graphic */}
                  <div className={`p-4 sm:p-5 ${isFirst ? 'lg:w-1/2 lg:p-6' : 'w-full'} flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E7E0D8]/50 bg-gradient-to-br from-[#FAF8F5] to-white`}>
                    <div 
                      onClick={() => onSelectClub(club)}
                      className={`w-full ${isFirst ? 'h-64 lg:h-[280px]' : 'h-48'} rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7E0D8]/60 p-0 flex items-center justify-center group cursor-pointer relative shadow-sm hover:border-[#C25E42]/50 transition-all`}
                    >
                      {club.cover_image ? (
                        <img
                          src={club.cover_image}
                          alt={`${club.name} Artwork`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#FAF8F5]">
                          <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed shadow-sm"
                            style={{ borderColor: club.accent_color || '#C25E42', backgroundColor: `${club.accent_color || '#C25E42'}15` }}
                          >
                            <ClubLogo src={club.logo} name={club.name} size="md" accentColor={club.accent_color} />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#1C1917]">{club.name}</h4>
                            <p className="text-[10px] text-[#78716C] mt-0.5">{club.category} Guild</p>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs border border-[#E7E0D8] text-[9px] font-mono text-[#78716C] uppercase font-bold shadow-xs">
                        {club.code || `CS-0${club.id}`}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM / RIGHT COLUMN: Metadata, Badges, Name, Tagline, Rich Markdown */}
                  <div className={`flex flex-col justify-between p-6 sm:p-8 flex-1 ${isFirst ? 'lg:w-1/2' : ''}`}>
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {isFirst ? (
                          <span className="px-2.5 py-1 rounded border border-[#C25E42]/30 text-[#C25E42] text-[10px] font-bold tracking-wide uppercase bg-[#C25E42]/5">
                            Featured
                          </span>
                        ) : (
                          <Badge variant={club.category === 'Technical' ? 'terracotta' : 'neutral'}>
                            {club.category}
                          </Badge>
                        )}
                        <span className="text-[10px] text-[#78716C] font-medium uppercase tracking-wider">
                          Community
                        </span>
                      </div>

                      <div className="flex items-center gap-4 relative z-10 group/logo">
                        <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 rounded-lg overflow-hidden ring-1 ring-black/5">
                          <ClubLogo src={club.logo} name={club.name} size="md" accentColor={club.accent_color} />
                        </div>
                        <div>
                          <h2 
                            onClick={() => onSelectClub(club)}
                            className={`font-serif ${isFirst ? 'text-3xl' : 'text-2xl'} font-bold text-[#1C1917] hover:text-[#C25E42] transition-colors cursor-pointer leading-tight`}
                          >
                            {club.name}
                          </h2>
                          <p className="text-[11px] sm:text-xs text-[#78716C] mt-1 font-medium">
                            {club.tagline || `Dedicated to ${club.category.toLowerCase()} excellence.`}
                          </p>
                        </div>
                      </div>

                      <div className="relative text-sm text-[#57534E]">
                        <div className={`transition-all duration-300 ${!isExpanded && club.description && club.description.length > 200 ? 'max-h-24 overflow-hidden relative' : ''}`}>
                          <MarkdownRenderer content={club.description} />
                          {!isExpanded && club.description && club.description.length > 200 && (
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
                          )}
                        </div>
                        {club.description && club.description.length > 200 && (
                          <button
                            onClick={(e) => toggleExpand(club.id, e)}
                            className="mt-1 text-[11px] font-semibold text-[#C25E42] hover:text-[#A94E35] flex items-center gap-1 transition-colors"
                          >
                            <span>{isExpanded ? 'Show less' : 'Read full charter'}</span>
                            <ChevronRight className={`w-3 h-3 transform transition-transform ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-[#E7E0D8] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#78716C] font-medium">
                        <Users className="w-3.5 h-3.5 text-[#C25E42]" />
                        {club.members_count || 0} Members
                      </div>

                      <div className="flex items-center gap-2 relative z-10">
                        <button
                          onClick={() => onSelectClub(club)}
                          className="px-3 py-1.5 bg-white border border-[#E7E0D8] hover:border-[#C25E42] text-[#1C1917] hover:text-[#C25E42] text-[11px] font-semibold rounded transition-colors shadow-sm hover:shadow-md"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => onNavigate('register')}
                          className="px-3 py-1.5 bg-[#C25E42] hover:bg-[#A94E35] text-white text-[11px] font-semibold rounded transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-1 group/btn"
                        >
                          Apply <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
