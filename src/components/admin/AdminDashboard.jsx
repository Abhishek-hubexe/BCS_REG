import React from 'react';
import { Compass, Users, FileCheck, Calendar, ArrowUpRight, TrendingUp, Download, ArrowRight, Share2 } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function AdminDashboard({
  stats = {},
  clubs = [],
  registrations = [],
  events = [],
  auditLogs = [],
  onNavigateTab
}) {
  const totalClubs = stats.totalClubs !== undefined ? stats.totalClubs : clubs.length;
  const totalStudents = stats.totalStudents !== undefined ? stats.totalStudents : 0;
  const totalRegistrations = stats.totalRegistrations !== undefined ? stats.totalRegistrations : registrations.length;
  const totalEvents = stats.totalEvents !== undefined ? stats.totalEvents : events.length;

  const clubBreakdown = stats.clubBreakdown || clubs.map(c => ({
    name: c.name,
    count: registrations.filter(r => r.club_id === c.id).length
  }));

  const departmentBreakdown = stats.departmentBreakdown || {};

  const handleDownloadExcel = () => {
    window.location.href = '/api/admin/export-excel';
  };

  return (
    <div className="space-y-8">
      {/* HEADER & EXCEL EXPORT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Administrative Overview</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Real-time enrollment metrics, guild status, and institutional audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('official-links')}
            className="px-4 py-2 bg-white border border-[#E7E0D8] hover:border-[#C25E42] text-xs font-medium text-[#1C1917] hover:text-[#C25E42] rounded-md transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#C25E42]" />
            <span>Official Links</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-white border border-[#E7E0D8] hover:border-[#C25E42] text-xs font-medium text-[#1C1917] hover:text-[#C25E42] rounded-md transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#78716C]" />
            <span>Export Database (.xlsx)</span>
          </button>

          <button
            onClick={() => onNavigateTab('branding')}
            className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <span>Club Branding Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 RESTRAINED STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="editorial-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>Active Guilds</span>
            <Compass className="w-4 h-4 text-[#C25E42]" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] block">
            {totalClubs}
          </span>
          <span className="text-[11px] text-[#5D7A68] font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% active status
          </span>
        </div>

        <div className="editorial-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-[#C25E42]" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] block">
            {totalStudents}
          </span>
          <span className="text-[11px] text-[#78716C]">
            {totalStudents === 0 ? 'No registered student accounts' : totalStudents === 1 ? '1 registered student account' : `${totalStudents} registered student accounts`}
          </span>
        </div>

        <div className="editorial-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>Club Registrations</span>
            <FileCheck className="w-4 h-4 text-[#C25E42]" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] block">
            {totalRegistrations}
          </span>
          <span className="text-[11px] text-[#C25E42] font-medium">Audition submissions</span>
        </div>

        <div className="editorial-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>Published Events</span>
            <Calendar className="w-4 h-4 text-[#C25E42]" />
          </div>
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] block">
            {totalEvents}
          </span>
          <span className="text-[11px] text-[#5D7A68] font-medium">Autumn Term 2026</span>
        </div>
      </div>

      {/* CHARTS / ANALYTICS SECTION: RESTRAINED NEUTRAL + TERRACOTTA PALETTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Guild Participation Breakdown */}
        <div className="lg:col-span-7 editorial-card p-6 bg-white space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Guild Enrollment Distribution</h3>
              <p className="text-xs text-[#78716C]">Applications received per collegiate society.</p>
            </div>
            <button
              onClick={() => onNavigateTab('registrations')}
              className="text-xs text-[#C25E42] hover:underline"
            >
              View table
            </button>
          </div>

          {/* Bar Visualization */}
          <div className="space-y-3.5 pt-2">
            {clubBreakdown.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#78716C]">
                <p className="font-serif font-bold text-sm text-[#1C1917] mb-1">No clubs chartered yet</p>
                <p>Guild participation will populate once clubs are chartered.</p>
              </div>
            ) : totalRegistrations === 0 ? (
              <div className="py-8 text-center text-xs text-[#78716C]">
                <p className="font-serif font-bold text-sm text-[#1C1917] mb-1">No applications submitted yet</p>
                <p>Registration distribution will update live as students apply.</p>
              </div>
            ) : (
              clubBreakdown.map((item, idx) => {
                const maxVal = Math.max(...clubBreakdown.map((b) => b.count || 1), 1);
                const percentage = Math.round(((item.count || 0) / maxVal) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1C1917]">{item.name}</span>
                      <span className="text-[#78716C] font-mono">{item.count || 0} registrations</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#FAF8F5] border border-[#E7E0D8] overflow-hidden">
                      <div
                        className="h-full bg-[#C25E42] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Academic Department Representation */}
        <div className="lg:col-span-5 editorial-card p-6 bg-white space-y-5">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C1917]">Department Representation</h3>
            <p className="text-xs text-[#78716C]">Academic origin of active applicants.</p>
          </div>

          <div className="divide-y divide-[#E7E0D8]">
            {Object.keys(departmentBreakdown).length === 0 ? (
              <div className="py-8 text-center text-xs text-[#78716C]">
                <p className="font-serif font-bold text-sm text-[#1C1917] mb-1">No applications submitted yet</p>
                <p>Department demographics will appear live once enrolled students apply.</p>
              </div>
            ) : (
              Object.entries(departmentBreakdown).map(([dept, count], idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <span className="text-[#1C1917] font-medium truncate max-w-[200px]">{dept}</span>
                  <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E7E0D8] text-[#78716C] font-mono">
                    {count} {count === 1 ? 'student' : 'students'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
