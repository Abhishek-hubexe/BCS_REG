import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminCreateClub({ onBack, onClubCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Technical',
    tagline: '',
    description: '',
    president: '',
    vice_president: '',
    contact_email: '',
    eligibility: 'Open to all enrolled undergraduate students.',
    membership_info: 'Regular participation in studio sessions and semester projects.',
    accent_color: '#C25E42',
    status: 'active',
    audition_info: {
      tagline: 'Your voice. Our stage.',
      registrations_open: 'Oct 01, 2026',
      live_auditions: 'Oct 07-08, 2026',
      results_announced: 'Oct 10, 2026',
      process: '1. Registration: Fill the form with accurate details.\n2. Live Audition: Vocal / Instrument round or performance demonstration.\n3. Shortlisting: Selected candidates will be informed.\n4. Final List: Results will be announced.'
    }
  });

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [scrapbook1File, setScrapbook1File] = useState(null);
  const [scrapbook2File, setScrapbook2File] = useState(null);
  const [scrapbook3File, setScrapbook3File] = useState(null);

  const [logoPreview, setLogoPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [scrapbook1Preview, setScrapbook1Preview] = useState('');
  const [scrapbook2Preview, setScrapbook2Preview] = useState('');
  const [scrapbook3Preview, setScrapbook3Preview] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleScrapbookChange = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      if (index === 1) {
        setScrapbook1File(file);
        setScrapbook1Preview(URL.createObjectURL(file));
      } else if (index === 2) {
        setScrapbook2File(file);
        setScrapbook2Preview(URL.createObjectURL(file));
      } else if (index === 3) {
        setScrapbook3File(file);
        setScrapbook3Preview(URL.createObjectURL(file));
      }
    }
  };

  const handleAuditionChange = (field, value) => {
    setFormData(prev => {
      const newAudition = { ...prev.audition_info };
      newAudition[field] = value;
      return { ...prev, audition_info: newAudition };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please provide a club name and charter description.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create club
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create club');

      let finalClub = data.club;

      // 2. Upload Logo if provided
      if (logoFile) {
        const logoForm = new FormData();
        logoForm.append('asset', logoFile);
        logoForm.append('type', 'logo');

        const uploadRes = await fetch(`/api/clubs/${data.club.id}/upload-asset`, {
          method: 'POST',
          body: logoForm
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalClub = uploadData.club;
        }
      }

      // 3. Upload Cover / Artwork Image if provided
      if (coverFile) {
        const coverForm = new FormData();
        coverForm.append('asset', coverFile);
        coverForm.append('type', 'cover');

        const uploadRes = await fetch(`/api/clubs/${data.club.id}/upload-asset`, {
          method: 'POST',
          body: coverForm
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalClub = uploadData.club;
        }
      }

      // 4. Upload Scrapbook Images if provided
      const uploadScrapbook = async (file, type) => {
        if (!file) return;
        const sbForm = new FormData();
        sbForm.append('asset', file);
        sbForm.append('type', type);
        const uploadRes = await fetch(`/api/clubs/${data.club.id}/upload-asset`, {
          method: 'POST',
          body: sbForm
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalClub = uploadData.club;
        }
      };

      await uploadScrapbook(scrapbook1File, 'scrapbook1');
      await uploadScrapbook(scrapbook2File, 'scrapbook2');
      await uploadScrapbook(scrapbook3File, 'scrapbook3');

      if (onClubCreated) onClubCreated(finalClub);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Guilds Directory</span>
      </button>

      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">Charter New Society</h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Register an official university guild with custom showcase artwork, logo, and Markdown charter.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-[#FDF1EF] border border-[#F0C9C2] text-[#963526] text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="editorial-card p-8 bg-white space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Guild Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Guild Name <span className="text-[#C25E42]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Robotics, Abhinaya, Code Club"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="editorial-input text-xs"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Category <span className="text-[#C25E42]">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="editorial-input text-xs bg-white"
            >
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>

          {/* Tagline */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Tagline (Editorial Motto)
            </label>
            <input
              type="text"
              placeholder="e.g. Dedicated to technical excellence."
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="editorial-input text-xs"
            />
          </div>

          {/* Logo Upload */}
          <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-3">
            <label className="block text-xs font-semibold text-[#1C1917]">
              Guild Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="editorial-input text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
            />
            {logoPreview && (
              <div className="flex items-center gap-3 pt-2">
                <img src={logoPreview} alt="Logo preview" className="w-12 h-12 object-contain rounded-md border border-[#E7E0D8] bg-white p-1" />
                <span className="text-[11px] text-[#78716C]">Logo selected</span>
              </div>
            )}
          </div>

          {/* Showcase Artwork / Cover Image Upload */}
          <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-3">
            <label className="block text-xs font-semibold text-[#1C1917]">
              Showcase Artwork / Cover Graphic
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="editorial-input text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
            />
            {coverPreview && (
              <div className="flex items-center gap-3 pt-2">
                <img src={coverPreview} alt="Cover preview" className="w-16 h-12 object-cover rounded-md border border-[#E7E0D8]" />
                <span className="text-[11px] text-[#78716C]">Showcase artwork selected</span>
              </div>
            )}
          </div>

          {/* Custom Scrapbook Images */}
          <div className="sm:col-span-2 p-5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1C1917]">Scrapbook Aesthetic (Optional)</h3>
              <p className="text-[11px] text-[#78716C] mt-0.5">Upload custom polaroids/images to display on the club's profile margins. If left blank, default campus aesthetic images are used.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Polaroid */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-[#1C1917]">Primary Polaroid (Left)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScrapbookChange(e, 1)}
                  className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                />
                {scrapbook1Preview && (
                  <img src={scrapbook1Preview} alt="Primary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                )}
              </div>

              {/* Secondary Polaroid */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-[#1C1917]">Secondary Polaroid (Right Top)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScrapbookChange(e, 2)}
                  className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                />
                {scrapbook2Preview && (
                  <img src={scrapbook2Preview} alt="Secondary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                )}
              </div>

              {/* Tertiary Polaroid */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-[#1C1917]">Tertiary Polaroid (Right Bottom)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScrapbookChange(e, 3)}
                  className="editorial-input text-[10px] w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
                />
                {scrapbook3Preview && (
                  <img src={scrapbook3Preview} alt="Tertiary Polaroid" className="w-full h-24 object-cover rounded shadow-sm border border-[#E7E0D8]" />
                )}
              </div>
            </div>
          </div>

          {/* Charter Description (Markdown) */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#1C1917]">
                Charter Description (Markdown Supported) <span className="text-[#C25E42]">*</span>
              </label>
              <span className="text-[11px] text-[#A8A29E]">Use ### for headers, **text** for bold</span>
            </div>
            <textarea
              rows={6}
              placeholder={`### BEC Robotics & Drone Club\n\nThe **BEC Robotics & Drone Club** at **Basaveshwar Engineering College, Bagalkot**, is a technical student community dedicated to practical innovation...\n\n- Robotics & Drones\n- Autonomous systems`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="editorial-input text-xs leading-relaxed font-mono"
              required
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
                value={formData.audition_info.tagline}
                onChange={(e) => handleAuditionChange('tagline', e.target.value)}
                className="editorial-input text-xs"
                placeholder="e.g. Your voice. Our stage."
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Registrations Open Date</label>
              <input
                type="text"
                value={formData.audition_info.registrations_open}
                onChange={(e) => handleAuditionChange('registrations_open', e.target.value)}
                className="editorial-input text-xs"
                placeholder="e.g. Oct 01, 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Live Auditions Date(s)</label>
              <input
                type="text"
                value={formData.audition_info.live_auditions}
                onChange={(e) => handleAuditionChange('live_auditions', e.target.value)}
                className="editorial-input text-xs"
                placeholder="e.g. Oct 07–08, 2026"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">Results Announced Date</label>
              <input
                type="text"
                value={formData.audition_info.results_announced}
                onChange={(e) => handleAuditionChange('results_announced', e.target.value)}
                className="editorial-input text-xs sm:w-1/2"
                placeholder="e.g. Oct 10, 2026"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-[#1C1917]">Audition Process Steps</h4>
            <div className="p-4 bg-[#FAF8F5] border border-[#E7E0D8] rounded-md">
              <label className="block text-[11px] font-semibold text-[#1C1917] mb-1.5">Process Description</label>
              <textarea
                rows={5}
                value={formData.audition_info.process}
                onChange={(e) => handleAuditionChange('process', e.target.value)}
                className="editorial-input text-xs bg-white resize-y"
                placeholder="Describe the full audition process here..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-[#E7E0D8] text-xs font-medium rounded hover:bg-[#FAF8F5] text-[#78716C]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publishing Guild...' : 'Charter & Publish Guild'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
