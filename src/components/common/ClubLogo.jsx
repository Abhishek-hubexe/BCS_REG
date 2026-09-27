import React, { useState } from 'react';

/**
 * Dynamic ClubLogo component:
 * - Preserves aspect ratio
 * - Supports SVG, PNG, JPG, WebP, transparent backgrounds
 * - Handles square, horizontal, and circular marks
 * - Graceful fallback to stylized monogram if broken or missing
 */
export default function ClubLogo({
  src,
  name = 'Club',
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  className = '',
  accentColor = '#C25E42'
}) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Size configurations
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-medium',
    full: 'w-full h-full'
  };

  const getInitials = (str) => {
    if (!str) return 'CS';
    const words = str.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const isSvg = typeof src === 'string' && (src.endsWith('.svg') || src.includes('data:image/svg'));

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 rounded-md overflow-hidden bg-[#F4EFEA] border border-[#E7E0D8] ${sizeMap[size] || sizeMap.md} ${className}`}
      title={name}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={`${name} logo`}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ objectFit: isSvg ? 'contain' : 'cover' }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-serif text-[#C25E42] bg-[#FAF0ED] select-none font-semibold tracking-wider"
          style={{ color: accentColor }}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
