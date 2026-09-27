import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, XCircle, Clock, Eye, Download, X, Mail, Phone, BookOpen, Layers } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function AdminRegistrations({
  registrations = [],
  clubs = [],
  onUpdateRegistrationStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeDrawerReg, setActiveDrawerReg] = useState(null);

  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      r.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.usn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reg_code?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (regId, newStatus) => {
    try {
      const res = await fetch(`/api/registrations/${regId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      if (onUpdateRegistrationStatus) {
        onUpdateRegistrationStatus(regId, newStatus);
      }

      if (activeDrawerReg && activeDrawerReg.id === regId) {
        setActiveDrawerReg({ ...activeDrawerReg, status: newStatus });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadExcel = () => {
    window.location.href = '/api/admin/export-excel';
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Registration & Application Management</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Review student admissions, evaluate audition milestones, and grant official guild status.
          </p>
        </div>

        <button
          onClick={handleDownloadExcel}
          className="px-4 py-2 bg-white border border-[#E7E0D8] hover:border-[#C25E42] text-xs font-medium text-[#1C1917] rounded-md transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#78716C]" />
          <span>Export Excel Sheet</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="editorial-card p-4 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by student name, USN, or club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            className="editorial-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#78716C]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="editorial-input py-1.5 text-xs bg-white w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* REGISTRATIONS TABLE */}
      <div className="editorial-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E7E0D8] text-[#78716C] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">USN / ID</th>
                <th className="py-3.5 px-4">Target Society</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D8]">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#78716C]">
                    No registrations found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-[#1C1917] block">{reg.student_name}</span>
                        <span className="text-[11px] text-[#78716C]">{reg.student_email}</span>
                      </div>
                    </td>

                    {/* USN */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1C1917]">
                      {reg.usn || 'N/A'}
                    </td>

                    {/* Club */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <ClubLogo src={reg.club_logo} name={reg.club_name} size="xs" />
                        <span className="font-medium text-[#1C1917]">{reg.club_name}</span>
                      </div>
                    </td>

                    {/* Dept */}
                    <td className="py-3.5 px-4 text-[#78716C] truncate max-w-[150px]">
                      {reg.department}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#78716C] font-mono">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={reg.status} size="xs">
                        {reg.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveDrawerReg(reg)}
                          className="p-1 rounded text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFEA]"
                          title="View Application Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {reg.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(reg.id, 'approved')}
                            className="p-1 rounded text-[#5D7A68] hover:bg-[#EEF3F0]"
                            title="Approve Application"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {reg.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(reg.id, 'rejected')}
                            className="p-1 rounded text-[#B84A39] hover:bg-[#FDF1EF]"
                            title="Reject Application"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION DRAWER MODAL */}
      {activeDrawerReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs"
            onClick={() => setActiveDrawerReg(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-elevated z-10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E0D8]">
                <div>
                  <span className="text-[11px] font-mono text-[#A8A29E] uppercase tracking-wider block">
                    {activeDrawerReg.reg_code || `REG-00${activeDrawerReg.id}`}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917] mt-0.5">
                    Registration Dossier
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDrawerReg(null)}
                  className="p-1 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Overview */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#1C1917]">
                    {activeDrawerReg.student_name}
                  </h4>
                  <Badge variant={activeDrawerReg.status} size="xs">
                    {activeDrawerReg.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-[#78716C]">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#A8A29E]">USN / ID</span>
                    <span className="font-mono text-[#1C1917]">{activeDrawerReg.usn}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#A8A29E]">Department</span>
                    <span className="text-[#1C1917]">{activeDrawerReg.department}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#A8A29E]">Email</span>
                    <span className="text-[#1C1917] truncate block">{activeDrawerReg.student_email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#A8A29E]">Phone</span>
                    <span className="text-[#1C1917]">{activeDrawerReg.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Target Society */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1C1917]">Applied Society:</span>
                <div className="p-3 rounded-lg border border-[#E7E0D8] bg-white flex items-center gap-3">
                  <ClubLogo src={activeDrawerReg.club_logo} name={activeDrawerReg.club_name} size="sm" />
                  <div>
                    <span className="font-bold text-xs text-[#1C1917] block">{activeDrawerReg.club_name}</span>
                    <span className="text-[11px] text-[#78716C]">{activeDrawerReg.category || 'Collegiate Guild'}</span>
                  </div>
                </div>
              </div>

              {/* Application Notes */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1C1917]">Administrative Note:</span>
                <p className="text-xs text-[#78716C] p-3 rounded bg-[#FAF8F5] border border-[#E7E0D8] leading-relaxed">
                  {activeDrawerReg.notes || 'Audition scheduled with guild coordinator. Portfolio evaluation pending.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E7E0D8] flex items-center gap-3">
              <button
                onClick={() => handleStatusChange(activeDrawerReg.id, 'approved')}
                className="flex-1 py-2.5 rounded bg-[#5D7A68] text-white text-xs font-medium hover:bg-[#4E6757] transition-colors"
              >
                Approve Student
              </button>
              <button
                onClick={() => handleStatusChange(activeDrawerReg.id, 'rejected')}
                className="flex-1 py-2.5 rounded bg-[#B84A39] text-white text-xs font-medium hover:bg-[#9E3E2F] transition-colors"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
