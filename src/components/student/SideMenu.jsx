import React from 'react';
import { Home, Grid, Bell, Calendar, Info, Mail, X } from 'lucide-react';

export default function SideMenu({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Back to where it begins.' },
    { id: 'discovery', label: 'Clubs', icon: Grid, desc: 'Explore. Create. Belong.' },
    { id: 'announcements', label: 'Announcements', icon: Bell, desc: 'Stay in the loop.' },
    { id: 'events', label: 'Events', icon: Calendar, desc: 'What’s coming.' },
    { id: 'about', label: 'About', icon: Info, desc: 'Who we are.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm h-full bg-[#1D2225] text-[#F7F1E5] flex flex-col transform transition-transform duration-300 shadow-2xl overflow-y-auto">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="font-serif tracking-widest text-sm uppercase text-[#C25E42]">
            Menu
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#F7F1E5]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col space-y-8">
          <div className="space-y-6">
            {navItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="flex items-start gap-4 cursor-pointer group"
              >
                <div className="mt-1 p-2 border border-white/20 rounded-full group-hover:border-[#C25E42] group-hover:text-[#C25E42] transition-colors">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif text-2xl group-hover:text-[#C25E42] transition-colors">{item.label}</div>
                  <div className="text-xs text-[#A8A29E] mt-1 font-['Caveat',cursive] italic opacity-80 group-hover:opacity-100 transition-opacity text-base">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="font-['Caveat',cursive] italic text-[#C25E42] text-xl">
              “Different minds.<br/>A brighter tomorrow.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
