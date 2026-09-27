import React, { useState, useEffect, useRef } from 'react';
import Header from './components/student/Header';
import HomePage from './components/student/HomePage';
import ClubDiscovery from './components/student/ClubDiscovery';
import ClubProfile from './components/student/ClubProfile';
import EventsExplorer from './components/student/EventsExplorer';
import RegistrationFlow from './components/student/RegistrationFlow';
import StudentDashboard from './components/student/StudentDashboard';
import AnnouncementsFeed from './components/student/AnnouncementsFeed';
import AuditionDetails from './components/student/AuditionDetails';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminClubManagement from './components/admin/AdminClubManagement';
import AdminClubBranding from './components/admin/AdminClubBranding';
import AdminCreateClub from './components/admin/AdminCreateClub';
import AdminRegistrations from './components/admin/AdminRegistrations';
import AdminEvents from './components/admin/AdminEvents';
import AdminAnnouncements from './components/admin/AdminAnnouncements';
import AdminSpectrumBranding from './components/admin/AdminSpectrumBranding';
import AdminOfficialLinks from './components/admin/AdminOfficialLinks';

import LoginModal from './components/LoginModal';
import Toast from './components/common/Toast';
import { Home, Grid, Bell, Calendar, User } from 'lucide-react';

export default function App() {
  // Global user state - requires explicit sign-in credentials every time
  const [currentUser, setCurrentUser] = useState(null);

  // Navigation view state: 'home' | 'discovery' | 'club-profile' | 'events' | 'register' | 'dashboard' | 'admin' | 'about'
  const [activeView, setActiveView] = useState('home');

  // Admin active sub-tab
  const [adminTab, setAdminTab] = useState('overview');
  const [adminBrandingClubId, setAdminBrandingClubId] = useState(null);

  // Data states
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [adminStats, setAdminStats] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [spectrumConfig, setSpectrumConfig] = useState({
    title: 'Creative Spectrum',
    tagline: 'Collegiate Guilds Platform',
    logo_url: null,
    accent_color: '#C25E42'
  });

  // Selected club for profile / registration
  const [selectedClub, setSelectedClub] = useState(null);
  const [preSelectedClubId, setPreSelectedClubId] = useState(null);

  // Modals & Toast
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [showSplash, setShowSplash] = useState(true);

  // Scroll Progress and Reveal Animations
  useEffect(() => {
    // Scroll progress bar
    const updateScroll = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        progressBar.style.transform = `scaleX(${scrolled})`;
      }
    };
    window.addEventListener('scroll', updateScroll);

    // Reveal elements using IntersectionObserver
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Optional: stop observing once revealed
            // revealObserver.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const checkAndObserve = () => {
      document.querySelectorAll('.reveal-item').forEach((el) => {
        if (!el.classList.contains('reveal-visible')) {
          revealObserver.observe(el);
        }
      });
    };

    // Run initially and set up a mutation observer for dynamically added elements
    checkAndObserve();
    
    const mutationObserver = new MutationObserver(() => {
      checkAndObserve();
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', updateScroll);
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  /* === MOTION LAYER: Back-to-top + Tab visibility === */
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Back-to-top visibility (reuse existing scroll event)
    const handleBttScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleBttScroll, { passive: true });

    // Tab visibility: pause ambient blob animations
    const handleVisibility = () => {
      if (document.hidden) {
        document.documentElement.classList.add('tab-hidden');
      } else {
        document.documentElement.classList.remove('tab-hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleBttScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);
  /* === END MOTION LAYER === */

  // Initial data loading
  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cs_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (currentUser?.id) headers['x-user-id'] = String(currentUser.id);
    if (currentUser?.role) headers['x-user-role'] = currentUser.role;
    return headers;
  };

  const fetchAllData = async () => {
    try {
      // 0. Fetch spectrum config
      try {
        const resSpec = await fetch('/api/spectrum-config');
        const dataSpec = await resSpec.json();
        if (dataSpec.config) setSpectrumConfig(dataSpec.config);
      } catch (e) {
        console.error('Spectrum config load error:', e);
      }

      // 1. Fetch clubs
      const url = currentUser?.id ? `/api/clubs?userId=${currentUser.id}` : '/api/clubs';
      const resClubs = await fetch(url);
      const dataClubs = await resClubs.json();
      setClubs(dataClubs.clubs || []);

      // 2. Fetch events
      const resEvents = await fetch('/api/events');
      const dataEvents = await resEvents.json();
      setEvents(dataEvents.events || []);

      // 3. Fetch announcements
      const resAnn = await fetch('/api/announcements');
      const dataAnn = await resAnn.json();
      setAnnouncements(dataAnn.announcements || []);

      // 4. Fetch registrations
      const authHeaders = getAuthHeaders();
      const resReg = await fetch('/api/registrations', { headers: authHeaders, credentials: 'include' });
      const dataReg = await resReg.json();
      setRegistrations(Array.isArray(dataReg.registrations) ? dataReg.registrations : []);

      // 5. Fetch stats & audit logs if admin
      if (currentUser?.role === 'admin') {
        const resStats = await fetch('/api/admin/stats', { headers: authHeaders, credentials: 'include' });
        const dataStats = await resStats.json();
        setAdminStats(dataStats);

        const resLogs = await fetch('/api/admin/audit-logs', { headers: authHeaders, credentials: 'include' });
        const dataLogs = await resLogs.json();
        setAuditLogs(Array.isArray(dataLogs.logs) ? dataLogs.logs : []);

        const resMedia = await fetch('/api/media', { headers: authHeaders, credentials: 'include' });
        const dataMedia = await resMedia.json();
        setMediaLibrary(Array.isArray(dataMedia.media) ? dataMedia.media : []);
      }
    } catch (err) {
      console.error('Data loading error:', err);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cs_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`, 'success');
    if (user.role === 'admin') {
      setActiveView('admin');
      setAdminTab('overview');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('cs_user');
    localStorage.removeItem('bcs_user');
    localStorage.removeItem('cs_token');
    setActiveView('home');
    showToast('Signed out successfully.', 'info');
  };

  const handleSelectClubForProfile = (club) => {
    setSelectedClub(club);
    setActiveView('club-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinClubFromProfile = (club) => {
    setPreSelectedClubId(club.id);
    setActiveView('audition-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when admin updates a club's branding in the Branding Studio
  // Immediately synchronizes the updated club across all views!
  const handleClubBrandingUpdated = (updatedClub) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === updatedClub.id ? { ...c, ...updatedClub } : c))
    );
    if (selectedClub && selectedClub.id === updatedClub.id) {
      setSelectedClub(updatedClub);
    }
    showToast(`Branding for "${updatedClub.name}" updated globally!`, 'success');
    fetchAllData();
  };

  const handleDeleteClub = async (clubId) => {
    try {
      const authHeaders = getAuthHeaders();
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete club');
      setClubs((prev) => prev.filter((c) => c.id !== clubId));
      showToast(data.message || 'Club deleted successfully.', 'info');
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#FAF8F5] z-[10000] flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={() => setShowSplash(false)}
          className="w-full max-w-4xl max-h-screen object-contain transform-gpu"
        >
          <source src="/intro_new.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/intro_new.mp4" type="video/mp4" />
        </video>
        <button 
          onClick={() => setShowSplash(false)}
          className="absolute top-8 right-8 px-4 py-2 bg-white/80 backdrop-blur rounded-full text-xs font-semibold tracking-wider text-[#1C1917] uppercase hover:bg-white transition-colors shadow-sm"
        >
          Skip Intro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-sans flex flex-col relative pb-16 md:pb-0">
      <div id="scroll-progress" className="scroll-progress-bar"></div>
      {/* GLOBAL TOAST */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* ADMIN PORTAL VIEW */}
      {activeView === 'admin' && currentUser?.role === 'admin' ? (
        <AdminLayout
          activeTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          onLogout={handleLogout}
          onSwitchToStudentView={() => setActiveView('home')}
          spectrumConfig={spectrumConfig}
        >
          {adminTab === 'overview' && (
            <AdminDashboard
              stats={adminStats}
              clubs={clubs}
              registrations={registrations}
              events={events}
              auditLogs={auditLogs}
              onNavigateTab={(tab) => setAdminTab(tab)}
            />
          )}

          {adminTab === 'clubs' && (
            <AdminClubManagement
              clubs={clubs}
              onNavigateTab={(tab) => setAdminTab(tab)}
              onSelectClubForBranding={(clubId) => {
                setAdminBrandingClubId(clubId);
                setAdminTab('branding');
              }}
              onSelectClubForView={(club) => {
                setSelectedClub(club);
                setActiveView('club-profile');
              }}
              onDeleteClub={handleDeleteClub}
              onClubUpdated={(updatedClub) => {
                setClubs((prev) =>
                  prev.map((c) => (c.id === updatedClub.id ? updatedClub : c))
                );
                showToast(`Club "${updatedClub.name}" updated successfully!`, 'success');
              }}
            />
          )}

          {adminTab === 'branding' && (
            <AdminClubBranding
              clubs={clubs}
              selectedClubId={adminBrandingClubId}
              onUpdateClubBranding={handleClubBrandingUpdated}
            />
          )}

          {adminTab === 'create-club' && (
            <AdminCreateClub
              onBack={() => setAdminTab('clubs')}
              onClubCreated={(newClub) => {
                setClubs((prev) => [...prev, newClub]);
                showToast(`Club "${newClub.name}" chartered successfully!`, 'success');
                setAdminTab('clubs');
              }}
            />
          )}

          {(adminTab === 'registrations' || adminTab === 'students') && (
            <AdminRegistrations
              registrations={registrations}
              clubs={clubs}
              onUpdateRegistrationStatus={(regId, status) => {
                setRegistrations((prev) =>
                  prev.map((r) => (r.id === regId ? { ...r, status } : r))
                );
                showToast(`Registration status updated to ${status}`, 'success');
              }}
            />
          )}

          {adminTab === 'events' && (
            <AdminEvents
              events={events}
              clubs={clubs}
              onEventCreated={(newEvent) => {
                setEvents((prev) => [newEvent, ...prev]);
                showToast('Event scheduled successfully!', 'success');
              }}
              onEventDeleted={(id) => {
                setEvents((prev) => prev.filter((e) => e.id !== id));
                showToast('Event removed.', 'info');
              }}
            />
          )}

          {adminTab === 'announcements' && (
            <AdminAnnouncements
              announcements={announcements}
              clubs={clubs}
              onAnnouncementCreated={(newAnn) => {
                setAnnouncements((prev) => [newAnn, ...prev]);
                showToast('Broadcast published!', 'success');
              }}
              onAnnouncementDeleted={(id) => {
                setAnnouncements((prev) => prev.filter((a) => a.id !== id));
                showToast('Broadcast removed.', 'info');
              }}
            />
          )}


          {adminTab === 'spectrum' && (
            <AdminSpectrumBranding
              spectrumConfig={spectrumConfig}
              onNavigateTab={(tab) => setAdminTab(tab)}
              onUpdateConfig={(newConfig) => {
                setSpectrumConfig(newConfig);
                showToast('Spectrum visual identity updated successfully!', 'success');
              }}
            />
          )}

          {adminTab === 'official-links' && (
            <AdminOfficialLinks
              spectrumConfig={spectrumConfig}
              onUpdateConfig={(newConfig) => {
                setSpectrumConfig(newConfig);
                showToast('Official Channels & Community Links updated successfully!', 'success');
              }}
            />
          )}

        </AdminLayout>
      ) : (
        /* PUBLIC STUDENT EXPERIENCE */
        <div className="flex-1 flex flex-col min-h-screen">
          <Header
            activeView={activeView}
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentUser={currentUser}
            onOpenLogin={() => setLoginModalOpen(true)}
            onLogout={handleLogout}
            spectrumConfig={spectrumConfig}
          />

          <main className="flex-1 flex flex-col">
            {/* === MOTION LAYER: View transition wrapper === */}
            <div key={activeView} className="view-transition-enter flex-1 flex flex-col">
            {/* === END MOTION LAYER === */}
            {activeView === 'home' && (
              <HomePage
                clubs={clubs}
                events={events}
                spectrumConfig={spectrumConfig}
                onNavigate={(view) => {
                  setActiveView(view);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectClub={handleSelectClubForProfile}
              />
            )}

            {activeView === 'discovery' && (
              <ClubDiscovery
                clubs={clubs}
                events={events}
                onSelectClub={handleSelectClubForProfile}
                onNavigate={(view) => setActiveView(view)}
              />
            )}

            {activeView === 'club-profile' && (
              <ClubProfile
                club={selectedClub || clubs[0]}
                events={events}
                onBack={() => setActiveView('discovery')}
                onJoinClub={handleJoinClubFromProfile}
                isRegistered={registrations.some(
                  (r) => r.user_id === currentUser?.id && r.club_id === (selectedClub || clubs[0])?.id
                )}
              />
            )}

            {activeView === 'events' && (
              <EventsExplorer
                events={events}
                clubs={clubs}
                onSelectClub={handleSelectClubForProfile}
                onNavigate={(view) => setActiveView(view)}
              />
            )}


            {activeView === 'audition-details' && (
              <AuditionDetails
                club={selectedClub || clubs[0]}
                onBack={() => setActiveView('club-profile')}
                onApply={() => {
                  setPreSelectedClubId((selectedClub || clubs[0])?.id);
                  setActiveView('register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeView === 'register' && (
              <RegistrationFlow
                clubs={clubs}
                currentUser={currentUser}
                preSelectedClubId={preSelectedClubId}
                onCompleteRegistration={(data) => {
                  if (data.user) {
                    setCurrentUser(data.user);
                    localStorage.setItem('cs_user', JSON.stringify(data.user));
                  }
                  showToast('Registrations submitted successfully!', 'success');
                  fetchAllData();
                }}
                onNavigate={(view) => setActiveView(view)}
              />
            )}

            {activeView === 'dashboard' && (
              <StudentDashboard
                currentUser={currentUser}
                clubs={clubs}
                events={events}
                announcements={announcements}
                registrations={registrations}
                onSelectClub={handleSelectClubForProfile}
                onNavigate={(view) => setActiveView(view)}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  localStorage.setItem('cs_user', JSON.stringify(updatedUser));
                }}
              />
            )}

            {activeView === 'about' && (
              <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-left">
                <div className="space-y-3">
                  <span className="text-xs font-semibold tracking-wider text-[#C25E42] uppercase">
                    Institutional Charter
                  </span>
                  <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1917]">
                    {spectrumConfig.about_title || `About ${spectrumConfig.title || 'Creative Spectrum'}`}
                  </h1>
                  <p className="text-base sm:text-lg text-[#78716C] leading-relaxed">
                    {spectrumConfig.about_subtitle || 'A unified collegiate ecosystem designed to streamline club discovery, verified auditions, and cross-disciplinary collaboration.'}
                  </p>
                </div>

                <div className="editorial-card p-8 bg-white space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                    {spectrumConfig.about_section_title || 'Our Vision'}
                  </h3>
                  <div className="text-xs sm:text-sm text-[#78716C] leading-relaxed whitespace-pre-line">
                    {spectrumConfig.about_section_body || 'College platforms often devolve into cluttered portals filled with fluorescent banners, unverified links, and confusing signups. Creative Spectrum takes an editorial approach: generous whitespace, Swiss-inspired typography, and a cohesive warm ivory palette.\n\nBehind this minimalist aesthetic lies a powerful centralized database powering real-time identity branding, student portfolio records, and multi-guild administration.'}
                  </div>
                </div>
              </div>
            )}
            </div>{/* === MOTION LAYER: close view-transition-enter === */}
          </main>
          
          {/* MOBILE BOTTOM NAVIGATION */}
          <nav className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#E7E0D8] z-[9000] md:hidden flex justify-around items-center pt-2 pb-2">
            <button onClick={() => setActiveView('home')} className={`flex flex-col items-center justify-center p-2 transition-colors relative w-16 h-12 ${activeView === 'home' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
              <Home className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium tracking-wider">HOME</span>
              {activeView === 'home' && <div className="w-1 h-1 bg-[#C25E42] rounded-full absolute bottom-0" />}
            </button>
            <button onClick={() => setActiveView('discovery')} className={`flex flex-col items-center justify-center p-2 transition-colors relative w-16 h-12 ${activeView === 'discovery' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
              <Grid className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium tracking-wider">CLUBS</span>
              {activeView === 'discovery' && <div className="w-1 h-1 bg-[#C25E42] rounded-full absolute bottom-0" />}
            </button>

            <button onClick={() => setActiveView('events')} className={`flex flex-col items-center justify-center p-2 transition-colors relative w-16 h-12 ${activeView === 'events' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium tracking-wider">EVENTS</span>
              {activeView === 'events' && <div className="w-1 h-1 bg-[#C25E42] rounded-full absolute bottom-0" />}
            </button>
            <button onClick={() => setActiveView('dashboard')} className={`flex flex-col items-center justify-center p-2 transition-colors relative w-16 h-12 ${activeView === 'dashboard' ? 'text-[#1C1917]' : 'text-[#A8A29E]'}`}>
              <User className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium tracking-wider">PROFILE</span>
              {activeView === 'dashboard' && <div className="w-1 h-1 bg-[#C25E42] rounded-full absolute bottom-0" />}
            </button>
          </nav>
        </div>
      )}

      {/* === MOTION LAYER: Back to Top Button === */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
      {/* === END MOTION LAYER === */}

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
