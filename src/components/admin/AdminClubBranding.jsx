import React, { useState, useEffect } from 'react';
import { Palette, Upload, Trash2, RotateCcw, Check, Eye, Image as ImageIcon, Sparkles, AlertCircle, Layers } from 'lucide-react';
import ClubLogo from '../common/ClubLogo';
import Badge from '../common/Badge';

export default function AdminClubBranding({
  clubs = [],
  selectedClubId = null,
  onUpdateClubBranding
}) {
  const [activeClubId, setActiveClubId] = useState(selectedClubId || clubs[0]?.id || 1);
  const [activeClub, setActiveClub] = useState(null);

  // Editable branding states
  const [logoInput, setLogoInput] = useState('');
  const [coverInput, setCoverInput] = useState('');
  const [taglineInput, setTaglineInput] = useState('');
  const [accentColor, setAccentColor] = useState('#C25E42');
  const [galleryImages, setGalleryImages] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewBg, setPreviewBg] = useState('light'); // 'light' | 'dark' | 'transparent'

  // Update local form state when selected club changes
  useEffect(() => {
    const club = clubs.find((c) => c.id === Number(activeClubId)) || clubs[0];
    if (club) {
      setActiveClub(club);
      setLogoInput(club.logo || '');
      setCoverInput(club.cover_image || '');
      setTaglineInput(club.tagline || '');
      setAccentColor(club.accent_color || '#C25E42');
      setGalleryImages(club.gallery || []);
    }
  }, [activeClubId, clubs]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file || !activeClub) return;

    const formData = new FormData();
    formData.append('asset', file);
    formData.append('type', type); // 'logo' | 'cover' | 'gallery'

    try {
      const res = await fetch(`/api/clubs/${activeClub.id}/upload-asset`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (type === 'logo') {
        setLogoInput(data.url);
      } else if (type === 'cover') {
        setCoverInput(data.url);
      } else if (type === 'gallery') {
        setGalleryImages((prev) => [...prev, data.url]);
      }

      setFeedback({ type: 'success', text: `Uploaded ${file.name} successfully!` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleRemoveLogo = () => {
    setLogoInput('');
    setFeedback({ type: 'info', text: 'Logo removed. Monogram fallback will be displayed until a new mark is uploaded.' });
  };

  const handleResetLogo = () => {
    if (activeClub) {
      setLogoInput(activeClub.logo || '');
      setFeedback({ type: 'info', text: 'Logo reset to existing saved version.' });
    }
  };

  const handleSaveBranding = async () => {
    if (!activeClub) return;
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/clubs/${activeClub.id}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo: logoInput,
          cover_image: coverInput,
          tagline: taglineInput,
          accent_color: accentColor,
          gallery: galleryImages
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update club branding');

      setFeedback({
        type: 'success',
        text: `Branding for "${activeClub.name}" saved and synced globally across all public & student views!`
      });

      if (onUpdateClubBranding) {
        onUpdateClubBranding(data.club);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeClub) {
    return <div className="p-8 text-center text-sm text-[#78716C]">No clubs available to brand.</div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER & CLUB SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0ED] text-[#C25E42] text-[11px] font-semibold tracking-wide">
            <Palette className="w-3.5 h-3.5" />
            <span>Central Brand Identity Management</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917] mt-1">
            Club Branding Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Update logos, cover photography, and visual styles. Changes immediately update across discovery, profiles, registration, and dashboards.
          </p>
        </div>

        {/* Club Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[#1C1917]">Guild:</label>
          <select
            value={activeClubId}
            onChange={(e) => setActiveClubId(Number(e.target.value))}
            className="editorial-input py-2 text-xs bg-white font-medium w-auto min-w-[200px]"
          >
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code || `CS-0${c.id}`})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FEEDBACK ALERT */}
      {feedback && (
        <div
          className={`p-4 rounded-md text-xs font-medium flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-[#EEF3F0] text-[#2C4233] border border-[#C8D9CE]'
              : feedback.type === 'error'
              ? 'bg-[#FDF1EF] text-[#6B241A] border border-[#F0C9C2]'
              : 'bg-[#FAF0ED] text-[#5C2314] border border-[#EAD8D2]'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="underline text-[11px] ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN STUDIO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: BRANDING CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. LOGO MANAGEMENT CARD */}
          <div className="editorial-card p-6 bg-white space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">Guild Mark / Logo</h3>
                <p className="text-xs text-[#78716C]">
                  PNG, JPG, SVG, WebP with transparent or solid background.
                </p>
              </div>
              <Badge variant="terracotta" size="xs">Auto-scaled</Badge>
            </div>

            {/* Logo URL Input & File Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#1C1917]">
                Logo Image URL or Direct File Upload
              </label>
              <input
                type="text"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="https://... or /uploads/mark.png"
                className="editorial-input text-xs"
              />

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <label className="cursor-pointer px-3 py-1.5 rounded bg-[#FAF8F5] border border-[#E7E0D8] text-xs font-medium text-[#1C1917] hover:bg-[#F4EFEA] transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#C25E42]" />
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml, image/webp"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-3 py-1.5 rounded bg-white border border-[#E7E0D8] text-xs font-medium text-[#B84A39] hover:bg-[#FDF1EF] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="px-3 py-1.5 rounded bg-white border border-[#E7E0D8] text-xs font-medium text-[#78716C] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Logo Preview Matrix (Light, Dark, Transparent tests) */}
            <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                  Live Logo Rendering Check
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    onClick={() => setPreviewBg('light')}
                    className={`px-2 py-0.5 rounded ${previewBg === 'light' ? 'bg-white border text-[#1C1917] font-semibold' : 'text-[#78716C]'}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2 py-0.5 rounded ${previewBg === 'dark' ? 'bg-[#1C1917] text-white font-semibold' : 'text-[#78716C]'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div
                className={`p-6 rounded flex items-center justify-center gap-6 transition-colors ${
                  previewBg === 'dark' ? 'bg-[#1C1917]' : 'bg-white border border-[#E7E0D8]'
                }`}
              >
                <div className="text-center space-y-1">
                  <ClubLogo src={logoInput} name={activeClub.name} size="sm" accentColor={accentColor} />
                  <span className="text-[10px] text-[#78716C] block">Small (32px)</span>
                </div>
                <div className="text-center space-y-1">
                  <ClubLogo src={logoInput} name={activeClub.name} size="md" accentColor={accentColor} />
                  <span className="text-[10px] text-[#78716C] block">Medium (40px)</span>
                </div>
                <div className="text-center space-y-1">
                  <ClubLogo src={logoInput} name={activeClub.name} size="lg" accentColor={accentColor} />
                  <span className="text-[10px] text-[#78716C] block">Large (56px)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. COVER IMAGE & PHOTOGRAPHY */}
          <div className="editorial-card p-6 bg-white space-y-6">
            <div className="pb-3 border-b border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Hero Photography & Cover</h3>
              <p className="text-xs text-[#78716C]">
                Used on club profile banner, featured cards, and discovery headers.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#1C1917]">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverInput}
                onChange={(e) => setCoverInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="editorial-input text-xs"
              />

              <div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF8F5] border border-[#E7E0D8] text-xs font-medium text-[#1C1917] hover:bg-[#F4EFEA] transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#C25E42]" />
                  <span>Upload Local Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3. TAGLINE & SECONDARY ACCENT */}
          <div className="editorial-card p-6 bg-white space-y-6">
            <div className="pb-3 border-b border-[#E7E0D8]">
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">Tagline & Secondary Tone</h3>
              <p className="text-xs text-[#78716C]">
                Short editorial motto shown under the club title.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Editorial Tagline
                </label>
                <input
                  type="text"
                  value={taglineInput}
                  onChange={(e) => setTaglineInput(e.target.value)}
                  className="editorial-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Accent Tint (Used for logo monograms & subtle borders)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-8 rounded border border-[#E7E0D8] cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-[#78716C]">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleSaveBranding}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3 bg-[#C25E42] text-white text-xs font-medium rounded-md hover:bg-[#A94E35] transition-all shadow-subtle flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Updating Network...' : 'Save & Publish Branding Globally'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: MULTI-SURFACE PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          <div className="editorial-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E7E0D8]">
              <Eye className="w-4 h-4 text-[#C25E42]" />
              <h3 className="font-serif text-base font-bold text-[#1C1917]">
                Public Surface Previews
              </h3>
            </div>
            <p className="text-xs text-[#78716C]">
              Here is how this club's updated branding will immediately appear across different areas of the application:
            </p>

            {/* PREVIEW 1: Discovery Card Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                1. Discovery Grid Card
              </span>
              <div className="editorial-card bg-white overflow-hidden border-[#E7E0D8]">
                <div className="h-28 w-full bg-[#FAF8F5] relative overflow-hidden">
                  <img src={coverInput} alt="Cover preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="terracotta" size="xs">{activeClub.category}</Badge>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <ClubLogo src={logoInput} name={activeClub.name} size="sm" accentColor={accentColor} />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#1C1917]">{activeClub.name}</h4>
                      <span className="text-[11px] text-[#78716C]">{activeClub.members_count} Members</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#78716C] line-clamp-1">{taglineInput || activeClub.description}</p>
                </div>
              </div>
            </div>

            {/* PREVIEW 2: Header Monogram / Pill */}
            <div className="space-y-2 pt-3 border-t border-[#E7E0D8]">
              <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                2. Student Dashboard Chip
              </span>
              <div className="p-3 rounded-lg border border-[#E7E0D8] bg-[#FAF8F5] flex items-center gap-3">
                <ClubLogo src={logoInput} name={activeClub.name} size="sm" accentColor={accentColor} />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-[#1C1917] block truncate">{activeClub.name}</span>
                  <span className="text-[10px] text-[#5D7A68] font-medium">Active Society</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
