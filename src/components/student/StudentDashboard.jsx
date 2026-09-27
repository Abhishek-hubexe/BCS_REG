import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, FileText, Bell, User, Settings, ArrowRight, Clock, MapPin, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function StudentDashboard({
  currentUser,
  clubs = [],
  events = [],
  announcements = [],
  registrations = [],
  onSelectClub,
  onNavigate,
  onUpdateUser
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    csn_esn: currentUser?.csn_esn || '',
    department: currentUser?.department || '',
    phone_whatsapp: currentUser?.phone_whatsapp || '',
    year: currentUser?.year || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        if (onUpdateUser) onUpdateUser(data.user);
        setIsEditingProfile(false);
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsSaving(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const studentName = currentUser?.name || 'Student';

  // Registered clubs for this user
  const userRegistrations = registrations.filter((r) => r.user_id === currentUser?.id);
  const myClubs = clubs.filter((c) =>
    userRegistrations.some((r) => r.club_id === c.id)
  );

  const pendingApps = userRegistrations.filter((r) => r.status === 'pending');

  const sidebarNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-clubs', label: 'My Clubs', icon: Users, count: myClubs.length },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'applications', label: 'Applications', icon: FileText, count: pendingApps.length },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DASHBOARD SIDEBAR (DESKTOP) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="editorial-card p-6 bg-white space-y-6">
            {/* Student Profile snippet */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-[#E7E0D8]">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={studentName}
                  className="w-12 h-12 rounded-full object-cover border border-[#E7E0D8]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#FAF0ED] text-[#C25E42] border border-[#EAD8D2] flex items-center justify-center font-serif text-lg font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-base font-bold text-[#1C1917] truncate">
                  {studentName}
                </h3>
                <span className="text-xs text-[#78716C] block truncate">
                  {currentUser?.department || 'Undergraduate'}
                </span>
                <span className="text-[10px] text-[#A8A29E] font-mono">
                  {currentUser?.csn_esn || 'STUDENT-2026'}
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="space-y-1">
              {sidebarNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-[#FAF0ED] text-[#C25E42] font-semibold'
                        : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#C25E42] text-white' : 'bg-[#E7E0D8] text-[#1C1917]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Support Card */}
          <div className="editorial-card p-5 bg-[#FAF8F5] border-[#E7E0D8] space-y-2 text-xs">
            <span className="font-serif font-bold text-[#1C1917] block">Council Office Hours</span>
            <p className="text-[#78716C] leading-relaxed">
              Audition inquiries or registration adjustments? Visit Student Activity Center Room 204 or contact support.
            </p>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT */}
        <main className="lg:col-span-9 space-y-8">
          {/* OVERVIEW CONTENT */}
          {['overview', 'my-clubs', 'events', 'announcements'].includes(activeTab) && (
            <div className="space-y-8">
              {/* GREETING HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
                {getGreeting()}, {studentName.split(' ')[0]}.
              </h1>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1">
                Here’s what’s happening across your university communities.
              </p>
            </div>

            <button
              onClick={() => onNavigate('discovery')}
              className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore More Guilds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SUMMARY CARDS (4 KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="editorial-card p-5 bg-white space-y-1">
              <span className="text-xs text-[#78716C]">My Guilds</span>
              <span className="font-serif text-3xl font-bold text-[#1C1917] block">{myClubs.length}</span>
              <span className="text-[11px] text-[#5D7A68] font-medium">Active memberships</span>
            </div>

            <div className="editorial-card p-5 bg-white space-y-1">
              <span className="text-xs text-[#78716C]">Upcoming Events</span>
              <span className="font-serif text-3xl font-bold text-[#1C1917] block">{events.length}</span>
              <span className="text-[11px] text-[#C25E42] font-medium">This month</span>
            </div>

            <div className="editorial-card p-5 bg-white space-y-1">
              <span className="text-xs text-[#78716C]">Pending Reviews</span>
              <span className="font-serif text-3xl font-bold text-[#1C1917] block">{pendingApps.length}</span>
              <span className="text-[11px] text-[#C28B38] font-medium">Audition status</span>
            </div>

            <div className="editorial-card p-5 bg-white space-y-1">
              <span className="text-xs text-[#78716C]">Notices</span>
              <span className="font-serif text-3xl font-bold text-[#1C1917] block">{announcements.length}</span>
              <span className="text-[11px] text-[#78716C]">General broadcasts</span>
            </div>
          </div>

          {/* MY CLUBS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">My Registered Clubs</h2>
              <button
                onClick={() => onNavigate('discovery')}
                className="text-xs text-[#C25E42] hover:underline"
              >
                Browse directory
              </button>
            </div>

            {myClubs.length === 0 ? (
              <div className="editorial-card p-8 text-center bg-white space-y-3">
                <p className="text-sm text-[#78716C]">You haven't joined any clubs yet.</p>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35]"
                >
                  Join Your First Society
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {myClubs.map((club) => {
                  const reg = userRegistrations.find((r) => r.club_id === club.id);
                  return (
                    <div
                      key={club.id}
                      onClick={() => onSelectClub(club)}
                      className="editorial-card p-5 bg-white cursor-pointer hover:border-[#C25E42] group flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <ClubLogo
                          src={club.logo}
                          name={club.name}
                          size="md"
                          accentColor={club.accent_color}
                        />
                        <Badge variant={reg?.status === 'approved' ? 'sage' : 'ochre'} size="xs">
                          {reg?.status || 'Active Member'}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1C1917] group-hover:text-[#C25E42] transition-colors">
                          {club.name}
                        </h4>
                        <span className="text-xs text-[#78716C] block mt-0.5">{club.category}</span>
                      </div>

                      <div className="pt-3 border-t border-[#E7E0D8] flex items-center justify-between text-xs text-[#C25E42] font-medium">
                        <span>Open Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h1 className="font-serif text-3xl font-bold text-[#1C1917]">My Applications</h1>
              {userRegistrations.length === 0 ? (
                <div className="editorial-card p-12 text-center bg-white">
                  <p className="text-sm text-[#78716C]">You have no active applications.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userRegistrations.map(reg => {
                    const club = clubs.find(c => c.id === reg.club_id);
                    return (
                      <div key={reg.id} className="editorial-card p-6 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <ClubLogo src={club?.logo} name={club?.name || 'Club'} size="sm" accentColor={club?.accent_color} />
                           <div>
                             <h4 className="font-serif text-lg font-bold text-[#1C1917]">{club?.name}</h4>
                             <span className="text-xs text-[#78716C] mt-1 block">Application ID: {reg.reg_code}</span>
                           </div>
                        </div>
                        <Badge variant={reg.status === 'approved' ? 'sage' : 'ochre'}>
                          {reg.status === 'approved' ? 'Approved' : 'Pending Audition'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Personal Settings</h1>
              <div className="editorial-card p-8 bg-white space-y-6 max-w-2xl border-[#E7E0D8]">
                 <div className="flex items-center gap-6 pb-6 border-b border-[#E7E0D8]">
                   <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} className="w-20 h-20 rounded-full object-cover border border-[#E7E0D8]" alt="Profile Avatar" />
                   {isEditingProfile ? (
                     <div className="flex-1 space-y-3">
                       <div>
                         <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">Full Name</label>
                         <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                       </div>
                       <div>
                         <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">Email Address</label>
                         <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                       </div>
                     </div>
                   ) : (
                     <div>
                       <h3 className="font-serif text-xl font-bold text-[#1C1917]">{studentName}</h3>
                       <p className="text-sm text-[#78716C] mt-1">{currentUser?.email || 'student@university.edu'}</p>
                     </div>
                   )}
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">University ID</label>
                     {isEditingProfile ? (
                       <input type="text" value={editFormData.csn_esn} onChange={(e) => setEditFormData({...editFormData, csn_esn: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                     ) : (
                       <p className="text-sm text-[#78716C]">{currentUser?.csn_esn || '23CSE042'}</p>
                     )}
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">Department</label>
                     {isEditingProfile ? (
                       <input type="text" value={editFormData.department} onChange={(e) => setEditFormData({...editFormData, department: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                     ) : (
                       <p className="text-sm text-[#78716C]">{currentUser?.department || 'Computer Science'}</p>
                     )}
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">Phone</label>
                     {isEditingProfile ? (
                       <input type="text" value={editFormData.phone_whatsapp} onChange={(e) => setEditFormData({...editFormData, phone_whatsapp: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                     ) : (
                       <p className="text-sm text-[#78716C]">{currentUser?.phone_whatsapp || '+91 9876543210'}</p>
                     )}
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-[#1C1917] block mb-1 uppercase tracking-wider">Year</label>
                     {isEditingProfile ? (
                       <input type="text" value={editFormData.year} onChange={(e) => setEditFormData({...editFormData, year: e.target.value})} className="w-full bg-[#FAF8F5] border border-[#E7E0D8] rounded px-3 py-2 text-sm text-[#1C1917] focus:outline-none focus:border-[#C25E42]" />
                     ) : (
                       <p className="text-sm text-[#78716C]">{currentUser?.year || '1st Year'}</p>
                     )}
                   </div>
                 </div>
                 <div className="pt-4 border-t border-[#E7E0D8] flex gap-3">
                   {isEditingProfile ? (
                     <>
                       <button 
                         onClick={handleSaveProfile}
                         disabled={isSaving}
                         className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors shadow-sm disabled:opacity-50"
                       >
                         {isSaving ? 'Saving...' : 'Save Changes'}
                       </button>
                       <button 
                         onClick={() => setIsEditingProfile(false)}
                         disabled={isSaving}
                         className="px-4 py-2 bg-white border border-[#E7E0D8] text-[#1C1917] text-xs font-medium rounded hover:bg-[#FAF8F5] transition-colors shadow-sm"
                       >
                         Cancel
                       </button>
                     </>
                   ) : (
                     <button 
                       onClick={() => setIsEditingProfile(true)}
                       className="px-4 py-2 bg-white border border-[#E7E0D8] text-[#1C1917] text-xs font-medium rounded hover:bg-[#FAF8F5] transition-colors shadow-sm"
                     >
                       Edit Profile Information
                     </button>
                   )}
                 </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
