import React, { useState, useEffect } from 'react';
import { Sparkles, Upload, Save, RotateCcw, Check, Image as ImageIcon, Shield, Instagram, MessageCircle, Link, ArrowUpRight, Share2 } from 'lucide-react';
import BCSLogo from '../BCSLogo';

export default function AdminSpectrumBranding({ spectrumConfig = {}, onUpdateConfig, onNavigateTab }) {
  const [formData, setFormData] = useState({
    title: spectrumConfig?.title || 'Creative Spectrum',
    tagline: spectrumConfig?.tagline || 'Collegiate Guilds Platform',
    logo_url: spectrumConfig?.logo_url || null,
    accent_color: spectrumConfig?.accent_color || '#C25E42',
    instagram_url: spectrumConfig?.instagram_url || '',
    whatsapp_channel_url: spectrumConfig?.whatsapp_channel_url || '',
    social_links_title: spectrumConfig?.social_links_title || 'Join Our Community Channels',
    social_links_subtitle: spectrumConfig?.social_links_subtitle || 'Stay connected for real-time announcements, audition notifications, and club highlights.',
    about_title: spectrumConfig?.about_title || '',
    about_subtitle: spectrumConfig?.about_subtitle || '',
    about_section_title: spectrumConfig?.about_section_title || '',
    about_section_body: spectrumConfig?.about_section_body || '',
    hero_badge: spectrumConfig?.hero_badge || '',
    hero_title: spectrumConfig?.hero_title || '',
    hero_title_highlight: spectrumConfig?.hero_title_highlight || '',
    hero_subtitle: spectrumConfig?.hero_subtitle || ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(spectrumConfig?.logo_url || null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (spectrumConfig) {
      setFormData({
        title: spectrumConfig.title || 'Creative Spectrum',
        tagline: spectrumConfig.tagline || 'Collegiate Guilds Platform',
        logo_url: spectrumConfig.logo_url || null,
        accent_color: spectrumConfig.accent_color || '#C25E42',
        instagram_url: spectrumConfig.instagram_url || '',
        whatsapp_channel_url: spectrumConfig.whatsapp_channel_url || '',
        social_links_title: spectrumConfig.social_links_title || 'Join Our Community Channels',
        social_links_subtitle: spectrumConfig.social_links_subtitle || 'Stay connected for real-time announcements, audition notifications, and club highlights.',
        about_title: spectrumConfig.about_title || '',
        about_subtitle: spectrumConfig.about_subtitle || '',
        about_section_title: spectrumConfig.about_section_title || '',
        about_section_body: spectrumConfig.about_section_body || '',
        hero_badge: spectrumConfig.hero_badge || '',
        hero_title: spectrumConfig.hero_title || '',
        hero_title_highlight: spectrumConfig.hero_title_highlight || '',
        hero_subtitle: spectrumConfig.hero_subtitle || ''
      });
      setPreviewUrl(spectrumConfig.logo_url || null);
    }
  }, [spectrumConfig]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ text: '', type: '' });

    try {
      let finalLogoUrl = formData.logo_url;

      // 1. If a file was selected, upload it first
      if (logoFile) {
        const uploadData = new FormData();
        uploadData.append('logo', logoFile);

        const resUpload = await fetch('/api/spectrum-config/upload', {
          method: 'POST',
          body: uploadData
        });

        const dataUpload = await resUpload.json();
        if (!resUpload.ok) {
          throw new Error(dataUpload.error || 'Failed to upload Spectrum logo');
        }
        finalLogoUrl = dataUpload.config.logo_url;
      }

      // 2. Save configuration metadata
      const resConfig = await fetch('/api/spectrum-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          tagline: formData.tagline,
          logo_url: finalLogoUrl,
          accent_color: formData.accent_color,
          instagram_url: formData.instagram_url,
          whatsapp_channel_url: formData.whatsapp_channel_url,
          social_links_title: formData.social_links_title,
          social_links_subtitle: formData.social_links_subtitle,
          about_title: formData.about_title,
          about_subtitle: formData.about_subtitle,
          about_section_title: formData.about_section_title,
          about_section_body: formData.about_section_body,
          hero_badge: formData.hero_badge,
          hero_title: formData.hero_title,
          hero_title_highlight: formData.hero_title_highlight,
          hero_subtitle: formData.hero_subtitle,
          social_links_badge: spectrumConfig?.social_links_badge || 'OFFICIAL CHANNELS',
          official_links: spectrumConfig?.official_links || undefined
        })
      });

      const dataConfig = await resConfig.json();
      if (!resConfig.ok) {
        throw new Error(dataConfig.error || 'Failed to update configuration');
      }

      setStatusMessage({ text: 'Spectrum Branding & Community Links updated successfully!', type: 'success' });
      setLogoFile(null);
      if (onUpdateConfig) {
        onUpdateConfig(dataConfig.config);
      }
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaultLogo = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/spectrum-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo_url: null })
      });
      const data = await res.json();
      setPreviewUrl(null);
      setLogoFile(null);
      setFormData(prev => ({ ...prev, logo_url: null }));
      setStatusMessage({ text: 'Reset to default geometric Spectrum Logo.', type: 'info' });
      if (onUpdateConfig) {
        onUpdateConfig(data.config);
      }
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-[#C25E42] text-xs font-medium tracking-wide mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Platform Visual Identity</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
          Spectrum Logo &amp; Identity
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Customize the central Spectrum Logo that anchors the revolving collegiate guild system on the home screen.
        </p>
      </div>

      {statusMessage.text && (
        <div
          className={`p-4 rounded-md text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#EEF3F0] text-[#3E5A48] border border-[#C8D9CE]'
              : statusMessage.type === 'error'
              ? 'bg-[#FDF1EF] text-[#963526] border border-[#F0C9C2]'
              : 'bg-[#FCF7ED] text-[#8C6120] border border-[#EED9B3]'
          }`}
        >
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORM */}
        <form onSubmit={handleSave} className="lg:col-span-7 editorial-card p-6 bg-white space-y-6">
          <h2 className="font-serif text-lg font-bold text-[#1C1917] pb-3 border-b border-[#E7E0D8]">
            Customize Spectrum Branding
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Platform Name
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="editorial-input text-xs"
              placeholder="Creative Spectrum"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="editorial-input text-xs"
              placeholder="Collegiate Guilds Platform"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Upload Custom Spectrum Logo Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="editorial-input text-xs file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#FAF0ED] file:text-[#C25E42] hover:file:bg-[#F3DDD5]"
            />
            <p className="text-[11px] text-[#78716C] mt-1">
              Supports PNG, SVG, JPG, or WEBP (square aspect ratio recommended).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Direct Image URL (Alternative)
            </label>
            <input
              type="url"
              value={formData.logo_url || ''}
              onChange={(e) => {
                setFormData({ ...formData, logo_url: e.target.value });
                setPreviewUrl(e.target.value);
              }}
              placeholder="https://..."
              className="editorial-input text-xs"
            />
          </div>

          {/* ABOUT PAGE CONTENT */}
          <div className="pt-6 border-t border-[#E7E0D8] space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              📄 About Page Content
            </h3>
            <p className="text-[11px] text-[#78716C]">
              Customize the public "About" page that students see. Leave blank to use defaults.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                About Page Title
              </label>
              <input
                type="text"
                value={formData.about_title}
                onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                className="editorial-input text-xs"
                placeholder={`About ${formData.title || 'Creative Spectrum'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                About Subtitle
              </label>
              <input
                type="text"
                value={formData.about_subtitle}
                onChange={(e) => setFormData({ ...formData, about_subtitle: e.target.value })}
                className="editorial-input text-xs"
                placeholder="A unified collegiate ecosystem designed to..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={formData.about_section_title}
                onChange={(e) => setFormData({ ...formData, about_section_title: e.target.value })}
                className="editorial-input text-xs"
                placeholder="Our Vision"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Section Body
              </label>
              <textarea
                rows={5}
                value={formData.about_section_body}
                onChange={(e) => setFormData({ ...formData, about_section_body: e.target.value })}
                className="editorial-input text-xs resize-y"
                placeholder="Describe your organization's mission, history, and values..."
              />
            </div>
          </div>

          {/* HERO SECTION CONTENT */}
          <div className="pt-6 border-t border-[#E7E0D8] space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
              ✨ Hero Section Content
            </h3>
            <p className="text-[11px] text-[#78716C]">
              Customize the main hero text displayed on the homepage. Leave blank to use defaults.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Hero Badge
              </label>
              <input
                type="text"
                value={formData.hero_badge}
                onChange={(e) => setFormData({ ...formData, hero_badge: e.target.value })}
                className="editorial-input text-xs"
                placeholder="Fall 2026 Society Auditions & Registrations"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Hero Title (Part 1)
                </label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className="editorial-input text-xs"
                  placeholder="Find Your"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Hero Title (Highlighted)
                </label>
                <input
                  type="text"
                  value={formData.hero_title_highlight}
                  onChange={(e) => setFormData({ ...formData, hero_title_highlight: e.target.value })}
                  className="editorial-input text-xs"
                  placeholder="Circle."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Hero Subtitle
              </label>
              <textarea
                rows={3}
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className="editorial-input text-xs resize-y"
                placeholder="Discover clubs, creative communities, and campus experiences that make college far more than just a classroom."
              />
            </div>
          </div>

          {/* SOCIAL & COMMUNITY CHANNELS */}
          <div className="pt-6 border-t border-[#E7E0D8] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1C1917] flex items-center gap-2">
                  📱 Social & Community Channels
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Configure your official community links to display prominently for students at the bottom of the portal.
                </p>
              </div>

              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('official-links')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF0ED] hover:bg-[#F3DDD5] text-[#C25E42] text-xs font-semibold border border-[#EAD8D2] transition-colors shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Open Full Links Suite</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span>Instagram Profile / Link</span>
              </label>
              <input
                type="text"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="editorial-input text-xs"
                placeholder="e.g. https://instagram.com/bcs_spectrum or @bcs_spectrum"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Official Channel Link</span>
              </label>
              <input
                type="text"
                value={formData.whatsapp_channel_url}
                onChange={(e) => setFormData({ ...formData, whatsapp_channel_url: e.target.value })}
                className="editorial-input text-xs"
                placeholder="e.g. https://whatsapp.com/channel/0029Va... or https://chat.whatsapp.com/..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={formData.social_links_title}
                  onChange={(e) => setFormData({ ...formData, social_links_title: e.target.value })}
                  className="editorial-input text-xs"
                  placeholder="Join Our Community Channels"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={formData.social_links_subtitle}
                  onChange={(e) => setFormData({ ...formData, social_links_subtitle: e.target.value })}
                  className="editorial-input text-xs"
                  placeholder="Stay connected for real-time announcements & alerts"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E0D8] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefaultLogo}
              className="px-3.5 py-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] border border-[#E7E0D8] rounded-md hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Geometric Logo</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#C25E42] hover:bg-[#A94E35] text-white text-xs font-medium rounded-md shadow-subtle transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW CARD */}
        <div className="lg:col-span-5 editorial-card p-6 bg-[#FAF8F5] border-[#E7E0D8] space-y-6 text-center">
          <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider block">
            Live Central Hub Preview
          </span>

          <div className="w-36 h-36 mx-auto rounded-full bg-white border-2 border-[#C25E42] shadow-elevated p-2 flex flex-col items-center justify-center">
            <BCSLogo
              className="w-20 h-20"
              animated={true}
              customLogoUrl={previewUrl}
            />
            <span className="text-[11px] font-serif font-bold text-[#1C1917] mt-1 truncate max-w-[120px]">
              {formData.title || 'Creative Spectrum'}
            </span>
          </div>

          <div className="text-xs text-[#78716C] leading-relaxed">
            <p>
              This is the central emblem that all collegiate clubs will revolve around on the homepage hero orbit.
            </p>
          </div>

          {/* Social Channels Preview Box */}
          <div className="p-4 rounded-xl bg-white border border-[#E7E0D8] space-y-3 text-left shadow-sm">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
              Live Channels Preview
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF5F7] border border-[#F5D8E4] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#1C1917] truncate max-w-[140px]">
                    {formData.instagram_url || 'Instagram Link'}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E1306C]" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F2FAF5] border border-[#CDEED6] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#25D366] flex items-center justify-center text-white">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-[#1C1917] truncate max-w-[140px]">
                    {formData.whatsapp_channel_url || 'WhatsApp Channel'}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
