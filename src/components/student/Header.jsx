import React, { useState, useEffect, useRef } from 'react';
import { Compass, Calendar, Info, Search, User, LogOut, ArrowRight, Menu, X, Shield } from 'lucide-react';
import SideMenu from './SideMenu';

export default function Header({
  activeView,
  onNavigate,
  currentUser,
  onOpenLogin,
  onLogout,
  onSearch,
  spectrumConfig = {}
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* === MOTION LAYER: Navbar scroll hide/show === */
  const [navHidden, setNavHidden] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setNavScrolled(currentY > 20);
        if (currentY > lastScrollYRef.current && currentY > 80) {
          setNavHidden(true);
        } else {
          setNavHidden(false);
        }
        lastScrollYRef.current = currentY;
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  /* === END MOTION LAYER === */

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    onNavigate('discovery');
  };

  return (
    <header className={`sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E0D8] navbar-motion ${navHidden ? 'navbar-hidden' : ''} ${navScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          {spectrumConfig.logo_url ? (
            <img
              src={spectrumConfig.logo_url}
              alt={spectrumConfig.title || 'Logo'}
              className="w-8 h-8 rounded object-cover shadow-subtle group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-[#C25E42] text-white flex items-center justify-center font-serif text-lg font-bold shadow-subtle group-hover:bg-[#A94E35] transition-colors">
              {(spectrumConfig.title || 'C').charAt(0)}
            </div>
          )}
          <div>
            <span className="font-serif font-bold text-lg tracking-tight text-[#1C1917] block leading-none">
              BEC CREATIVE SPECTRUM
            </span>
            <span className="text-[10px] tracking-wider uppercase text-[#78716C] block mt-0.5">
              Basaveshwar Engineering College
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('discovery')}
            className={`text-sm font-medium transition-colors nav-link-motion ${
              activeView === 'discovery' ? 'text-[#C25E42] font-semibold nav-active' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Clubs
          </button>
          <button
            onClick={() => onNavigate('events')}
            className={`text-sm font-medium transition-colors nav-link-motion ${
              activeView === 'events' ? 'text-[#C25E42] font-semibold nav-active' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-sm font-medium transition-colors nav-link-motion ${
              activeView === 'about' ? 'text-[#C25E42] font-semibold nav-active' : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Search & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search clubs, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 xl:w-56 pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E7E0D8] rounded-md text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C25E42] focus:w-64 transition-all"
            />
          </form>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#FAF0ED] text-[#C25E42] border border-[#EAD8D2] hover:bg-[#F3DDD5] transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Portal
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#FAF0ED] text-[#C25E42] border border-[#EAD8D2] hover:bg-[#F3DDD5] transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                </button>
              )}
              <button
                onClick={onLogout}
                className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFEA] rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-1.5 text-xs font-medium bg-[#C25E42] text-white rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1"
              >
                <span>Join a Club</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {currentUser && (
            <button
              onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
              className="text-xs px-2.5 py-1 rounded bg-[#FAF0ED] text-[#C25E42] font-medium"
            >
              {currentUser.role === 'admin' ? 'Admin' : 'Dashboard'}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Side Menu Drawer */}
      <SideMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onNavigate={onNavigate} 
      />
    </header>
  );
}
