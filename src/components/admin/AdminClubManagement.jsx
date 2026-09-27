import React, { useState } from 'react';
import { Search, Plus, Edit2, Palette, Eye, Trash2, X, Check, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function AdminClubManagement({
  clubs = [],
  onNavigateTab,
  onSelectClubForBranding,
  onSelectClubForView,
  onDeleteClub,
  onClubUpdated
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingClub, setEditingClub] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editCoverFile, setEditCoverFile] = useState(null);
  const [editScrapbook1File, setEditScrapbook1File] = useState(null);
  const [editScrapbook2File, setEditScrapbook2File] = useState(null);
  const [editScrapbook3File, setEditScrapbook3File] = useState(null);

  const [editLogoPreview, setEditLogoPreview] = useState('');
  const [editCoverPreview, setEditCoverPreview] = useState('');
  const [editScrapbook1Preview, setEditScrapbook1Preview] = useState('');
  const [editScrapbook2Preview, setEditScrapbook2Preview] = useState('');
  const [editScrapbook3Preview, setEditScrapbook3Preview] = useState('');
  const [feedback, setFeedback] = useState(null);

  const filteredClubs = clubs.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.president?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenEdit = (club) => {
    const clubCopy = { ...club };
    if (!clubCopy.audition_info) {
      clubCopy.audition_info = {
        tagline: 'Your voice. Our stage.',
        registrations_open: 'Oct 01, 2026',
        live_auditions: 'Oct 07-08, 2026',
        results_announced: 'Oct 10, 2026',
        steps: [
          { title: 'Registration', desc: 'Fill the form with accurate details.' },
          { title: 'Live Audition', desc: 'Vocal / Instrument round or performance demonstration.' },
          { title: 'Shortlisting', desc: 'Selected candidates will be informed.' },
          { title: 'Final List', desc: 'Results will be announced.' }
        ]
      };
    }
    setEditingClub(clubCopy);
    setEditLogoFile(null);
    setEditCoverFile(null);
    setEditScrapbook1File(null);
    setEditScrapbook2File(null);
    setEditScrapbook3File(null);

    setEditLogoPreview(club.logo || '');
    setEditCoverPreview(club.cover_image || '');
    setEditScrapbook1Preview(club.scrapbook_images?.image1 || '');
    setEditScrapbook2Preview(club.scrapbook_images?.image2 || '');
    setEditScrapbook3Preview(club.scrapbook_images?.image3 || '');

    setFeedback(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingClub) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      // 1. Update text fields
      const res = await fetch(`/api/clubs/${editingClub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingClub)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update club');

      let updatedClub = data.club;

      // 2. Upload new logo if selected
      if (editLogoFile) {
        const logoForm = new FormData();
        logoForm.append('asset', editLogoFile);
        logoForm.append('type', 'logo');

        const logoRes = await fetch(`/api/clubs/${editingClub.id}/upload-asset`, {
          method: 'POST',
          body: logoForm
        });
        if (logoRes.ok) {
          const logoData = await logoRes.json();
          updatedClub = logoData.club;
        }
      }

      // 3. Upload new cover image / showcase artwork if selected
      if (editCoverFile) {
        const coverForm = new FormData();
        coverForm.append('asset', editCoverFile);
        coverForm.append('type', 'cover');

        const coverRes = await fetch(`/api/clubs/${editingClub.id}/upload-asset`, {
          method: 'POST',
          body: coverForm
        });
        if (coverRes.ok) {
          const coverData = await coverRes.json();
          updatedClub = coverData.club;
        }
      }

      // 4. Upload Scrapbook Images if selected
      const uploadScrapbook = async (file, type) => {
        if (!file) return;
        const sbForm = new FormData();
        sbForm.append('asset', file);
        sbForm.append('type', type);
        const uploadRes = await fetch(`/api/clubs/${editingClub.id}/upload-asset`, {
          method: 'POST',
          body: sbForm
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          updatedClub = uploadData.club;
        }
      };

      await uploadScrapbook(editScrapbook1File, 'scrapbook1');
      await uploadScrapbook(editScrapbook2File, 'scrapbook2');
      await uploadScrapbook(editScrapbook3File, 'scrapbook3');

      if (onClubUpdated) onClubUpdated(updatedClub);
      setEditingClub(null);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAuditionChange = (field, value) => {
    setEditingClub(prev => {
      const newAudition = prev.audition_info ? JSON.parse(JSON.stringify(prev.audition_info)) : {
        tagline: '', registrations_open: '', live_auditions: '', results_announced: '',
        process: ''
      };
      
      newAudition[field] = value;
      return { ...prev, audition_info: newAudition };
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">All Collegiate Guilds</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Directory of chartered societies, custom artwork, logos, and Markdown descriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('create-club')}
            className="px-4 py-2 bg-[#C25E42] text-white text-xs font-semibold rounded-md hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Guild</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="editorial-card p-4 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clubs by name, code, or lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            className="editorial-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#78716C]">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="editorial-input py-1.5 text-xs bg-white w-auto"
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
          </select>
        </div>
      </div>

      {/* CLUBS TABLE */}
      <div className="editorial-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E7E0D8] text-[#78716C] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Guild & Artwork</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Members</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E0D8]">
              {filteredClubs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-xs text-[#78716C]">
                    <p className="font-serif font-bold text-base text-[#1C1917] mb-1">No collegiate guilds found</p>
                    <p className="max-w-md mx-auto">Use the "Add New Guild" button to register official campus clubs and societies.</p>
                  </td>
                </tr>
              ) : (
                filteredClubs.map((club) => (
                  <tr key={club.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Guild, Logo & Showcase Artwork */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <ClubLogo
                          src={club.logo}
                          name={club.name}
                          size="md"
                          accentColor={club.accent_color}
                        />
                        {club.cover_image && (
                          <div className="w-10 h-8 rounded border border-[#E7E0D8] overflow-hidden bg-stone-100 flex-shrink-0">
                            <img src={club.cover_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="font-serif font-bold text-sm text-[#1C1917] block">
                            {club.name}
                          </span>
                          <span className="text-[11px] text-[#A8A29E] font-mono">
                            {club.code || `CS-0${club.id}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <Badge variant={club.category === 'Technical' ? 'terracotta' : 'neutral'} size="xs">
                        {club.category}
                      </Badge>
                    </td>



                    {/* Members */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1C1917]">
                      {club.members_count || 0}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant="sage" size="xs">
                        {club.status || 'Active'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(club)}
                          className="px-2.5 py-1 rounded bg-white border border-[#E7E0D8] text-[#1C1917] font-medium text-[11px] hover:border-[#C25E42] hover:text-[#C25E42] transition-colors flex items-center gap-1 shadow-xs"
                          title="Edit Club Details & Artwork"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onSelectClubForBranding(club.id)}
                          className="px-2.5 py-1 rounded bg-[#FAF0ED] text-[#C25E42] font-medium text-[11px] hover:bg-[#F3DDD5] transition-colors flex items-center gap-1"
                          title="Open in Branding Studio"
                        >
                          <Palette className="w-3 h-3" />
                          <span>Brand</span>
                        </button>

                        <button
                          onClick={() => onSelectClubForView(club)}
                          className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#78716C] hover:text-[#1C1917] transition-colors"
                          title="View Public Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {onDeleteClub && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to completely delete "${club.name}"?`)) {
                                onDeleteClub(club.id);
                              }
                            }}
                            className="p-1.5 rounded hover:bg-rose-50 text-[#78716C] hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Club"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* ================= EDIT CLUB MODAL ================= */}
      {editingClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E7E0D8] shadow-2xl max-w-3xl w-full my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E7E0D8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#C25E42]" />
                <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                  Edit Guild: {editingClub.name}
                </h2>
              </div>
              <button
                onClick={() => setEditingClub(null)}
                className="p-1.5 rounded-full hover:bg-[#E7E0D8] text-[#78716C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {feedback && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {feedback.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guild Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Guild Name
                  </label>
                  <input
                    type="text"
                    value={editingClub.name}
                    onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                    className="editorial-input text-xs"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Category
                  </label>
                  <select
                    value={editingClub.category}
                    onChange={(e) => setEditingClub({ ...editingClub, category: e.target.value })}
                    className="editorial-input text-xs bg-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Creative">Creative</option>
                    <option value="Sports">Sports</option>
                    <option value="Media">Media</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                  </select>
                </div>

                {/* Tagline */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Tagline (Editorial Motto)
                  </label>
                  <input
                    type="text"
                    value={editingClub.tagline || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, tagline: e.target.value })}
                    className="editorial-input text-xs"
                  />
                </div>

                {/* Logo File */}
                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-2">
                  <label className="block text-xs font-semibold text-[#1C1917]">
                    Guild Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setEditLogoFile(f);
                        setEditLogoPreview(URL.createObjectURL(f));
                      }
                    }}
                    className="editorial-input text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#FAF0ED] file:text-[#C25E42]"
                  />
                  {editLogoPreview && (
                    <div className="flex items-center gap-3 pt-1">
                      <img src={editLogoPreview} alt="Logo" className="w-10 h-10 object-contain rounded border border-[#E7E0D8] bg-white p-1" />
                      <span className="text-[11px] text-[#78716C]">Current / Selected Logo</span>
                    </div>
                  )}
                </div>

                {/* Showcase Artwork / Cover Image */}
                <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-2">
                  <label className="block text-xs font-semibold text-[#1C1917]">
                    Showcase Artwork / Cover Graphic
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setEditCoverFile(f);
                        setEditCoverPreview(URL.createObjectURL(f));
                      }
                    }}
                    className="editorial-input text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-[#FAF0ED] file:text-[#C25E42]"
                  />
                  {editCoverPreview && (
                    <div className="flex items-center gap-3 pt-1">
                      <img src={editCoverPreview} alt="Cover" className="w-14 h-10 object-cover rounded border border-[#E7E0D8]" />
                      <span className="text-[11px] text-[#78716C]">Current / Selected Artwork</span>
                    </div>
                  )}
                </div>

                {/* Custom Scrapbook Images */}
                <div className="sm:col-span-2 p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1917]">Scrapbook Aesthetic</h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5">Upload custom polaroids/images to display on the club's profile margins.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Primary Polaroid */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-[#1C1917]">Primary Polaroid (Left)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setEditScrapbook1File(f);
                            setEditScrapbook1Preview(URL.createObjectURL(f));
                          }
                        }}
                        className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                      />
                      {editScrapbook1Preview && (
                        <img src={editScrapbook1Preview} alt="Primary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                      )}
                    </div>

                    {/* Secondary Polaroid */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-[#1C1917]">Secondary Polaroid (Right Top)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setEditScrapbook2File(f);
                            setEditScrapbook2Preview(URL.createObjectURL(f));
                          }
                        }}
                        className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                      />
                      {editScrapbook2Preview && (
                        <img src={editScrapbook2Preview} alt="Secondary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                      )}
                    </div>

                    {/* Tertiary Polaroid */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-[#1C1917]">Tertiary Polaroid (Right Bottom)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setEditScrapbook3File(f);
                            setEditScrapbook3Preview(URL.createObjectURL(f));
                          }
                        }}
                        className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                      />
                      {editScrapbook3Preview && (
                        <img src={editScrapbook3Preview} alt="Tertiary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Charter Description (Markdown) */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#1C1917]">
                      Charter Description (Markdown Supported)
                    </label>
                    <span className="text-[11px] text-[#A8A29E]">Use ### for headers, **text** for bold</span>
                  </div>
                  <textarea
                    rows={8}
                    value={editingClub.description}
                    onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                    className="editorial-input text-xs leading-relaxed font-mono"
                    required
                  />
                </div>

                {/* President & Vice President */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Lead
                  </label>
                  <input
                    type="text"
                    value={editingClub.president || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, president: e.target.value })}
                    className="editorial-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Co-Lead
                  </label>
                  <input
                    type="text"
                    value={editingClub.vice_president || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, vice_president: e.target.value })}
                    className="editorial-input text-xs"
                  />
                </div>


              </div>

              {/* Audition Details Configuration */}
              <div className="pt-6 border-t border-[#E7E0D8] space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1C1917]">Audition Details</h3>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Customize the audition process, dates, and tagline shown to students.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Audition Tagline</label>
                    <input
                      type="text"
                      value={editingClub.audition_info.tagline}
                      onChange={(e) => handleEditAuditionChange('tagline', e.target.value)}
                      className="editorial-input text-xs"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Registrations Open Date</label>
                    <input
                      type="text"
                      value={editingClub.audition_info.registrations_open}
                      onChange={(e) => handleEditAuditionChange('registrations_open', e.target.value)}
                      className="editorial-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Live Auditions Date(s)</label>
                    <input
                      type="text"
                      value={editingClub.audition_info.live_auditions}
                      onChange={(e) => handleEditAuditionChange('live_auditions', e.target.value)}
                      className="editorial-input text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Results Announced Date</label>
                    <input
                      type="text"
                      value={editingClub.audition_info.results_announced}
                      onChange={(e) => handleEditAuditionChange('results_announced', e.target.value)}
                      className="editorial-input text-xs sm:w-1/2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-[#1C1917]">Audition Process Steps</h4>
                  <div className="p-4 bg-[#FAF8F5] border border-[#E7E0D8] rounded-md">
                    <label className="block text-[11px] font-semibold text-[#1C1917] mb-1.5">Process Description</label>
                    <textarea
                      rows={5}
                      value={editingClub.audition_info.process || ''}
                      onChange={(e) => handleEditAuditionChange('process', e.target.value)}
                      className="editorial-input text-xs bg-white resize-y"
                      placeholder="Describe the full audition process here..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-between gap-3">
                {onDeleteClub && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete "${editingClub.name}"?`)) {
                        onDeleteClub(editingClub.id);
                        setEditingClub(null);
                      }
                    }}
                    className="px-3 py-2 border border-rose-200 text-rose-600 text-xs font-medium rounded hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Guild</span>
                  </button>
                )}
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingClub(null)}
                    className="px-4 py-2 border border-[#E7E0D8] text-xs font-medium rounded hover:bg-[#FAF8F5] text-[#78716C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#C25E42] text-white text-xs font-semibold rounded hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
