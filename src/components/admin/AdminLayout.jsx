import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  FileCheck,
  Calendar,
  Bell,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Palette,
  PlusCircle,
  Menu,
  X,
  ExternalLink,
  Search,
  Sparkles,
  Share2
} from 'lucide-react';

export default function AdminLayout({
  activeTab,
  onSelectTab,
  onLogout,
  onSwitchToStudentView,
  spectrumConfig = {},
  children
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      group: 'Clubs & Identity',
      items: [
        { id: 'spectrum', label: 'Spectrum Logo & Identity', icon: Sparkles, badge: 'Hub' },
        { id: 'official-links', label: 'Official Channels & Links', icon: Share2, badge: 'Live' },
        { id: 'clubs', label: 'All Clubs', icon: Compass },
        { id: 'branding', label: 'Club Branding', icon: Palette, badge: 'Studio' },
        { id: 'create-club', label: 'Add New Club', icon: PlusCircle }
      ]
    },
    {
      group: 'Students & Enrollment',
      items: [
        { id: 'registrations', label: 'Registrations', icon: FileCheck },
        { id: 'students', label: 'Student Directory', icon: Users }
      ]
    },
    {
      group: 'Campus Programming',
      items: [
        { id: 'events', label: 'Events Manager', icon: Calendar },
        { id: 'announcements', label: 'Announcements', icon: Bell }
      ]
    },

  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-['Inter',sans-serif]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E7E0D8] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-[#78716C] hover:text-[#1C1917]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            {spectrumConfig.logo_url ? (
              <img
                src={spectrumConfig.logo_url}
                alt={spectrumConfig.title || 'Logo'}
                className="w-7 h-7 rounded object-cover shadow-subtle"
              />
            ) : (
              <div className="w-7 h-7 rounded bg-[#C25E42] text-white flex items-center justify-center font-serif text-sm font-bold">
                {(spectrumConfig.title || 'C').charAt(0)}
              </div>
            )}
            <div>
              <span className="font-serif font-bold text-sm text-[#1C1917] block leading-tight">
                {spectrumConfig.title || 'Creative Spectrum'}
              </span>
              <span className="text-[10px] text-[#C25E42] font-semibold uppercase tracking-wider block">
                Central Admin Portal
              </span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSwitchToStudentView}
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] px-2.5 py-1.5 rounded border border-[#E7E0D8] bg-[#FAF8F5] hover:bg-[#F4EFEA] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Student View</span>
          </button>

          <div className="flex items-center gap-3 border-l border-[#E7E0D8] pl-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-[#1C1917] block leading-tight">Administrator</span>
              <span className="text-[10px] text-[#78716C]">Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-[#78716C] hover:text-[#B84A39] hover:bg-[#FDF1EF] rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#E7E0D8] bg-white p-4 space-y-6 overflow-y-auto">
          <nav className="space-y-6">
            <div>
              <button
                onClick={() => onSelectTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#FAF0ED] text-[#C25E42] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview Dashboard</span>
              </button>
            </div>

            {navigation.slice(1).map((section, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] px-3 block mb-1">
                  {section.group}
                </span>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#FAF0ED] text-[#C25E42] font-semibold'
                          : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FAF0ED] text-[#C25E42] border border-[#EAD8D2]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* MOBILE SIDEBAR MODAL */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-[80%] bg-white h-full p-4 flex flex-col space-y-4 z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
                <span className="font-serif font-bold text-sm text-[#1C1917]">Admin Menu</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-[#78716C]" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => { onSelectTab('overview'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#1C1917]"
                >
                  Overview
                </button>
                <button
                  onClick={() => { onSelectTab('clubs'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#1C1917]"
                >
                  All Clubs
                </button>
                <button
                  onClick={() => { onSelectTab('branding'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#C25E42] font-semibold"
                >
                  Club Branding Studio
                </button>
                <button
                  onClick={() => { onSelectTab('registrations'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#1C1917]"
                >
                  Registrations
                </button>
                <button
                  onClick={() => { onSelectTab('events'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#1C1917]"
                >
                  Events
                </button>
                <button
                  onClick={() => { onSelectTab('media'); setMobileSidebarOpen(false); }}
                  className="w-full text-left py-2 text-xs font-medium text-[#1C1917]"
                >
                  Media Library
                </button>

              </div>

              <div className="mt-auto pt-4 border-t border-[#E7E0D8]">
                <button
                  onClick={() => { onSwitchToStudentView(); setMobileSidebarOpen(false); }}
                  className="w-full py-2 text-xs text-center border border-[#E7E0D8] rounded text-[#78716C]"
                >
                  Exit to Student View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN ADMIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
