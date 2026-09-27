import React, { useState } from 'react';
import { Bell, Plus, Trash2, Check, X } from 'lucide-react';
import Badge from '../common/Badge';

export default function AdminAnnouncements({
  announcements = [],
  clubs = [],
  onAnnouncementCreated,
  onAnnouncementDeleted
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_club: 'All Clubs',
    author: 'Admin'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post announcement');

      if (onAnnouncementCreated) onAnnouncementCreated(data.announcement);
      setModalOpen(false);
      setFormData({
        title: '',
        description: '',
        target_club: 'All Clubs',
        author: 'Admin'
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this announcement broadcast?')) return;
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (onAnnouncementDeleted) onAnnouncementDeleted(id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Campus Announcements & Notices</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Publish institutional broadcasts to all clubs or targeted student cohorts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Broadcast Notice</span>
        </button>
      </div>

      <div className="editorial-card divide-y divide-[#E7E0D8] bg-white">
        {announcements.map((ann) => (
          <div key={ann.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1 max-w-2xl">
              <div className="flex items-center gap-3">
                <Badge variant="terracotta" size="xs">{ann.target_club}</Badge>
                <span className="text-[11px] text-[#A8A29E] font-mono">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">{ann.title}</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">{ann.description}</p>
              <span className="text-[11px] text-[#78716C] block">Issued by: <strong>{ann.author}</strong></span>
            </div>

            <button
              onClick={() => handleDelete(ann.id)}
              className="p-1.5 rounded text-[#B84A39] hover:bg-[#FDF1EF] self-start md:self-center"
              title="Delete Notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-lg p-6 sm:p-8 space-y-6 shadow-elevated z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">Draft Institutional Notice</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Central Quad Auditions"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Target Audience</label>
                <select
                  value={formData.target_club}
                  onChange={(e) => setFormData({ ...formData, target_club: e.target.value })}
                  className="editorial-input bg-white"
                >
                  <option value="All Clubs">All Clubs & Societies</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Body Text *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="editorial-input"
                  placeholder="Details of the announcement, timelines, and action requirements..."
                />
              </div>

              <div className="pt-3 border-t border-[#E7E0D8] flex items-center justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded text-[#78716C]">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#C25E42] text-white rounded font-medium hover:bg-[#A94E35]">
                  {isSubmitting ? 'Transmitting...' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
