import React from 'react';
import { ArrowRight, Calendar, MapPin, Music } from 'lucide-react';

export default function AuditionDetails({ club, onApply, onBack }) {
  const auditionInfo = club?.audition_info || {
    tagline: 'Your voice. Our stage.',
    registrations_open: 'Oct 01, 2026',
    live_auditions: 'Oct 07-08, 2026',
    results_announced: 'Oct 10, 2026',
    process: '1. Registration: Fill the form with accurate details.\n2. Live Audition: Vocal / Instrument round or performance demonstration.\n3. Shortlisting: Selected candidates will be informed.\n4. Final List: Results will be announced.'
  };

  return (
    <div className="flex-1 flex flex-col pb-20">
      {/* Hero Section */}
      <div className="h-64 sm:h-80 w-full relative bg-[#F4EFEA]">
        {club?.cover_image && (
          <img 
            src={club.cover_image} 
            alt="Audition Hero" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent" />
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 sm:left-8 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-xs font-semibold tracking-wider text-[#1C1917] uppercase hover:bg-white transition-colors shadow-sm"
        >
          &larr; Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 w-full">
        <div className="editorial-card p-8 sm:p-10 mb-8">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-wider text-[#C25E42] uppercase block mb-3">
              Every club. A unique journey.
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1917] uppercase leading-tight">
              {club?.name} Auditions
            </h1>
            <p className="font-serif italic text-[#78716C] text-lg sm:text-xl mt-4">
              "{auditionInfo.tagline}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 py-8 border-y border-[#E7E0D8]">
            {/* Timeline */}
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-6">Audition Process</h3>
              <div className="space-y-6 bg-[#FAF8F5] p-6 rounded-md border border-[#E7E0D8]">
                <p className="text-sm text-[#78716C] whitespace-pre-wrap leading-relaxed">
                  {auditionInfo.process}
                </p>
              </div>
            </div>

            {/* Dates & Actions */}
            <div className="flex-1 bg-[#FAF8F5] p-6 rounded border border-[#E7E0D8]">
              <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-6">Important Dates</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-xs font-semibold text-[#78716C] uppercase">Registrations Open</p>
                  <p className="text-sm font-medium text-[#1C1917] mt-1">{auditionInfo.registrations_open}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#78716C] uppercase">Live Auditions</p>
                  <p className="text-sm font-medium text-[#1C1917] mt-1">{auditionInfo.live_auditions}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#78716C] uppercase">Results Announced</p>
                  <p className="text-sm font-medium text-[#1C1917] mt-1">{auditionInfo.results_announced}</p>
                </div>
              </div>

              <button 
                onClick={onApply}
                className="w-full py-4 bg-[#C25E42] text-white rounded font-semibold text-sm hover:bg-[#A94E35] transition-colors flex items-center justify-center gap-2 group shadow-subtle"
              >
                <span>Apply for Audition</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
             <Music className="w-6 h-6 text-[#C25E42] mx-auto opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
