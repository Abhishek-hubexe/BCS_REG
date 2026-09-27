import React from 'react';

/**
 * ScrapbookFrame component that provides the warm editorial scrapbook collage margins
 * matching the user reference screenshot:
 * - Left margin: Sparkles, "Same campus. Different frequencies.", Polaroid of BEC campus with "📍 BEC",
 *   botanical leaf, sticky note ("Create Explore Connect Belong 😊"), vintage BEC architectural sketch, warm watercolor brush strokes.
 * - Right margin: "Good Ideas Better People ♕", Polaroid of students talking on lawn, pressed yellow flower,
 *   ribbon tag ("TECH. CULTURE. CREATIVITY. SPORTS. MEDIA. COMMUNITY. ♡"), Polaroid with "Find your tribe ☺", teal watercolor strokes.
 */
export default function ScrapbookFrame({ children, scrapbookImages = {} }) {
  const {
    image1 = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    image2 = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    image3 = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80"
  } = scrapbookImages;

  return (
    <div className="relative w-full min-h-screen bg-[#FAF8F5] overflow-x-hidden">
      {/* ================= LEFT MARGIN SCRAPBOOK COLLAGE ================= */}
      <aside className="hidden xl:flex flex-col items-center absolute left-2 top-24 bottom-12 w-52 pointer-events-none z-10 select-none opacity-95">


        {/* Tilted Polaroid Photo: BEC Campus Building */}
        <div className="relative transform -rotate-6 transition-transform hover:rotate-0 duration-300 pointer-events-auto shadow-card bg-white p-2.5 pb-7 rounded-sm border border-[#E7E0D8] w-44 mb-8">
          {/* Scotch Washi Tape on top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FAF0ED]/80 border-t border-b border-[#EAD8D2]/80 backdrop-blur-xs transform -rotate-2 opacity-80" />
          
          <div className="w-full h-36 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img 
              src={image1} 
              alt="BEC Bagalkot Heritage Campus"
              className="w-full h-full object-cover grayscale-[15%] contrast-105"
            />
          </div>

          {/* Polaroid Pin / Tag */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1">
            <span className="text-xs">📍</span>
            <span className="font-['Caveat',cursive] text-sm font-bold text-[#1C1917]">BEC Campus</span>
          </div>
        </div>


      </aside>

      {/* ================= RIGHT MARGIN SCRAPBOOK COLLAGE ================= */}
      <aside className="hidden xl:flex flex-col items-center absolute right-2 top-20 bottom-12 w-56 pointer-events-none z-10 select-none opacity-95">


        {/* Tilted Polaroid Photo: Students collaborating on campus lawn */}
        <div className="relative transform rotate-4 transition-transform hover:rotate-0 duration-300 pointer-events-auto shadow-card bg-white p-2.5 pb-7 rounded-sm border border-[#E7E0D8] w-48 mb-6">
          <div className="absolute -top-3 left-8 w-14 h-4.5 bg-[#F4EFEA] border-t border-b border-[#D4CBC0] transform rotate-3 opacity-90" />
          
          <div className="w-full h-36 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img 
              src={image2} 
              alt="Students Collaborating"
              className="w-full h-full object-cover contrast-105"
            />
          </div>

          <div className="absolute bottom-2 right-3">
            <span className="font-['Caveat',cursive] text-xs font-semibold text-[#78716C]">Campus Life '26</span>
          </div>
        </div>



        {/* Polaroid photo: "Find your tribe ☺" */}
        <div className="relative transform rotate-3 transition-transform hover:rotate-0 duration-300 pointer-events-auto shadow-card bg-white p-2 pb-6 rounded-sm border border-[#E7E0D8] w-42 mb-4">
          <div className="w-full h-28 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img 
              src={image3} 
              alt="Community"
              className="w-full h-full object-cover grayscale-[10%]"
            />
          </div>
          <div className="mt-1 text-center">
            <span className="font-['Caveat',cursive] text-sm font-bold text-[#C25E42]">
              Find your tribe ☺
            </span>
          </div>
        </div>


      </aside>

      {/* ================= MOBILE SCRAPBOOK COLLAGE (Top Scattered) ================= */}
      <div className="xl:hidden flex flex-col gap-10 px-6 pt-10 pb-4 w-full overflow-hidden">


        {/* Primary Polaroid - Left aligned */}
        <div className="self-start transform rotate-3 bg-white p-2 pb-6 rounded-sm border border-[#E7E0D8] w-48 shadow-sm">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#FAF0ED]/80 border-t border-b border-[#EAD8D2]/80 transform rotate-1 opacity-80" />
          <div className="w-full h-32 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img src={image1} alt="Primary" className="w-full h-full object-cover grayscale-[15%] contrast-105" />
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <span className="text-[12px]">📍</span>
            <span className="font-['Caveat',cursive] text-sm font-bold text-[#1C1917]">BEC Campus</span>
          </div>
        </div>


      </div>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="relative z-0 max-w-7xl mx-auto xl:px-20 px-4 sm:px-6">
        {children}
      </div>

      {/* ================= MOBILE SCRAPBOOK COLLAGE (Bottom Scattered) ================= */}
      <div className="xl:hidden flex flex-col gap-10 px-6 pt-8 pb-16 w-full overflow-hidden">


        {/* Secondary Polaroid - Right aligned */}
        <div className="self-end transform -rotate-6 bg-white p-2 pb-6 rounded-sm border border-[#E7E0D8] w-48 shadow-sm mt-4">
          <div className="w-full h-36 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img src={image2} alt="Secondary" className="w-full h-full object-cover contrast-105" />
          </div>
          <div className="absolute bottom-1.5 right-2">
            <span className="font-['Caveat',cursive] text-xs font-semibold text-[#78716C]">Campus Life '26</span>
          </div>
        </div>

        {/* Tertiary Polaroid - Left aligned */}
        <div className="self-start transform rotate-3 bg-white p-2 pb-5 rounded-sm border border-[#E7E0D8] w-40 shadow-sm mt-4">
          <div className="w-full h-28 overflow-hidden rounded bg-[#F4EFEA] border border-[#E7E0D8]">
            <img src={image3} alt="Tertiary" className="w-full h-full object-cover grayscale-[10%]" />
          </div>
          <div className="mt-1 text-center">
            <span className="font-['Caveat',cursive] text-sm font-bold text-[#C25E42]">
              Find your tribe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
