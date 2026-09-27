import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Link as LinkIcon, Instagram, MessageCircle } from 'lucide-react';
import { PLATFORM_CONFIGS } from '../admin/AdminOfficialLinks';

export default function CommunityChannels({ spectrumConfig = {} }) {
  const badge = spectrumConfig?.social_links_badge || 'OFFICIAL CHANNELS';
  const title = spectrumConfig?.social_links_title || 'Join Our Community Channels';
  const subtitle = spectrumConfig?.social_links_subtitle || 'Stay connected for real-time announcements, audition notifications, and club highlights.';

  // Retrieve official links list if configured by admin
  let activeLinks = [];
  if (Array.isArray(spectrumConfig?.official_links) && spectrumConfig.official_links.length > 0) {
    activeLinks = spectrumConfig.official_links.filter(l => l.active !== false);
  }

  // Fallback if no official links array was provided
  if (activeLinks.length === 0) {
    const instagramUrl = spectrumConfig?.instagram_url?.trim() || '';
    const whatsappUrl = spectrumConfig?.whatsapp_channel_url?.trim() || '';

    if (instagramUrl) {
      activeLinks.push({
        id: 'fallback-instagram',
        platform: 'instagram',
        title: 'Instagram',
        handle: instagramUrl.startsWith('@') ? instagramUrl : `@${instagramUrl.split('/').filter(Boolean).pop() || 'bcs_spectrum'}`,
        url: instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl.replace(/^@/, '')}`,
        description: 'Stories, reels, & event highlights',
        tag: 'INSTAGRAM',
        active: true
      });
    }

    if (whatsappUrl) {
      activeLinks.push({
        id: 'fallback-whatsapp',
        platform: 'whatsapp',
        title: 'WhatsApp Channel',
        handle: 'Official WhatsApp Broadcast',
        url: whatsappUrl.startsWith('http') ? whatsappUrl : `https://chat.whatsapp.com/${whatsappUrl}`,
        description: 'Instant audition & registration alerts',
        tag: 'WHATSAPP CHANNEL',
        active: true
      });
    }
  }

  // If no links at all, hide section gracefully
  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 bg-[#FAF8F5] border-t border-[#E7E0D8]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#E1306C]/10 via-[#F77737]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#25D366]/10 via-[#128C7E]/5 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl border border-[#E7E0D8] rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Info Column */}
            <div className="text-center lg:text-left space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0ED] border border-[#EAD8D2] text-[#C25E42] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Right Action Cards Column */}
            <div className={`grid gap-4 w-full lg:w-auto ${
              activeLinks.length === 1 
                ? 'grid-cols-1 lg:min-w-[320px]' 
                : activeLinks.length === 2 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:min-w-[480px]' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 lg:min-w-[560px]'
            }`}>
              {activeLinks.map((link, idx) => {
                const config = (PLATFORM_CONFIGS && PLATFORM_CONFIGS[link.platform]) || {
                  icon: LinkIcon,
                  iconBg: 'bg-gradient-to-tr from-[#C28B38] to-[#966318]',
                  iconShadow: 'shadow-[#C28B38]/20 group-hover:shadow-[#C28B38]/40',
                  cardBg: 'bg-gradient-to-br from-[#FCF8EE] to-[#F7EED7]',
                  cardBorder: 'border-[#EEDEB8] hover:border-[#C28B38]/50',
                  hoverGlow: 'from-[#C28B38]/10 to-[#966318]/5',
                  arrowHover: 'group-hover:bg-[#C28B38] group-hover:text-white',
                  tagColor: 'text-[#8C6120]',
                  dotColor: 'bg-[#C28B38]',
                  titleHover: 'group-hover:text-[#8C6120]',
                  defaultTag: 'OFFICIAL LINK'
                };
                const Icon = config.icon;

                // Smart format destination URL
                let finalUrl = (link.url || '').trim();
                if (link.platform === 'instagram' && finalUrl && !finalUrl.startsWith('http')) {
                  finalUrl = `https://instagram.com/${finalUrl.replace(/^@/, '')}`;
                } else if (link.platform === 'telegram' && finalUrl && !finalUrl.startsWith('http')) {
                  finalUrl = `https://t.me/${finalUrl.replace(/^@/, '')}`;
                } else if (link.platform === 'whatsapp' && finalUrl && !finalUrl.startsWith('http')) {
                  finalUrl = `https://chat.whatsapp.com/${finalUrl}`;
                }

                return (
                  <motion.a
                    key={link.id || idx}
                    href={finalUrl || '#'}
                    target={finalUrl ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      if (!finalUrl) {
                        e.preventDefault();
                        alert(`${link.title || 'Official channel'} link has not been configured yet.`);
                      }
                    }}
                    className={`group relative overflow-hidden p-5 rounded-2xl ${config.cardBg} border ${config.cardBorder} transition-all shadow-sm flex flex-col justify-between`}
                  >
                    {/* Vibrant ambient hover glow */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${config.hoverGlow} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    
                    <div className="flex items-start justify-between relative z-10 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center text-white shadow-md ${config.iconShadow} group-hover:rotate-2 transition-all`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`w-8 h-8 rounded-full bg-white/80 border ${config.cardBorder} flex items-center justify-center text-[#78716C] ${config.arrowHover} transition-all shadow-sm`}>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${config.tagColor}`}>
                          {link.tag || config.defaultTag}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                      </div>
                      <p className={`font-bold text-sm sm:text-base text-[#1C1917] ${config.titleHover} transition-colors line-clamp-1`}>
                        {link.handle || link.title}
                      </p>
                      <p className="text-[11px] text-[#78716C] mt-1 line-clamp-1">
                        {link.description || 'Official community channel'}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
