import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MousePointerClick } from 'lucide-react';
import BCSLogo from '../BCSLogo';
import ClubLogo from '../common/ClubLogo';

// ==========================================
// CONFIGURATION CONSTANTS
// ==========================================
const PARTICLE_COUNT_MOBILE = 40;
const PARTICLE_COUNT_DESKTOP = 90;
const BURST_DURATION_MS = 900;
const SQUASH_DURATION_MS = 120;
const LABEL_BOOM_DURATION_MS = 1000;
const COOLDOWN_MS = 1500;
const COLORS = ['#5EEAF2', '#C4603F', '#FBD3C0', '#5EEAF2', '#C4603F']; // Cyan, Terracotta, Peach

export default function SpectrumOrbitalHub({
  clubs = [],
  spectrumConfig = {},
  onSelectClub
}) {
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredClub, setHoveredClub] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSquashed, setIsSquashed] = useState(false);
  const [isBoomLabel, setIsBoomLabel] = useState(false);
  const [hasTappedOnce, setHasTappedOnce] = useState(false);
  const [isRingFlashing, setIsRingFlashing] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const orbRef = useRef(null);
  const lastTapTimeRef = useRef(0);
  const particlesRef = useRef([]);
  const shockwavesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const isTabVisibleRef = useRef(true);
  const isIntersectingRef = useRef(true);

  const [containerSize, setContainerSize] = useState(600);

  // Prefers-reduced-motion check
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Responsive sizing with ResizeObserver & devicePixelRatio capped at 2
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const mobileCheck = windowWidth < 640;
      setIsMobile(mobileCheck);

      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.offsetWidth || windowWidth;
        const targetWidth = Math.min(parentWidth, windowWidth - 24, 750);
        const size = Math.max(Math.min(targetWidth, 750), 320);
        setContainerSize(size);

        if (canvasRef.current) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvasRef.current.width = size * dpr;
          canvasRef.current.height = size * dpr;
          canvasRef.current.style.width = `${size}px`;
          canvasRef.current.style.height = `${size}px`;
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) ctx.scale(dpr, dpr);
        }
      }
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const center = containerSize / 2;
  const logoSize = isMobile ? Math.max(containerSize * 0.26, 96) : Math.max(containerSize * 0.22, 125);
  const explodedRadius = isMobile ? Math.min(containerSize * 0.35, center - 45) : Math.max(containerSize * 0.36, 160);

  // Single rAF Canvas Render Loop (stops when idle, pauses when off-screen / tab hidden)
  const runRenderLoop = useCallback(() => {
    if (animFrameIdRef.current) return;

    const loop = (timestamp) => {
      if (!isTabVisibleRef.current || !isIntersectingRef.current) {
        animFrameIdRef.current = null;
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameIdRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, containerSize, containerSize);

      let hasActiveElements = false;

      // 1. Draw Shockwave Rings (2 staggered expanding rings)
      shockwavesRef.current = shockwavesRef.current.filter((ring) => {
        const elapsed = timestamp - ring.startTime;
        if (elapsed < 0) return true; // staggered wait
        const progress = Math.min(elapsed / ring.duration, 1);
        if (progress >= 1) return false;

        hasActiveElements = true;
        const currentRadius = ring.initialRadius + (ring.maxRadius - ring.initialRadius) * progress;
        const opacity = (1 - progress) * 0.85;

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 2 * (1 - progress * 0.5);
        ctx.globalAlpha = opacity;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      // 2. Draw Burst Particles (40 mobile / 90 desktop)
      particlesRef.current = particlesRef.current.filter((p) => {
        const elapsed = timestamp - p.startTime;
        const progress = Math.min(elapsed / p.duration, 1);
        if (progress >= 1) return false;

        hasActiveElements = true;

        // Ease-out deceleration
        const easeOut = 1 - Math.pow(1 - progress, 2);
        const currentX = p.startX + p.vx * p.distance * easeOut;
        const currentY = p.startY + p.vy * p.distance * easeOut;
        const alpha = 1 - progress;
        const size = p.initialSize * (1 - progress * 0.7);

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, currentY, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        return true;
      });

      if (hasActiveElements) {
        animFrameIdRef.current = requestAnimationFrame(loop);
      } else {
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
  }, [containerSize]);

  // Tab visibility & IntersectionObserver
  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current && (particlesRef.current.length > 0 || shockwavesRef.current.length > 0)) {
        runRenderLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting && (particlesRef.current.length > 0 || shockwavesRef.current.length > 0)) {
          runRenderLoop();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [runRenderLoop]);

  // Trigger Explode sequence
  const handlePointerDown = (e) => {
    // Prevent default tap highlight & double-tap zoom
    e.preventDefault();
    e.stopPropagation();

    const now = performance.now();
    if (now - lastTapTimeRef.current < COOLDOWN_MS) {
      return; // Cooldown active
    }
    lastTapTimeRef.current = now;
    setHasTappedOnce(true);

    // Haptic vibration (mobile)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (err) {}
    }

    // Step 1: 120ms Squash (scale 0.92)
    setIsSquashed(true);

    setTimeout(() => {
      setIsSquashed(false);
      setIsRingFlashing(true);
      setIsBoomLabel(true);
      setIsExploded((prev) => !prev);

      const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      const nowTimestamp = performance.now();

      if (!prefersReducedMotion) {
        // Step 2: Spawn burst particles
        const newParticles = [];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.6 + 0.4;
          const distance = (isMobile ? 130 : 220) * speed;
          const size = Math.random() * 3 + 1.5;
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];

          newParticles.push({
            startX: center,
            startY: center,
            vx: Math.cos(angle),
            vy: Math.sin(angle),
            distance,
            initialSize: size,
            color,
            startTime: nowTimestamp,
            duration: BURST_DURATION_MS + Math.random() * 200
          });
        }
        particlesRef.current = newParticles;

        // Step 3: Shockwaves (2 expanding rings staggered by 120ms)
        const orbRadius = logoSize / 2;
        shockwavesRef.current = [
          {
            x: center,
            y: center,
            initialRadius: orbRadius,
            maxRadius: orbRadius * 2.5,
            color: '#C4603F',
            startTime: nowTimestamp,
            duration: 650
          },
          {
            x: center,
            y: center,
            initialRadius: orbRadius,
            maxRadius: orbRadius * 2.5,
            color: '#C4603F',
            startTime: nowTimestamp + 120,
            duration: 650
          }
        ];

        // Step 4: Blast impulse dispatched to background particle network
        if (typeof window !== 'undefined') {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            window.dispatchEvent(
              new CustomEvent('spectrum-blast-impulse', {
                detail: {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                  force: isMobile ? 18 : 28,
                  radius: isMobile ? 220 : 350
                }
              })
            );
          }
        }

        // Start Canvas rAF
        runRenderLoop();
      }

      // Step 5: Flash fade & Label returns to "TAP TO EXPLODE" after 1 second
      setTimeout(() => {
        setIsRingFlashing(false);
      }, 400);

      setTimeout(() => {
        setIsBoomLabel(false);
      }, LABEL_BOOM_DURATION_MS);
    }, SQUASH_DURATION_MS);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2 select-none overflow-visible">
      <div
        ref={containerRef}
        style={{
          height: `${containerSize}px`,
          width: `${containerSize}px`,
          touchAction: 'manipulation'
        }}
        className="relative max-w-full flex items-center justify-center overflow-visible my-auto rounded-full"
      >
        {/* BURST & SHOCKWAVE CANVAS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CENTRAL MAIN SPECTRUM ORB                                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div
          ref={orbRef}
          onPointerDown={handlePointerDown}
          style={{
            width: `${logoSize}px`,
            height: `${logoSize}px`,
            left: `${center}px`,
            top: `${center}px`,
            transform: `translate(-50%, -50%) scale(${isSquashed ? 0.92 : 1})`,
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            minWidth: '64px',
            minHeight: '64px'
          }}
          className={`absolute z-30 rounded-full cursor-pointer flex flex-col items-center justify-center transition-transform duration-100 ease-out select-none ${
            isRingFlashing
              ? 'bg-white border-3 border-[#5EEAF2] shadow-[0_0_50px_rgba(94,234,242,0.6)]'
              : 'bg-white/95 border-3 border-[#C4603F] shadow-[0_0_30px_rgba(196,96,63,0.25)] hover:shadow-[0_0_45px_rgba(196,96,63,0.35)]'
          }`}
          title="Tap to explode!"
        >
          {/* Terracotta outer energetic ring */}
          <div className="absolute -inset-2.5 rounded-full border border-dashed border-[#5EEAF2]/50 animate-spin-slow pointer-events-none" />
          <div className="absolute -inset-5 rounded-full border border-[#C4603F]/40 animate-reverse-spin pointer-events-none" />

          {/* Core glow */}
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#5EEAF2]/15 via-[#C4603F]/10 to-transparent pointer-events-none" />

          {/* Central Logo */}
          <BCSLogo
            className="w-12 h-12 sm:w-18 sm:h-18 transition-transform duration-300 pointer-events-none"
            animated={true}
            customLogoUrl={spectrumConfig?.logo_url}
          />

          {/* Central Label (Changes to "BOOM!" on tap, then returns to "TAP TO EXPLODE") */}
          <div className="text-center mt-0.5 pointer-events-none px-1">
            <span className="text-[9px] sm:text-[11px] font-serif font-bold text-[#1C1917] tracking-tight block leading-none truncate max-w-[85px] sm:max-w-[120px]">
              {spectrumConfig?.title || 'Creative Spectrum'}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  isBoomLabel ? 'bg-[#5EEAF2] animate-ping' : 'bg-[#C4603F] animate-pulse'
                }`}
              />
              <span
                className={`text-[7px] sm:text-[8px] uppercase tracking-[0.16em] font-extrabold transition-colors duration-200 ${
                  isBoomLabel ? 'text-[#5EEAF2] scale-110' : 'text-[#C4603F]'
                }`}
              >
                {isBoomLabel ? 'BOOM!' : 'TAP TO EXPLODE'}
              </span>
            </div>
          </div>

          {/* "TAP ME!" Pill (Hides automatically after first successful tap) */}
          {!hasTappedOnce && (
            <div className="absolute -bottom-6 sm:-bottom-7 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#1C1917] text-white text-[8px] sm:text-[9px] font-bold tracking-wide whitespace-nowrap shadow-xl opacity-95 transition-all flex items-center gap-1 border border-white/10 pointer-events-none">
              <MousePointerClick className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#5EEAF2] animate-bounce" />
              <span className="text-[#5EEAF2]">TAP ME!</span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EXPLODED CLUB CARDS (SPRING REVEAL)                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isExploded &&
            clubs.map((club, index) => {
              const total = Math.max(clubs.length, 1);
              const isTech = club.category === 'Technical';
              const isHovered = hoveredClub?.id === club.id;

              const angleDeg = index * (360 / total) - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const r = explodedRadius * (index % 2 === 0 ? 1.02 : 0.92);

              const targetX = center + Math.cos(angleRad) * r;
              const targetY = center + Math.sin(angleRad) * r;
              const tiltDeg = ((index % 3) - 1) * (isMobile ? 3 : 5);

              return (
                <motion.div
                  key={club.id}
                  initial={{
                    left: `${center}px`,
                    top: `${center}px`,
                    scale: 0,
                    rotate: -20,
                    opacity: 0
                  }}
                  animate={{
                    left: `${targetX}px`,
                    top: `${targetY}px`,
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 0 : tiltDeg,
                    opacity: 1
                  }}
                  exit={{
                    left: `${center}px`,
                    top: `${center}px`,
                    scale: 0,
                    rotate: 35,
                    opacity: 0,
                    transition: { duration: 0.3, ease: 'easeInOut' }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 16,
                    mass: 0.7,
                    delay: index * 0.04
                  }}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    zIndex: isHovered ? 45 : 25
                  }}
                  onMouseEnter={() => setHoveredClub(club)}
                  onMouseLeave={() => setHoveredClub(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClub(club);
                  }}
                  className="cursor-pointer select-none active:scale-95 transition-transform"
                >
                  <div
                    className={`relative px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
                      isHovered ? 'shadow-xl ring-2 -translate-y-1' : 'hover:shadow-md'
                    }`}
                    style={{
                      borderColor: isHovered ? (club.accent_color || '#C4603F') : '#E7E0D8'
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border flex items-center justify-center shadow-sm bg-[#FAF8F5]"
                        style={{ borderColor: club.accent_color || '#C4603F' }}
                      >
                        <ClubLogo src={club.logo} name={club.name} size="full" accentColor={club.accent_color} className="!border-none !rounded-none" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full border border-white flex items-center justify-center text-[7px] sm:text-[9px] text-white bg-gradient-to-br from-[#C4603F] to-[#E07B5E]">
                        {isTech ? '⚡' : '🎭'}
                      </span>
                    </div>

                    <div className="text-left pr-0.5 min-w-[70px] sm:min-w-[110px] max-w-[100px] sm:max-w-[150px]">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif text-[11px] sm:text-sm font-bold text-[#1C1917] truncate leading-tight">
                          {club.name}
                        </h4>
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#A8A29E]" />
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[7px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full bg-[#FAF0ED] text-[#C4603F]">
                          {club.category}
                        </span>
                        <span className="text-[7.5px] sm:text-[9px] text-[#A8A29E] font-medium hidden xs:inline">
                          {club.members_count || 0} mbrs
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
