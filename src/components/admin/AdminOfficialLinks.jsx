import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Check,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Link as LinkIcon,
  MessageCircle,
  Instagram,
  Send,
  MessageSquare,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  Github,
  ArrowUpRight,
  Share2,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PLATFORM_CONFIGS = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    iconBg: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
    iconShadow: 'shadow-[#dc2743]/25 group-hover:shadow-[#dc2743]/45',
    cardBg: 'bg-gradient-to-br from-[#FAF5F7] to-[#FFF0F5]',
    cardBorder: 'border-[#F5D8E4] hover:border-[#E1306C]/50',
    hoverGlow: 'from-[#833AB4]/5 via-[#FD1D1D]/5 to-[#F77737]/5',
    arrowHover: 'group-hover:bg-[#E1306C] group-hover:text-white',
    tagColor: 'text-[#A8557A]',
    dotColor: 'bg-[#E1306C]',
    titleHover: 'group-hover:text-[#E1306C]',
    defaultTag: 'INSTAGRAM',
    defaultTitle: 'Instagram',
    defaultHandle: '@bcs_spectrum',
    defaultDesc: 'Stories, reels, & event highlights',
    placeholderUrl: 'https://instagram.com/bcs_spectrum or @bcs_spectrum',
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Channel',
    icon: MessageCircle,
    iconBg: 'bg-gradient-to-br from-[#25D366] to-[#128C7E]',
    iconShadow: 'shadow-[#25D366]/25 group-hover:shadow-[#25D366]/45',
    cardBg: 'bg-gradient-to-br from-[#F2FAF5] to-[#EAF7EE]',
    cardBorder: 'border-[#CDEED6] hover:border-[#25D366]/50',
    hoverGlow: 'from-[#25D366]/10 to-[#128C7E]/5',
    arrowHover: 'group-hover:bg-[#25D366] group-hover:text-white',
    tagColor: 'text-[#2D8653]',
    dotColor: 'bg-[#25D366]',
    titleHover: 'group-hover:text-[#25D366]',
    defaultTag: 'WHATSAPP CHANNEL',
    defaultTitle: 'WhatsApp Channel',
    defaultHandle: 'Official WhatsApp Broadcast',
    defaultDesc: 'Instant audition & registration alerts',
    placeholderUrl: 'https://whatsapp.com/channel/... or invite link',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    iconBg: 'bg-gradient-to-tr from-[#2AABEE] to-[#229ED9]',
    iconShadow: 'shadow-[#229ED9]/25 group-hover:shadow-[#229ED9]/45',
    cardBg: 'bg-gradient-to-br from-[#F0F8FF] to-[#E5F3FC]',
    cardBorder: 'border-[#CCE5F7] hover:border-[#229ED9]/50',
    hoverGlow: 'from-[#229ED9]/10 to-[#2AABEE]/5',
    arrowHover: 'group-hover:bg-[#229ED9] group-hover:text-white',
    tagColor: 'text-[#1B7FA6]',
    dotColor: 'bg-[#229ED9]',
    titleHover: 'group-hover:text-[#229ED9]',
    defaultTag: 'TELEGRAM',
    defaultTitle: 'Telegram Community',
    defaultHandle: 't.me/bcs_spectrum',
    defaultDesc: 'Campus discussions, notices & resources',
    placeholderUrl: 'https://t.me/bcs_spectrum',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    icon: MessageSquare,
    iconBg: 'bg-gradient-to-tr from-[#5865F2] to-[#404EED]',
    iconShadow: 'shadow-[#5865F2]/25 group-hover:shadow-[#5865F2]/45',
    cardBg: 'bg-gradient-to-br from-[#F4F4FD] to-[#EAEAFA]',
    cardBorder: 'border-[#D6D8F8] hover:border-[#5865F2]/50',
    hoverGlow: 'from-[#5865F2]/10 to-[#404EED]/5',
    arrowHover: 'group-hover:bg-[#5865F2] group-hover:text-white',
    tagColor: 'text-[#4F59C7]',
    dotColor: 'bg-[#5865F2]',
    titleHover: 'group-hover:text-[#5865F2]',
    defaultTag: 'DISCORD SERVER',
    defaultTitle: 'Discord Community',
    defaultHandle: 'discord.gg/spectrum',
    defaultDesc: 'Student hangouts, channels & gaming',
    placeholderUrl: 'https://discord.gg/...',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    iconBg: 'bg-gradient-to-tr from-[#FF0000] to-[#CC0000]',
    iconShadow: 'shadow-[#FF0000]/25 group-hover:shadow-[#FF0000]/45',
    cardBg: 'bg-gradient-to-br from-[#FFF5F5] to-[#FFEBEB]',
    cardBorder: 'border-[#FDD5D5] hover:border-[#FF0000]/50',
    hoverGlow: 'from-[#FF0000]/10 to-[#CC0000]/5',
    arrowHover: 'group-hover:bg-[#FF0000] group-hover:text-white',
    tagColor: 'text-[#B30000]',
    dotColor: 'bg-[#FF0000]',
    titleHover: 'group-hover:text-[#FF0000]',
    defaultTag: 'YOUTUBE',
    defaultTitle: 'YouTube Channel',
    defaultHandle: '@bcs_spectrum',
    defaultDesc: 'Live event coverage, recaps & auditions',
    placeholderUrl: 'https://youtube.com/@bcs_spectrum',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    iconBg: 'bg-gradient-to-tr from-[#0A66C2] to-[#004182]',
    iconShadow: 'shadow-[#0A66C2]/25 group-hover:shadow-[#0A66C2]/45',
    cardBg: 'bg-gradient-to-br from-[#F2F7FC] to-[#E6F0FA]',
    cardBorder: 'border-[#C9E0F5] hover:border-[#0A66C2]/50',
    hoverGlow: 'from-[#0A66C2]/10 to-[#004182]/5',
    arrowHover: 'group-hover:bg-[#0A66C2] group-hover:text-white',
    tagColor: 'text-[#0A66C2]',
    dotColor: 'bg-[#0A66C2]',
    titleHover: 'group-hover:text-[#0A66C2]',
    defaultTag: 'LINKEDIN',
    defaultTitle: 'LinkedIn Network',
    defaultHandle: 'BEC Creative Spectrum',
    defaultDesc: 'Alumni connections, internships & news',
    placeholderUrl: 'https://linkedin.com/company/...',
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    iconBg: 'bg-gradient-to-tr from-[#262626] to-[#000000]',
    iconShadow: 'shadow-black/25 group-hover:shadow-black/45',
    cardBg: 'bg-gradient-to-br from-[#F7F7F7] to-[#EDEDED]',
    cardBorder: 'border-[#D6D6D6] hover:border-black/40',
    hoverGlow: 'from-black/5 to-transparent',
    arrowHover: 'group-hover:bg-black group-hover:text-white',
    tagColor: 'text-[#404040]',
    dotColor: 'bg-[#1C1917]',
    titleHover: 'group-hover:text-black',
    defaultTag: 'X (TWITTER)',
    defaultTitle: 'X / Twitter',
    defaultHandle: '@bcs_spectrum',
    defaultDesc: 'Campus buzz & instant alerts',
    placeholderUrl: 'https://x.com/bcs_spectrum',
  },
  website: {
    id: 'website',
    name: 'Official Website / Portal',
    icon: Globe,
    iconBg: 'bg-gradient-to-tr from-[#C25E42] to-[#8C3A22]',
    iconShadow: 'shadow-[#C25E42]/25 group-hover:shadow-[#C25E42]/45',
    cardBg: 'bg-gradient-to-br from-[#FAF0ED] to-[#F5E5DF]',
    cardBorder: 'border-[#EAD8D2] hover:border-[#C25E42]/50',
    hoverGlow: 'from-[#C25E42]/10 to-[#8C3A22]/5',
    arrowHover: 'group-hover:bg-[#C25E42] group-hover:text-white',
    tagColor: 'text-[#C25E42]',
    dotColor: 'bg-[#C25E42]',
    titleHover: 'group-hover:text-[#C25E42]',
    defaultTag: 'CAMPUS PORTAL',
    defaultTitle: 'Institutional Website',
    defaultHandle: 'becbgk.edu',
    defaultDesc: 'Basaveshwar Engineering College central portal',
    placeholderUrl: 'https://becbgk.edu',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    iconBg: 'bg-gradient-to-tr from-[#333333] to-[#181717]',
    iconShadow: 'shadow-black/25 group-hover:shadow-black/45',
    cardBg: 'bg-gradient-to-br from-[#F6F8FA] to-[#EAECEF]',
    cardBorder: 'border-[#D0D7DE] hover:border-black/40',
    hoverGlow: 'from-black/5 to-transparent',
    arrowHover: 'group-hover:bg-[#24292F] group-hover:text-white',
    tagColor: 'text-[#24292F]',
    dotColor: 'bg-[#24292F]',
    titleHover: 'group-hover:text-[#24292F]',
    defaultTag: 'GITHUB',
    defaultTitle: 'GitHub Organization',
    defaultHandle: '@bcs-spectrum',
    defaultDesc: 'Open source projects & student code',
    placeholderUrl: 'https://github.com/...',
  },
  custom: {
    id: 'custom',
    name: 'Custom Channel / Link',
    icon: LinkIcon,
    iconBg: 'bg-gradient-to-tr from-[#C28B38] to-[#966318]',
    iconShadow: 'shadow-[#C28B38]/25 group-hover:shadow-[#C28B38]/45',
    cardBg: 'bg-gradient-to-br from-[#FCF8EE] to-[#F7EED7]',
    cardBorder: 'border-[#EEDEB8] hover:border-[#C28B38]/50',
    hoverGlow: 'from-[#C28B38]/10 to-[#966318]/5',
    arrowHover: 'group-hover:bg-[#C28B38] group-hover:text-white',
    tagColor: 'text-[#8C6120]',
    dotColor: 'bg-[#C28B38]',
    titleHover: 'group-hover:text-[#8C6120]',
    defaultTag: 'COMMUNITY LINK',
    defaultTitle: 'Official Resource',
    defaultHandle: 'Portal Link',
    defaultDesc: 'Official link for collegiate guild members',
    placeholderUrl: 'https://...',
  }
};

