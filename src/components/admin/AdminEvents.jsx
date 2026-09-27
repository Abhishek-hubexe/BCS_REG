import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, Trash2, Edit, Check, Clock, MapPin, Users, X } from 'lucide-react';
import Badge from '../common/Badge';

export default function AdminEvents({
  events = [],
  clubs = [],
  onEventCreated,
  onEventDeleted
}) {
  const [viewMode, setViewMode] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);

  // New Event Form State
  const [formData, setFormData] = useState({
    title: '',
    club_id: clubs[0]?.id || 1,
    date: '2026-10-25',
    time: '10:00 AM – 01:00 PM',
    location: 'Turing Hall, Academic Block C',
    category: 'Workshop',
    description: '',
    capacity: 100
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');

      if (onEventCreated) onEventCreated(data.event);
      setModalOpen(false);
      setFormData({
        title: '',
        club_id: clubs[0]?.id || 1,
        date: '2026-10-25',
        time: '10:00 AM – 01:00 PM',
        location: 'Turing Hall, Academic Block C',
        category: 'Workshop',
        description: '',
        capacity: 100
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (onEventDeleted) onEventDeleted(id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Campus Events & Programming</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Schedule workshops, symposiums, and auditions across collegiate societies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule New Event</span>
          </button>
        </div>
      </div>

      {/* EVENTS TABLE / LIST */}
      <div className="editorial-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E7E0D8] text-[#78716C] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Event Title</th>
                <th className="py-3.5 px-4">Organizing Guild</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Venue</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D8]">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-sm text-[#1C1917] block">{evt.title}</span>
                    <span className="text-[11px] text-[#78716C]">{evt.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#1C1917] font-medium">{evt.club_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[#1C1917] block">{evt.date}</span>
                    <span className="text-[11px] text-[#78716C]">{evt.time}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#78716C]">{evt.location}</td>
                  <td className="py-3.5 px-4 font-mono text-[#78716C]">{evt.capacity}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="sage" size="xs">Published</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1 rounded text-[#B84A39] hover:bg-[#FDF1EF]"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-lg p-6 sm:p-8 space-y-6 shadow-elevated z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">Schedule New Event</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#78716C] hover:text-[#1C1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Design Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="editorial-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Host Guild</label>
                  <select
                    value={formData.club_id}
                    onChange={(e) => setFormData({ ...formData, club_id: e.target.value })}
                    className="editorial-input bg-white"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Event Type</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="editorial-input bg-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Performance">Performance</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Audition">Audition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="editorial-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1">Time Range</label>
                  <input
                    type="text"
                    placeholder="02:00 PM – 05:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="editorial-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Campus Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media Wing Lab 4"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="editorial-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C1917] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="editorial-input"
                  placeholder="Outline topics covered and student prerequisites..."
                />
              </div>

              <div className="pt-3 border-t border-[#E7E0D8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded text-[#78716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#C25E42] text-white rounded font-medium hover:bg-[#A94E35]"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
