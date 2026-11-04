/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Heart, 
  Hotel, 
  Scroll, 
  ExternalLink, 
  ZoomIn, 
  X, 
  Share2, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  ShieldAlert,
  Luggage,
  Ticket,
  Check,
  Flame,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

function ScrollRevealClue({ children, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transform transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 filter-none'
          : 'opacity-0 translate-y-8 scale-[0.97] blur-[1px]'
      }`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedClues, setCompletedClues] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false });
  const [copiedShare, setCopiedShare] = useState(false);
  
  // Interactive Luggage Checklist
  const [luggageItems, setLuggageItems] = useState<{ [key: string]: boolean }>({
    toga: false,
    calzado: false,
    proteccion: false,
    ganas: true,
  });
  const [luggageOpen, setLuggageOpen] = useState(true);

  // Tessera Hospitalis Vouchers redeemed state
  const [redeemedVouchers, setRedeemedVouchers] = useState<{ [key: string]: boolean }>({
    helado: false,
    chupachups: false,
  });

  const revealRef = useRef<HTMLDivElement>(null);

  // Play a regal fanfare chord using Web Audio API
  const playImperialFanfare = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const notes = [
        { freq: 293.66, delay: 0, dur: 0.25 },     // D4
        { freq: 369.99, delay: 0.18, dur: 0.25 },  // F#4
        { freq: 440.00, delay: 0.36, dur: 0.35 },  // A4
        { freq: 587.33, delay: 0.65, dur: 0.9 },   // D5 (held)
        { freq: 739.99, delay: 1.05, dur: 1.4 },   // F#5 (triumphant climax)
      ];

      notes.forEach(({ freq, delay, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      });
    } catch {
      // safe fallback if audio context restricted
    }
  };

  const triggerLaurelConfetti = () => {
    const goldPalette = ['#d4af37', '#f3e5ab', '#6b0f1a', '#ffffff', '#aa8214'];
    
    // Center burst
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: goldPalette,
      scalar: 1.2,
      shapes: ['circle', 'square'],
      ticks: 250,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.65 },
        colors: goldPalette,
      });
    }, 200);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.65 },
        colors: goldPalette,
      });
    }, 400);

    // Golden shower from the heavens
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 120,
        origin: { y: 0.2 },
        colors: ['#d4af37', '#f7ecc5', '#ffffff'],
        drift: 0.1,
        gravity: 0.7,
      });
    }, 700);
  };

  const handleReveal = () => {
    setIsRevealed(true);
    triggerLaurelConfetti();
    playImperialFanfare();

    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const toggleClue = (id: number) => {
    setCompletedClues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLuggage = (key: string) => {
    setLuggageItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const redeemVoucher = (key: string) => {
    if (redeemedVouchers[key]) return;
    setRedeemedVouchers(prev => ({ ...prev, [key]: true }));
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#d4af37', '#6b0f1a', '#ffffff'],
      scalar: 1,
    });
  };

  const handleShare = () => {
    const shareData = {
      title: 'Edicto Imperial: Viaje Sorpresa a Mérida',
      text: '¡Convocatoria Imperial para Marcos Prato! Destino revelado: Emerita Lvdica 🏛️',
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Google Calendar prefilled URL for 14-16 May 2026
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    '🏛️ Viaje a Emérita Lvdica (Cumpleaños Marcos Prato)'
  )}&dates=20260514T100000Z/20260516T200000Z&details=${encodeURIComponent(
    'Fin de semana imperial en Mérida para la XVI Emerita Lvdica. Alojamiento: Hotel Velada Mérida. Toga y espíritu gladiador listos.'
  )}&location=${encodeURIComponent('Hotel Velada Mérida, Avda. Reina Sofía, s/n, 06800 Mérida, Badajoz')}`;

  return (
    <div className="min-h-screen bg-[#0e0708] bg-[radial-gradient(circle_at_top,#2a080e_0%,#0e0708_70%)] py-4 px-3 sm:px-4 flex flex-col items-center justify-start text-[#1f1f1f]">
      
      {/* Top Floating Controls Bar */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-2 text-xs font-cinzel text-[#d4af37] border-b border-[#d4af37]/20 mb-3">
        <span className="flex items-center gap-1.5 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#d4af37]/80 inline-block"></span>
          ANNO MMXXVII
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? 'Silenciar fanfarria' : 'Activar fanfarria'}
            className="p-1.5 rounded-md hover:bg-[#d4af37]/10 transition-colors text-[#d4af37] flex items-center gap-1"
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-[#d4af37]/50" />}
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-md hover:bg-[#d4af37]/10 transition-colors text-[#d4af37] flex items-center gap-1"
            title="Compartir edicto"
          >
            <Share2 size={16} />
            <span className="hidden xs:inline text-[10px]">{copiedShare ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Card Wrapper */}
      <main className="w-full max-w-md flex flex-col gap-5 pb-16">

        {/* ========================================================
            1. HERO SECTION: EL EDICTO IMPERIAL
           ======================================================== */}
        <section 
          className="relative bg-[#fbf7ee] rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-[#d4af37] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(#e5d7bc 0.8px, transparent 0.8px), radial-gradient(#ede3cf 0.8px, #fbf7ee 0.8px)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7), inset 0 0 40px rgba(107,15,26,0.06)'
          }}
        >
          {/* Top & Bottom Roman Ornate Trim */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#aa8214] via-[#f3e5ab] to-[#aa8214] opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#aa8214] via-[#f3e5ab] to-[#aa8214] opacity-80" />

          {/* Corner Flourishes */}
          <div className="absolute top-3 left-3 text-[#aa8214] text-xs select-none opacity-60">❖</div>
          <div className="absolute top-3 right-3 text-[#aa8214] text-xs select-none opacity-60">❖</div>
          <div className="absolute bottom-3 left-3 text-[#aa8214] text-xs select-none opacity-60">❖</div>
          <div className="absolute bottom-3 right-3 text-[#aa8214] text-xs select-none opacity-60">❖</div>

          {/* SPQR Imperial Engraved Seal */}
          <div className="flex flex-col items-center text-center pt-2 mb-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#6b0f1a] to-[#3f0910] border-2 border-[#d4af37] flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#d4af37]/60" />
              <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-widest drop-shadow">
                S·P·Q·R
              </span>
              <span className="text-[9px] text-[#f3e5ab] tracking-tighter uppercase font-cinzel">
                AVG
              </span>
            </div>

            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-3 mb-1" />
            <span className="font-cinzel text-[11px] font-semibold tracking-[0.25em] text-[#6b0f1a] uppercase">
              Senatvs Popvlvsqve Romanvs
            </span>
          </div>

          {/* Edicto Title */}
          <div className="text-center mb-4">
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-[#6b0f1a] leading-tight tracking-wide">
              EDICTO IMPERIAL:
              <span className="block text-base sm:text-lg text-[#aa8214] font-bold mt-1">
                CONVOCATORIA SECRETA
              </span>
            </h1>
          </div>

          {/* Parchment Body Text */}
          <div className="space-y-3 font-lora text-[15px] sm:text-[16px] text-[#2c2224] leading-relaxed text-justify px-1">
            <p>
              Por orden superior del <strong className="font-cinzel text-[#6b0f1a]">Senado y la Presidencia</strong>, el ciudadano <strong className="font-cinzel text-[#6b0f1a] tracking-wide text-base">MARCOS PRATO</strong> ha sido citado para una misión imperdible. Para descubrir tu destino, debes interpretar las pistas...
            </p>
          </div>

          {/* Roman Divider */}
          <div className="flex items-center justify-center gap-2 my-4 text-[#d4af37]">
            <div className="h-[1px] w-12 bg-[#d4af37]" />
            <span className="text-xs font-cinzel">✦ · 🏛️ · ✦</span>
            <div className="h-[1px] w-12 bg-[#d4af37]" />
          </div>

          {/* Small seal stamp at bottom */}
          <div className="flex justify-between items-end pt-2 text-[11px] font-cinzel text-[#826e58] border-t border-[#d4af37]/30">
            <span>REGISTRO: IMP·LV-2026</span>
            <span className="text-[#6b0f1a] font-bold">CONFIDENCIAL</span>
          </div>
        </section>

    {/* ========================================================
    2. CLUES SECTION: 4 SEQUENTIAL CARDS (Scroll Reveal)
   ======================================================== */}
<section className="flex flex-col gap-3">
  <div className="flex items-center justify-between px-1">
    <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
      <Scroll size={14} />
      Pistas del Enigma Imperial
    </h2>

    {/* <span className="text-[11px] font-cinzel text-[#d4af37]/70">
      Toca para marcar
    </span> */}
  </div>

  {/* CLUE 1 */}
  <ScrollRevealClue delay={100}>
    <div 
      onClick={() => toggleClue(1)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') toggleClue(1); 
      }}
      className={`cursor-pointer group relative bg-gradient-to-r from-[#21090d] to-[#180608] rounded-xl p-4 border transition-all duration-300 ${
        completedClues[1] 
          ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
          : 'border-[#d4af37]/30 hover:border-[#d4af37]/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#3f0910] border border-[#d4af37]/60 flex items-center justify-center text-lg shadow-inner">
          🏛️
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">
              PISTA I · LA ERA DORADA
            </span>

            {completedClues[1] ? (
              <CheckCircle2 size={16} className="text-[#d4af37]" />
            ) : (
              <span className="text-[10px] text-[#f3e5ab]/60 font-cinzel">
                Pista 1/4
              </span>
            )}
          </div>

          <p className="font-lora text-sm text-[#fbf7ee] mt-1 leading-snug">
            Viajaremos más de 2.000 años atrás en el tiempo, a una época de gladiadores, aurigas y césares.
          </p>
        </div>
      </div>
    </div>
  </ScrollRevealClue>

  {/* CLUE 2 */}
  <ScrollRevealClue delay={250}>
    <div 
      onClick={() => toggleClue(2)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') toggleClue(2); 
      }}
      className={`cursor-pointer group relative bg-gradient-to-r from-[#21090d] to-[#180608] rounded-xl p-4 border transition-all duration-300 ${
        completedClues[2] 
          ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
          : 'border-[#d4af37]/30 hover:border-[#d4af37]/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#3f0910] border border-[#d4af37]/60 flex items-center justify-center text-lg shadow-inner">
          🍷
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">
              PISTA II · LA FIESTA VIVA
            </span>

            {completedClues[2] ? (
              <CheckCircle2 size={16} className="text-[#d4af37]" />
            ) : (
              <span className="text-[10px] text-[#f3e5ab]/60 font-cinzel">
                Pista 2/4
              </span>
            )}
          </div>

          <p className="font-lora text-sm text-[#fbf7ee] mt-1 leading-snug">
            No es un museo... es una ciudad entera vestida de época donde la gente vive, bebe y celebra como verdaderos romanos.
          </p>
        </div>
      </div>
    </div>
  </ScrollRevealClue>

  {/* CLUE 3 */}
  <ScrollRevealClue delay={400}>
    <div 
      onClick={() => toggleClue(3)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') toggleClue(3); 
      }}
      className={`cursor-pointer group relative bg-gradient-to-r from-[#21090d] to-[#180608] rounded-xl p-4 border transition-all duration-300 ${
        completedClues[3] 
          ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
          : 'border-[#d4af37]/30 hover:border-[#d4af37]/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#3f0910] border border-[#d4af37]/60 flex items-center justify-center text-lg shadow-inner">
          🥓
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">
              PISTA III · EL BANQUETE DEL CÉSAR
            </span>

            {completedClues[3] ? (
              <CheckCircle2 size={16} className="text-[#d4af37]" />
            ) : (
              <span className="text-[10px] text-[#f3e5ab]/60 font-cinzel">
                Pista 3/4
              </span>
            )}
          </div>

          <p className="font-lora text-sm text-[#fbf7ee] mt-1 leading-snug">
            Tierra de majestuosos acueductos, templos de diosas y el mejor tapeo extremeño.
          </p>
        </div>
      </div>
    </div>
  </ScrollRevealClue>

  {/* CLUE 4 */}
  <ScrollRevealClue delay={550}>
    <div 
      onClick={() => toggleClue(4)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { 
        if (e.key === 'Enter' || e.key === ' ') toggleClue(4); 
      }}
      className={`cursor-pointer group relative bg-gradient-to-r from-[#21090d] to-[#180608] rounded-xl p-4 border transition-all duration-300 ${
        completedClues[4] 
          ? 'border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
          : 'border-[#d4af37]/30 hover:border-[#d4af37]/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-[#3f0910] border border-[#d4af37]/60 flex items-center justify-center text-lg shadow-inner">
          📱
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">
              PISTA IV · LA INFLUENCER EXTREMEÑA
            </span>

            {completedClues[4] ? (
              <CheckCircle2 size={16} className="text-[#d4af37]" />
            ) : (
              <span className="text-[10px] text-[#f3e5ab]/60 font-cinzel">
                Pista 4/4
              </span>
            )}
          </div>

          <p className="font-lora text-sm text-[#fbf7ee] mt-1 leading-snug">
            Una conocida influencer con nombre de postre, que vive en un pueblo, ha visitado este lugar en más de una ocasión... y siempre acaba volviendo.
          </p>
        </div>
      </div>
    </div>
  </ScrollRevealClue>
</section>
        
        {/* ========================================================
            3. REVEAL BUTTON & INTERACTION (Disappears after reveal)
           ======================================================== */}
        {!isRevealed && (
          <section className="pt-2 transition-all duration-500">
            <button
              onClick={handleReveal}
              type="button"
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#801220] via-[#aa192b] to-[#6b0f1a] text-[#fbf7ee] py-4 px-5 border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-95 transition-all duration-200 cursor-pointer animate-imperial-glow"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />

              <div className="relative flex items-center justify-center gap-2 font-cinzel text-base sm:text-lg font-black tracking-wider text-[#fbf7ee]">
                <span className="text-xl">🏛️</span>
                <span className="drop-shadow-md">DESVELAR MI DESTINO IMPERIAL</span>
                <Sparkles size={18} className="text-[#f3e5ab] animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="text-center font-lora italic text-[11px] text-[#f3e5ab]/80 mt-0.5">
                Toca aquí para romper el sello del Senado
              </div>
            </button>
          </section>
        )}

        {/* ========================================================
            4. UNHIDDEN REVEAL CONTAINER (GRAND REVEAL)
           ======================================================== */}
        <div
          ref={revealRef}
          className={`flex flex-col gap-6 transition-all duration-700 ease-out ${
            isRevealed ? 'opacity-100 max-h-none translate-y-0 mt-2' : 'hidden opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          {/* Main Headline Banner */}
          <div className="text-center relative py-3">
            <div className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 mb-2">
              <span className="text-xs font-cinzel tracking-widest text-[#d4af37] font-semibold uppercase">
                ✦ Revelación Oficial del Viaje ✦
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f7ecc5] via-[#d4af37] to-[#f3e5ab] leading-tight drop-shadow-md">
              ¡NOS VAMOS A EMÉRITA LVDICA! 🏛️✨
            </h2>
            <p className="font-cinzel text-sm sm:text-base text-[#d4af37]/90 tracking-wide mt-1">
              Destino: <span className="font-bold text-white">Mérida</span> (Extremadura)
            </p>
          </div>

          {/* TICKET / VIP PASS CARD (Gold embossed border, notched styling) */}
          <div className="relative bg-[#fbf7ee] rounded-2xl border-2 border-[#d4af37] shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#6b0f1a] via-[#8c1423] to-[#6b0f1a] text-[#f3e5ab] px-4 py-3 flex items-center justify-between border-b-2 border-[#d4af37]">
              <div className="flex items-center gap-2">
                <span className="text-base font-cinzel font-bold tracking-widest">
                  PASE VIP IMPERIAL
                </span>
              </div>
              <span className="font-cinzel text-xs text-[#d4af37] border border-[#d4af37]/40 rounded px-2 py-0.5">
                Nº 1986-2026
              </span>
            </div>

            {/* Ticket Notches */}
            <div className="absolute top-12 -left-3 w-6 h-6 rounded-full bg-[#0e0708] border-r-2 border-[#d4af37]" />
            <div className="absolute top-12 -right-3 w-6 h-6 rounded-full bg-[#0e0708] border-l-2 border-[#d4af37]" />

            {/* Ticket Details */}
            <div className="p-5 space-y-4 font-lora">
              {/* Fechas */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[#6b0f1a]/10 border border-[#d4af37] flex items-center justify-center text-[#6b0f1a]">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="block font-cinzel text-xs font-bold uppercase text-[#6b0f1a] tracking-wider">
                    FECHAS DEL VIAJE
                  </span>
                  <span className="text-base font-semibold text-[#1f1f1f]">
                    Del viernes 14 de mayo al domingo 16 de mayo
                  </span>
                  <span className="block text-xs text-[#735e47] mt-0.5">
                    Coincidiendo con el clímax de la fiesta romana
                  </span>
                </div>
              </div>

              {/* Alojamiento */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[#6b0f1a]/10 border border-[#d4af37] flex items-center justify-center text-[#6b0f1a]">
                  <Hotel size={18} />
                </div>
                <div>
                  <span className="block font-cinzel text-xs font-bold uppercase text-[#6b0f1a] tracking-wider">
                    ALOJAMIENTO OFICIAL
                  </span>
                  <span className="text-base font-semibold text-[#1f1f1f]">
                    Hotel Velada Mérida
                  </span>
                  <span className="block text-xs text-[#524436]">
                    Avda. Reina Sofía, s/n, Mérida (a pasos del yacimiento arqueológico)
                  </span>
                </div>
              </div>

              {/* Evento */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[#6b0f1a]/10 border border-[#d4af37] flex items-center justify-center text-[#6b0f1a]">
                  <Compass size={18} />
                </div>
                <div>
                  <span className="block font-cinzel text-xs font-bold uppercase text-[#6b0f1a] tracking-wider">
                    GRAN EVENTO
                  </span>
                  <span className="text-base font-semibold text-[#1f1f1f]">
                    XVI Emerita Lvdica
                  </span>
                  <span className="block text-xs text-[#524436]">
                    Recreación histórica romana viva (gladiadores, mercado y teatro)
                  </span>
                </div>
              </div>

              {/* Add to Calendar Link Button */}
              <div className="pt-2">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#6b0f1a] hover:bg-[#801220] text-[#fbf7ee] font-cinzel text-xs font-bold tracking-wider transition-colors shadow"
                >
                  <Calendar size={15} />
                  <span>AGREGAR A GOOGLE CALENDAR</span>
                  <ExternalLink size={13} className="text-[#d4af37]" />
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================
              💌 DECRETO DEL AMOR (Sección Romántica)
             ======================================================== */}
          <div className="relative bg-gradient-to-br from-[#2a070e] via-[#1f060a] to-[#25080f] rounded-2xl p-5 sm:p-6 border-2 border-[#d4af37] shadow-[0_15px_30px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#6b0f1a]/30 rounded-full blur-2xl pointer-events-none" />

            {/* Decree Header */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 mb-2">
                <Heart size={13} className="text-[#d4af37] fill-[#d4af37]" />
                <span className="text-[10px] font-cinzel font-bold text-[#f3e5ab] tracking-widest uppercase">
                  DECRETO DE LA DIOSA AFRODITA
                </span>
                <Heart size={13} className="text-[#d4af37] fill-[#d4af37]" />
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#f3e5ab] leading-snug">
                CON LA BENDICIÓN DE JÚPITER
              </h3>
            </div>

            {/* Romantic Decree Text */}
            <div className="relative p-4 rounded-xl bg-[#120407]/70 border border-[#d4af37]/30 shadow-inner">
              <span className="absolute top-2 left-2 text-[#d4af37]/40 font-serif text-3xl leading-none">“</span>
              <p className="font-lora italic text-sm sm:text-[15px] text-[#fbf7ee] leading-relaxed text-center px-3 pt-1">
                Por decreto de la Diosa Afrodita y con la bendición de Júpiter, este viaje no solo es para conquistar una ciudad, sino para celebrar tu cumpleaños y festejar que tras todo este tiempo sigo eligiéndote como mi gladiador favorito.
              </p>
              <span className="absolute bottom-1 right-2 text-[#d4af37]/40 font-serif text-3xl leading-none">”</span>

              <div className="mt-3 text-center border-t border-[#d4af37]/20 pt-2.5">
                <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider block">
                  ¡Feliz Cumpleaños bebé! ❤️
                </span>
                <span className="text-[11px] font-lora text-[#f3e5ab]/70 italic mt-0.5 block">
                  Tu compañera de viaje en los tiempos pasado, presente y futuro
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              MAPS SECTION: TU HOGAR IMPERIAL Y MAPA DE CONQUISTA
             ======================================================== */}
          <section className="space-y-4">
            <div className="text-center px-2">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#d4af37] tracking-wider flex items-center justify-center gap-2">
                <span>⚔️</span>
                <span>TU HOGAR IMPERIAL Y MAPA DE CONQUISTA</span>
                <span>⚔️</span>
              </h3>
              <p className="font-lora text-xs sm:text-sm text-[#fbf7ee]/80 mt-1">
                Estratégicamente ubicado para recorrer todo el recinto, monumentos y actividades a pie
              </p>
            </div>

            {/* CARD 1: Hotel Velada Mérida con Foto Exterior Real y Plano Perímetro */}
            <div className="bg-[#1f0b0f] rounded-2xl border-2 border-[#d4af37]/80 overflow-hidden shadow-xl">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#3f0910] to-[#25060a] border-b border-[#d4af37]/40 flex items-center justify-between">
                <div>
                  <span className="font-cinzel text-[11px] text-[#d4af37] font-semibold tracking-wider block">
                    BASE DE OPERACIONES
                  </span>
                  <h4 className="font-cinzel text-base font-bold text-white flex items-center gap-1.5">
                    <Hotel size={16} className="text-[#d4af37]" />
                    Hotel Velada Mérida
                  </h4>
                </div>
                <span className="text-[10px] font-cinzel bg-[#d4af37]/20 text-[#f3e5ab] px-2 py-0.5 rounded border border-[#d4af37]/40">
                  4 ESTRELLAS
                </span>
              </div>

              {/* Foto exterior real del hotel (image_11a4be2e.png) */}
              <div 
                className="relative cursor-pointer group overflow-hidden bg-black aspect-video max-h-64 border-b border-[#d4af37]/30"
                onClick={() => setActiveModalImage({
                  src: '/assets/aistudio/image_11a4be2e.png',
                  title: 'Hotel Velada Mérida · Parking y vistas',
                  subtitle: 'Avda. Reina Sofía, s/n, Mérida · 4 estrellas con parking, terraza, piscina y vistas'
                })}
              >
                <img
                  src="/assets/aistudio/image_11a4be2e.png"
                  alt="Hotel Velada Mérida con piscina exterior y terraza iluminada"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-between p-3">
                  <div className="text-white text-xs">
                    <span className="font-semibold block text-[#f3e5ab]">Hotel Velada Mérida</span>
                    <span className="text-[11px] text-gray-300">Con parking exclusivo clientes, piscina y comodidades</span>
                  </div>
                  <div className="bg-[#6b0f1a]/90 text-[#f3e5ab] text-[11px] font-cinzel px-2.5 py-1 rounded flex items-center gap-1 border border-[#d4af37]">
                    <ZoomIn size={12} />
                    {/* <span>Ver foto</span> */}
                  </div>
                </div>
              </div>

              {/* Plano del perímetro con el pin rojo (image_0a54ec44.png) */}
              <div 
                className="relative cursor-pointer group overflow-hidden bg-[#12080a] p-2"
                onClick={() => setActiveModalImage({
                  src: '/assets/aistudio/image_0a54ec44.png',
                  title: 'Plano del Perímetro Emerita Lvdica y Hotel Velada',
                  subtitle: 'Zona verde: Perímetro de actividades · Pin rojo: Ubicación del Hotel Velada Mérida'
                })}
              >
                <div className="relative rounded-xl overflow-hidden border border-[#d4af37]/40 bg-black">
                  <img
                    src="/assets/aistudio/image_0a54ec44.png"
                    alt="Plano del perímetro de Emerita Lvdica con pin rojo de Hotel Velada Mérida"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end justify-between p-3 pointer-events-none">
                    <div className="text-white text-xs">
                      <span className="font-semibold block text-[#f3e5ab]">Plano de Situación</span>
                      <span className="text-[11px] text-gray-300">Toca para abrir a tamaño completo</span>
                    </div>
                    <div className="bg-[#6b0f1a]/90 text-[#f3e5ab] text-[11px] font-cinzel px-2 py-1 rounded flex items-center gap-1 border border-[#d4af37]">
                      <ZoomIn size={12} />
                      {/* <span>Ampliar</span> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Leyenda & Botón Maps */}
              <div className="p-4 space-y-3 bg-[#19070a]">
                <div className="space-y-2 text-xs font-lora">
                  <div className="flex items-start gap-2.5 text-[#fbf7ee]">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#70a83b] inline-block mt-0.5 shrink-0 border border-white/50 shadow-sm"></span>
                    <span className="leading-snug">
                      <strong className="text-[#f3e5ab] font-cinzel">Zona verde delimitada:</strong> Perímetro oficial de Emerita Lvdica donde se concentran las actividades y recreaciones.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#fbf7ee]">
                    <span className="text-base leading-none shrink-0">📍</span>
                    <span className="leading-snug">
                      <strong className="text-[#f3e5ab] font-cinzel">Pin rojo:</strong> Localización del <strong className="text-white">Hotel Velada Mérida</strong>, situado a pocos pasos de la zona de actividades.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#d4af37]/20">
                  <p className="text-xs text-[#fbf7ee]/75 font-lora mb-3">
                    <strong>Dirección:</strong> Avda. Reina Sofía, s/n, 06800 Mérida, Badajoz.
                  </p>

                  <a
                    href="https://maps.google.com/?q=Hotel+Velada+Merida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8214] text-[#12080a] font-cinzel text-xs font-bold tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  >
                    <MapPin size={16} />
                    <span>📍 ABRIR EN GOOGLE MAPS</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              🧳 SECCIÓN: EQUIPAJE DEL LEGIONARIO (Módulo Práctico)
             ======================================================== */}
          <section className="bg-[#1f0b0f] rounded-2xl border-2 border-[#d4af37]/80 overflow-hidden shadow-xl">
            <div 
              onClick={() => setLuggageOpen(!luggageOpen)}
              className="p-4 bg-gradient-to-r from-[#3f0910] to-[#25060a] border-b border-[#d4af37]/40 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Luggage size={18} className="text-[#d4af37]" />
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wider">
                    EQUIPAJE DEL LEGIONARIO
                  </h3>
                  <span className="text-[11px] font-lora text-[#f3e5ab]/80">
                    Módulo práctico de preparación para el viaje
                  </span>
                </div>
              </div>
              <button 
                className="p-1 rounded text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                aria-label={luggageOpen ? 'Plegar lista' : 'Desplegar lista'}
              >
                {luggageOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {luggageOpen && (
              <div className="p-4 space-y-2.5 bg-[#170609]">
                <p className="text-xs font-lora text-[#fbf7ee]/70 italic mb-2">
                  Recuerda no olvidarte nada en la maleta:
                </p>

                {/* Item 1: Túnica / Toga */}
                <div 
                  onClick={() => toggleLuggage('toga')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                    luggageItems.toga 
                      ? 'bg-[#2f0a12] border-[#d4af37]' 
                      : 'bg-[#22070c] border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 ${
                    luggageItems.toga ? 'bg-[#d4af37] border-[#d4af37] text-[#12080a]' : 'border-[#d4af37]/40'
                  }`}>
                    {luggageItems.toga && <Check size={14} className="stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-cinzel text-xs font-bold text-[#f3e5ab] block">
                      Túnica romana
                    </span>
                    <span className="font-lora text-xs text-[#fbf7ee]/80">
                      O, a falta de ésta, ropa en tonos beige, marrón y blancos
                    </span>
                  </div>
                </div>

                {/* Item 2: Calzado cómodo */}
                <div 
                  onClick={() => toggleLuggage('calzado')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                    luggageItems.calzado 
                      ? 'bg-[#2f0a12] border-[#d4af37]' 
                      : 'bg-[#22070c] border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 ${
                    luggageItems.calzado ? 'bg-[#d4af37] border-[#d4af37] text-[#12080a]' : 'border-[#d4af37]/40'
                  }`}>
                    {luggageItems.calzado && <Check size={14} className="stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-cinzel text-xs font-bold text-[#f3e5ab] block">
                      Calzado cómodo
                    </span>
                    <span className="font-lora text-xs text-[#fbf7ee]/80">
                      Para patear calzadas romanas de piedra sin descanso.
                    </span>
                  </div>
                </div>

                {/* Item 3: Gafas de sol y crema */}
                <div 
                  onClick={() => toggleLuggage('proteccion')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                    luggageItems.proteccion 
                      ? 'bg-[#2f0a12] border-[#d4af37]' 
                      : 'bg-[#22070c] border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 ${
                    luggageItems.proteccion ? 'bg-[#d4af37] border-[#d4af37] text-[#12080a]' : 'border-[#d4af37]/40'
                  }`}>
                    {luggageItems.proteccion && <Check size={14} className="stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-cinzel text-xs font-bold text-[#f3e5ab] block">
                      Gafas de sol y crema solar
                    </span>
                    <span className="font-lora text-xs text-[#fbf7ee]/80">
                      ¡El sol extremeño aprieta en mayo!
                    </span>
                  </div>
                </div>

                {/* Item 4: Muchas ganas de pasarlo bien */}
                <div 
                  onClick={() => toggleLuggage('ganas')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                    luggageItems.ganas 
                      ? 'bg-[#2f0a12] border-[#d4af37]' 
                      : 'bg-[#22070c] border-[#d4af37]/30 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 ${
                    luggageItems.ganas ? 'bg-[#d4af37] border-[#d4af37] text-[#12080a]' : 'border-[#d4af37]/40'
                  }`}>
                    {luggageItems.ganas && <Check size={14} className="stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-cinzel text-xs font-bold text-[#f3e5ab] block">
                      Muchas ganas de pasarlo bien
                    </span>
                    <span className="font-lora text-xs text-[#fbf7ee]/80">
                      Y dar súper mimos a tu bebita!
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              🎟️ SECCIÓN: TESSERA HOSPITALIS (Vales Románticos del Viaje)
             ======================================================== */}
          <section className="bg-gradient-to-br from-[#25080e] to-[#18060a] rounded-2xl p-5 border-2 border-[#d4af37] shadow-xl">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 mb-1">
                <Ticket size={13} className="text-[#d4af37]" />
                <span className="text-[10px] font-cinzel font-bold text-[#f3e5ab] uppercase tracking-wider">
                  PACTVM ROMANTICVM
                </span>
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#f3e5ab] tracking-wider">
                VALES ROMÁNTICOS
              </h3>
              <p className="font-lora text-xs text-[#fbf7ee]/75">
                Canjeables únicamente durante nuestra expedición a Mérida
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vale 1: Helado */}
              <div className="relative bg-[#fbf7ee] rounded-xl border-2 border-[#d4af37] p-4 text-[#1f1f1f] shadow-md overflow-hidden flex flex-col justify-between">
                {/* Notches */}
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1e070b] border-r-2 border-[#d4af37]" />
                <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1e070b] border-l-2 border-[#d4af37]" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] font-bold text-[#6b0f1a] uppercase tracking-wider">
                      VALE OFICIAL I
                    </span>
                    <span className="text-xl">🍦</span>
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-[#6b0f1a] leading-snug">
                    Vale por un helado
                  </h4>
                  <p className="font-lora text-xs text-[#4a393d] mt-1">
                    Pagado íntegramente por la Centuriona en las mejores heladerías de Mérida.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d4af37]/40 flex items-center justify-between">
                  {redeemedVouchers.helado ? (
                    <span className="w-full text-center py-1.5 rounded-lg bg-[#6b0f1a] text-[#f3e5ab] font-cinzel text-xs font-bold tracking-wider shadow">
                      ✓ CANJEADO POR MARCOS
                    </span>
                  ) : (
                    <button
                      onClick={() => redeemVoucher('helado')}
                      className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#12080a] font-cinzel text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow"
                    >
                      CANJEAR VALE 🍦
                    </button>
                  )}
                </div>
              </div>

              {/* Vale 2: Chupachups */}
              <div className="relative bg-[#fbf7ee] rounded-xl border-2 border-[#d4af37] p-4 text-[#1f1f1f] shadow-md overflow-hidden flex flex-col justify-between">
                {/* Notches */}
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1e070b] border-r-2 border-[#d4af37]" />
                <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1e070b] border-l-2 border-[#d4af37]" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cinzel text-[10px] font-bold text-[#6b0f1a] uppercase tracking-wider">
                      VALE OFICIAL II
                    </span>
                    <span className="text-xl">🍭</span>
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-[#6b0f1a] leading-snug">
                    Vale por un Chupachups*
                  </h4>
                  <p className="font-lora text-xs text-[#4a393d] mt-1">
                    Para satisfacer momentos muy dulces en la conquista romana nocturna.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d4af37]/40 flex items-center justify-between">
                  {redeemedVouchers.chupachups ? (
                    <span className="w-full text-center py-1.5 rounded-lg bg-[#6b0f1a] text-[#f3e5ab] font-cinzel text-xs font-bold tracking-wider shadow">
                      ✓ CANJEADO POR MARCOS
                    </span>
                  ) : (
                    <button
                      onClick={() => redeemVoucher('chupachups')}
                      className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#12080a] font-cinzel text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow"
                    >
                      CANJEAR VALE 🍭
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer info */}
        <footer className="text-center text-[11px] font-cinzel text-[#d4af37]/50 pt-4 border-t border-[#d4af37]/15">
          <p>CONVOCATORIA IMPERIAL PARA MARCOS PRATO</p>
          <p className="font-lora text-[10px] text-[#d4af37]/40 mt-1">
            Una sorpresa de cumpleaños inolvidable · Susana Castillo 2026
          </p>
        </footer>
      </main>

      {/* ========================================================
          FULL-SCREEN IMAGE PREVIEW MODAL
         ======================================================== */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#180608] rounded-2xl border-2 border-[#d4af37] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 bg-[#2d090f] border-b border-[#d4af37]/40 flex items-center justify-between">
              <div className="pr-4">
                <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#f3e5ab]">
                  {activeModalImage.title}
                </h4>
                <p className="font-lora text-[11px] text-gray-300">
                  {activeModalImage.subtitle}
                </p>
              </div>
              <button
                onClick={() => setActiveModalImage(null)}
                className="p-1.5 rounded-full bg-[#12080a] text-[#d4af37] hover:bg-[#6b0f1a] transition-colors border border-[#d4af37]/30"
                aria-label="Cerrar modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable / Zoomable Modal Image */}
            <div className="overflow-auto max-h-[75vh] p-2 flex items-center justify-center bg-black/40">
              <img
                src={activeModalImage.src}
                alt={activeModalImage.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Modal Footer with Direct Link / Close */}
            <div className="p-2.5 bg-[#25060a] border-t border-[#d4af37]/30 flex items-center justify-between text-xs font-cinzel">
              {/* <span className="text-[#d4af37]/70 text-[11px]">Usa dos dedos o rueda para explorar</span> */}
              <button
                onClick={() => setActiveModalImage(null)}
                className="px-3 py-1 rounded bg-[#6b0f1a] text-[#fbf7ee] font-bold hover:bg-[#801220]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