export default function AdminOfficialLinks({
  spectrumConfig = {},
  onUpdateConfig
}) {
  const [links, setLinks] = useState([]);
  const [sectionMeta, setSectionMeta] = useState({
    social_links_badge: 'OFFICIAL CHANNELS',
    social_links_title: 'Join Our Community Channels',
    social_links_subtitle: 'Stay connected for real-time announcements, audition notifications, and club highlights.'
  });

  const [editingModalOpen, setEditingModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null); // null means creating new

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [showSectionSettings, setShowSectionSettings] = useState(false);

  // Sync state with incoming spectrumConfig
  useEffect(() => {
    if (spectrumConfig) {
      setSectionMeta({
        social_links_badge: spectrumConfig.social_links_badge || 'OFFICIAL CHANNELS',
        social_links_title: spectrumConfig.social_links_title || 'Join Our Community Channels',
        social_links_subtitle: spectrumConfig.social_links_subtitle || 'Stay connected for real-time announcements, audition notifications, and club highlights.'
      });

      if (Array.isArray(spectrumConfig.official_links) && spectrumConfig.official_links.length > 0) {
        setLinks(spectrumConfig.official_links);
      } else {
        // Fallback or seed initial links from existing instagram / whatsapp
        const initial = [];
        if (spectrumConfig.instagram_url) {
          initial.push({
            id: 'link-1',
            platform: 'instagram',
            title: 'Instagram',
            handle: spectrumConfig.instagram_url.startsWith('@') ? spectrumConfig.instagram_url : `@${spectrumConfig.instagram_url.split('/').filter(Boolean).pop() || 'bcs_spectrum'}`,
            url: spectrumConfig.instagram_url,
            description: 'Stories, reels, & event highlights',
            tag: 'INSTAGRAM',
            active: true,
            order: 1
          });
        }
        if (spectrumConfig.whatsapp_channel_url) {
          initial.push({
            id: 'link-2',
            platform: 'whatsapp',
            title: 'WhatsApp Channel',
            handle: 'Official WhatsApp Broadcast',
            url: spectrumConfig.whatsapp_channel_url,
            description: 'Instant audition & registration alerts',
            tag: 'WHATSAPP CHANNEL',
            active: true,
            order: 2
          });
        }
        setLinks(initial);
      }
    }
  }, [spectrumConfig]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('cs_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const user = JSON.parse(localStorage.getItem('cs_user') || '{}');
      if (user?.id) headers['x-user-id'] = String(user.id);
      if (user?.role) headers['x-user-role'] = user.role;
    } catch (e) {
      // Ignore
    }
    return headers;
  };

  const handleSaveAll = async (linksToSave = links, metaToSave = sectionMeta) => {
    setIsSaving(true);
    setStatusMessage({ text: '', type: '' });

    try {
      // Normalize primary instagram and whatsapp links if they exist
      const ig = linksToSave.find(l => l.platform === 'instagram' && l.active);
      const wa = linksToSave.find(l => l.platform === 'whatsapp' && l.active);

      const payload = {
        ...metaToSave,
        official_links: linksToSave,
        instagram_url: ig ? ig.url : spectrumConfig?.instagram_url || '',
        whatsapp_channel_url: wa ? wa.url : spectrumConfig?.whatsapp_channel_url || ''
      };

      const res = await fetch('/api/spectrum-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save official links');
      }

      setStatusMessage({ text: 'Official Links & Community Channels published successfully!', type: 'success' });
      if (onUpdateConfig) {
        onUpdateConfig(data.config);
      }
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const openNewLinkModal = (presetPlatform = 'instagram') => {
    const preset = PLATFORM_CONFIGS[presetPlatform] || PLATFORM_CONFIGS.custom;
    setEditingLink({
      id: `link-${Date.now()}`,
      platform: presetPlatform,
      title: preset.defaultTitle,
      handle: preset.defaultHandle,
      url: '',
      description: preset.defaultDesc,
      tag: preset.defaultTag,
      active: true,
      order: links.length + 1,
      isNew: true
    });
    setEditingModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink({ ...link, isNew: false });
    setEditingModalOpen(true);
  };

  const handleSaveModal = (linkData) => {
    let updated;
    // Format link url if only handle entered for instagram/telegram
    let formattedUrl = (linkData.url || '').trim();
    if (linkData.platform === 'instagram' && formattedUrl && !formattedUrl.startsWith('http')) {
      formattedUrl = `https://instagram.com/${formattedUrl.replace(/^@/, '')}`;
    } else if (linkData.platform === 'telegram' && formattedUrl && !formattedUrl.startsWith('http')) {
      formattedUrl = `https://t.me/${formattedUrl.replace(/^@/, '')}`;
    }

    const cleanedLink = {
      ...linkData,
      url: formattedUrl
    };

    if (linkData.isNew) {
      const { isNew, ...pureLink } = cleanedLink;
      updated = [...links, pureLink];
    } else {
      updated = links.map(l => l.id === cleanedLink.id ? cleanedLink : l);
    }

    setLinks(updated);
    setEditingModalOpen(false);
    setEditingLink(null);
    handleSaveAll(updated, sectionMeta);
  };

  const handleDeleteLink = (id) => {
    const target = links.find(l => l.id === id);
    if (!confirm(`Are you sure you want to remove "${target?.title || 'this link'}" from the portal?`)) return;

    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    handleSaveAll(updated, sectionMeta);
  };

  const handleToggleActive = (id) => {
    const updated = links.map(l => l.id === id ? { ...l, active: !l.active } : l);
    setLinks(updated);
    handleSaveAll(updated, sectionMeta);
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const updated = [...links];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign orders
    const normalized = updated.map((l, idx) => ({ ...l, order: idx + 1 }));
    setLinks(normalized);
    handleSaveAll(normalized, sectionMeta);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E0D8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-[#C25E42] text-xs font-medium tracking-wide mb-2">
            <Share2 className="w-3.5 h-3.5" />
            <span>Community Outreach Hub</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C1917]">
            Official Channels & Links Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Empower the central administration to publish, customize, and order official college & guild links on the public student portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSectionSettings(!showSectionSettings)}
            className="px-3.5 py-2 border border-[#E7E0D8] hover:border-[#C25E42] text-xs font-medium text-[#1C1917] bg-white rounded-md transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-[#78716C]" />
            <span>{showSectionSettings ? 'Hide Section Headings' : 'Customize Headings'}</span>
          </button>

          <button
            type="button"
            onClick={() => openNewLinkModal('instagram')}
            className="px-4 py-2 bg-[#C25E42] hover:bg-[#A94E35] text-white text-xs font-medium rounded-md shadow-subtle transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Official Link</span>
          </button>
        </div>
      </div>

      {/* STATUS NOTIFICATION BANNER */}
      {statusMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#EEF3F0] text-[#3E5A48] border border-[#C8D9CE]'
              : 'bg-[#FDF1EF] text-[#963526] border border-[#F0C9C2]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </motion.div>
      )}

      {/* QUICK PRESET ADD BUTTONS */}
      <div className="editorial-card p-5 bg-white border-[#E7E0D8] space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E] block">
          ⚡ 1-Click Quick Add Presets
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => openNewLinkModal(key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF8F5] hover:bg-[#FAF0ED] text-[#1C1917] hover:text-[#C25E42] border border-[#E7E0D8] hover:border-[#C25E42]/40 transition-all shadow-2xs group"
              >
                <Icon className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#C25E42] transition-colors" />
                <span>+ {config.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION HEADER CUSTOMIZER (COLLAPSIBLE) */}
      <AnimatePresence>
        {showSectionSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="editorial-card p-6 bg-[#FAF8F5] border-[#E7E0D8] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1C1917]">
                    Section Titles & Subtitle
                  </h3>
                  <p className="text-[11px] text-[#78716C]">
                    Customize the text displayed on the homepage community banner.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={sectionMeta.social_links_badge}
                    onChange={(e) => setSectionMeta({ ...sectionMeta, social_links_badge: e.target.value })}
                    className="editorial-input text-xs bg-white"
                    placeholder="OFFICIAL CHANNELS"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={sectionMeta.social_links_title}
                    onChange={(e) => setSectionMeta({ ...sectionMeta, social_links_title: e.target.value })}
                    className="editorial-input text-xs bg-white"
                    placeholder="Join Our Community Channels"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                    Section Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={sectionMeta.social_links_subtitle}
                    onChange={(e) => setSectionMeta({ ...sectionMeta, social_links_subtitle: e.target.value })}
                    className="editorial-input text-xs bg-white resize-y"
                    placeholder="Stay connected for real-time announcements, audition notifications, and club highlights."
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveAll(links, sectionMeta)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#C25E42] text-white rounded text-xs font-medium hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Update Headings'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CARDS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#1C1917]">Configured Channels</span>
            <span className="px-2 py-0.5 rounded-full bg-[#FAF0ED] text-[#C25E42] text-xs font-semibold">
              {links.length} total • {links.filter(l => l.active).length} live
            </span>
          </div>

          {links.length > 0 && (
            <button
              type="button"
              onClick={() => handleSaveAll(links, sectionMeta)}
              disabled={isSaving}
              className="px-4 py-2 bg-[#5D7A68] hover:bg-[#4D6656] text-white text-xs font-medium rounded-md shadow-subtle transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>
          )}
        </div>

        {links.length === 0 ? (
          <div className="editorial-card p-12 text-center bg-white border-[#E7E0D8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF0ED] text-[#C25E42] flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1C1917]">No Official Links Added Yet</h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto mt-1">
                Add your official Instagram, WhatsApp channel, Discord, or campus links to connect students across all collegiate guilds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openNewLinkModal('instagram')}
              className="px-5 py-2.5 bg-[#C25E42] hover:bg-[#A94E35] text-white text-xs font-medium rounded-md shadow-subtle inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Channel</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, idx) => {
              const platformConfig = PLATFORM_CONFIGS[link.platform] || PLATFORM_CONFIGS.custom;
              const Icon = platformConfig.icon;

              return (
                <div
                  key={link.id || idx}
                  className={`editorial-card p-4 bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    link.active
                      ? 'border-[#E7E0D8] hover:border-[#C25E42]/40 shadow-xs'
                      : 'border-[#E7E0D8]/60 bg-[#FAF8F5]/60 opacity-60'
                  }`}
                >
                  {/* Left: Reorder, Icon, and Details */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Reorder Arrows */}
                    <div className="flex flex-col gap-0.5 text-[#A8A29E]">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:text-[#1C1917] disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === links.length - 1}
                        className="p-1 hover:text-[#1C1917] disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Squircle Brand Icon */}
                    <div className={`w-11 h-11 rounded-xl ${platformConfig.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-md ${platformConfig.iconShadow}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${platformConfig.tagColor}`}>
                          {link.tag || platformConfig.defaultTag}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${link.active ? platformConfig.dotColor : 'bg-[#A8A29E]'}`} />
                        {!link.active && (
                          <span className="text-[10px] font-medium text-[#78716C] bg-[#E7E0D8] px-1.5 py-0.2 rounded">
                            Hidden / Draft
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1C1917] truncate">
                          {link.handle || link.title}
                        </h4>
                        <span className="text-xs text-[#78716C] hidden sm:inline">
                          ({link.title})
                        </span>
                      </div>

                      <p className="text-[11px] text-[#78716C] truncate mt-0.5 max-w-lg">
                        {link.description || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  {/* Right: URL & Actions */}
                  <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#E7E0D8]">
                    {link.url && (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#78716C] hover:text-[#C25E42] max-w-[200px] truncate flex items-center gap-1 bg-[#FAF8F5] px-2 py-1 rounded border border-[#E7E0D8]"
                        title={link.url}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{link.url.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}

                    <div className="flex items-center gap-1.5">
                      {/* Active toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(link.id)}
                        className={`p-1.5 rounded border transition-colors ${
                          link.active
                            ? 'text-[#5D7A68] border-[#C8D9CE] bg-[#EEF3F0] hover:bg-[#DEE9E2]'
                            : 'text-[#78716C] border-[#E7E0D8] bg-[#FAF8F5] hover:bg-[#F2ECE4]'
                        }`}
                        title={link.active ? 'Active (Click to Hide)' : 'Hidden (Click to Publish)'}
                      >
                        {link.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEditModal(link)}
                        className="p-1.5 rounded border border-[#E7E0D8] text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 rounded border border-[#F0C9C2] text-[#B84A39] hover:bg-[#FDF1EF] transition-colors"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LIVE INTERACTIVE PREVIEW ACCORDION */}
      <div className="editorial-card p-6 bg-[#FAF8F5] border-[#E7E0D8] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C25E42]" />
            <h3 className="font-serif text-base font-bold text-[#1C1917]">
              Student Portal Live Rendering Preview
            </h3>
          </div>
          <span className="text-[11px] text-[#78716C]">
            Live preview of how active cards render on the public homepage
          </span>
        </div>

        {/* Live rendering container */}
        <div className="bg-white/95 border border-[#E7E0D8] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-[#C25E42] text-[11px] font-semibold tracking-wide">
                <Sparkles className="w-3 h-3" />
                <span>{sectionMeta.social_links_badge || 'OFFICIAL CHANNELS'}</span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                {sectionMeta.social_links_title || 'Join Our Community Channels'}
              </h4>
              <p className="text-xs text-[#78716C] leading-relaxed">
                {sectionMeta.social_links_subtitle || 'Stay connected for real-time announcements, audition notifications, and club highlights.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full lg:max-w-xl">
              {links.filter(l => l.active).map((link, idx) => {
                const config = PLATFORM_CONFIGS[link.platform] || PLATFORM_CONFIGS.custom;
                const Icon = config.icon;

                return (
                  <div
                    key={link.id || idx}
                    className={`relative overflow-hidden p-4 rounded-xl ${config.cardBg} border ${config.cardBorder} flex flex-col justify-between shadow-2xs group cursor-pointer transition-all hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start justify-between relative z-10 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center text-white shadow-md ${config.iconShadow}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-7 h-7 rounded-full bg-white/80 border border-[#E7E0D8] flex items-center justify-center text-[#78716C] ${config.arrowHover} transition-all shadow-2xs`}>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.tagColor}`}>
                          {link.tag || config.defaultTag}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                      </div>
                      <p className={`font-bold text-sm text-[#1C1917] ${config.titleHover} transition-colors line-clamp-1`}>
                        {link.handle || link.title}
                      </p>
                      <p className="text-[10px] text-[#78716C] mt-0.5 line-clamp-1">
                        {link.description || 'Stay tuned for updates'}
                      </p>
                    </div>
                  </div>
                );
              })}

              {links.filter(l => l.active).length === 0 && (
                <div className="col-span-2 p-6 rounded-xl border border-dashed border-[#E7E0D8] text-center text-xs text-[#78716C]">
                  No active channels currently published. Add or toggle channels above to view them here.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {editingModalOpen && editingLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-xl p-6 sm:p-8 border border-[#E7E0D8] shadow-elevated max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E0D8]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    {editingLink.isNew ? 'Add Official Channel Link' : 'Edit Channel Link'}
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Configure destination URLs and cards shown to students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingModalOpen(false)}
                  className="text-[#78716C] hover:text-[#1C1917] p-1"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveModal(editingLink);
                }}
                className="space-y-4 text-xs"
              >
                {/* Platform Selector */}
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1.5">
                    Platform / Network Type *
                  </label>
                  <select
                    value={editingLink.platform}
                    onChange={(e) => {
                      const newPlatform = e.target.value;
                      const preset = PLATFORM_CONFIGS[newPlatform] || PLATFORM_CONFIGS.custom;
                      setEditingLink({
                        ...editingLink,
                        platform: newPlatform,
                        title: editingLink.isNew ? preset.defaultTitle : editingLink.title,
                        tag: editingLink.isNew ? preset.defaultTag : editingLink.tag,
                        handle: editingLink.isNew ? preset.defaultHandle : editingLink.handle,
                        description: editingLink.isNew ? preset.defaultDesc : editingLink.description
                      });
                    }}
                    className="editorial-input bg-white"
                  >
                    {Object.entries(PLATFORM_CONFIGS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Title & Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1.5">
                      Platform Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingLink.title}
                      onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                      placeholder="e.g. WhatsApp Channel"
                      className="editorial-input"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1.5">
                      Handle / Headline Display *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingLink.handle}
                      onChange={(e) => setEditingLink({ ...editingLink, handle: e.target.value })}
                      placeholder="e.g. @bcs_spectrum or Official WhatsApp"
                      className="editorial-input"
                    />
                  </div>
                </div>

                {/* Target Destination URL */}
                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1.5">
                    Destination Web URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    placeholder={PLATFORM_CONFIGS[editingLink.platform]?.placeholderUrl || 'https://...'}
                    className="editorial-input font-mono text-xs"
                  />
                  <p className="text-[11px] text-[#78716C] mt-1">
                    Direct web or app link where students will be routed when clicking this card.
                  </p>
                </div>

                {/* Tag / Category Badge & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#1C1917] mb-1.5">
                      Card Tag Badge
                    </label>
                    <input
                      type="text"
                      value={editingLink.tag}
                      onChange={(e) => setEditingLink({ ...editingLink, tag: e.target.value })}
                      placeholder="e.g. INSTAGRAM or WHATSAPP"
                      className="editorial-input uppercase"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingLink.active}
                        onChange={(e) => setEditingLink({ ...editingLink, active: e.target.checked })}
                        className="rounded border-[#E7E0D8] text-[#C25E42] focus:ring-[#C25E42]"
                      />
                      <span className="font-semibold text-[#1C1917]">
                        Publish Live on Portal
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C1917] mb-1.5">
                    Card Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={editingLink.description}
                    onChange={(e) => setEditingLink({ ...editingLink, description: e.target.value })}
                    placeholder="e.g. Stories, reels, & event highlights"
                    className="editorial-input"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-4 border-t border-[#E7E0D8] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingModalOpen(false)}
                    className="px-4 py-2 border border-[#E7E0D8] text-xs font-medium rounded hover:bg-[#FAF8F5] text-[#78716C]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#C25E42] text-white text-xs font-medium rounded hover:bg-[#A94E35] transition-colors shadow-subtle flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingLink.isNew ? 'Add to Portal' : 'Save Channel'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
