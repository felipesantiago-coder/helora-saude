'use client';

interface OrganicNatureBgProps {
  variant?: 'hero' | 'understory' | 'forest-floor' | 'soil' | 'roots' | 'sage' | 'light' | 'dark';
  className?: string;
}

/**
 * ══════════════════════════════════════════════════════════════════════════
 * FOREST CANOPY-TO-ROOTS VERTICAL JOURNEY BACKGROUND SYSTEM
 * ══════════════════════════════════════════════════════════════════════════
 *
 * Based on calming UX research:
 *   - Attention Restoration Theory (Kaplan 1995): "soft fascination" in nature
 *     restores directed attention capacity
 *   - Biophilic Design (Kellert & Calabrese 2015): biomorphic forms, mystery,
 *     and visual connection with nature reduce cortisol 15-37%
 *   - Prospect-Refuge Theory (Appleton 1975): canopy (refuge) → floor (prospect)
 *     creates the safest psychological gradient
 *   - Resonance Breathing: ~0.085 Hz (12s cycle) maximizes HRV / vagal tone
 *
 * Layer system (top → bottom):
 *   1. HERO (Canopy)        — Dense overlapping foliage, branches, dappled bokeh light
 *   2. UNDERSTORY            — Vertical vine/light-ray patterns, scattered hanging leaves
 *   3. FOREST-FLOOR          — Horizontal scattered leaf-litter, ground-cover curves
 *   4. SOIL (Mycelium)       — Interconnected network lines, warm sienna tones
 *   5. ROOTS                 — Branching downward patterns, deep earth tones
 *
 * Animation: scale-only breathing (0.5-4%), opacity baked into fills/gradients.
 * fill-mode: both + cubic-bezier(0.45,0.05,0.55,0.95) for seamless loops.
 * NO filter:blur() — uses radial-gradient and SVG only (avoids scrollHeight bug).
 */
export function OrganicNatureBg({ variant = 'sage', className = '' }: OrganicNatureBgProps) {

  /* ─── 1. HERO — Minimal dark gradient with subtle dappled light ───
     Design: less is more. A confident dark gradient with two large,
     ultra-soft radial accents that hint at filtered canopy light.
     No shapes, no branches, no SVG — just depth through light. */
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* Single large light pool — dappled canopy hint */}
        <div
          className="absolute breathe-d"
          style={{
            top: '10%',
            left: '50%',
            width: '90vw',
            height: '70vh',
            maxWidth: 800,
            maxHeight: 600,
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(200,215,155,0.12) 0%, rgba(170,185,125,0.06) 35%, transparent 70%)',
          }}
        />

        {/* Warm edge accent — subtle sienna glow bottom-right */}
        <div
          className="absolute breathe-e"
          style={{
            bottom: '15%',
            right: '-5%',
            width: '60vw',
            height: '50vh',
            maxWidth: 500,
            maxHeight: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 60% 60%, rgba(156,97,70,0.08) 0%, transparent 65%)',
          }}
        />
      </div>
    );
  }

  /* ─── 2. UNDERSTORY — Entering the forest, vertical vine & light-ray patterns ───
     Biophilic cue: "Mystery" — partially filtered light, hanging organic forms.
     Vertical shapes direct the eye downward, encouraging scroll exploration. */
  if (variant === 'understory') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Subtle green-tinted gradient — filtered canopy light */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(40,49,6,0.03)] via-transparent to-[rgba(40,49,6,0.02)]" />

        {/* Vine/light-ray SVG layer — vertical organic paths + scattered leaves */}
        <svg
          className="absolute inset-0 w-full h-full breathe-a"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main vine — left */}
          <path d="M180 0 Q175 120, 195 240 Q215 360, 188 480 Q170 560, 195 640 Q210 720, 192 800" stroke="rgba(119,127,92,0.09)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M195 240 Q240 220, 280 245" stroke="rgba(119,127,92,0.06)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M188 480 Q145 465, 110 490" stroke="rgba(119,127,92,0.05)" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Main vine — right */}
          <path d="M1250 0 Q1260 100, 1240 220 Q1220 340, 1255 460 Q1275 560, 1248 680 Q1235 740, 1255 800" stroke="rgba(119,127,92,0.08)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M1240 220 Q1195 205, 1155 228" stroke="rgba(119,127,92,0.05)" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Secondary vine — center */}
          <path d="M720 0 Q715 80, 730 160 Q748 240, 725 320" stroke="rgba(119,127,92,0.06)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Hanging moss/fern accents — drooping curves from top */}
          <path d="M380 0 Q385 40, 375 80 Q368 110, 382 140" stroke="rgba(119,127,92,0.05)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M1050 0 Q1055 35, 1045 70 Q1038 95, 1052 120" stroke="rgba(119,127,92,0.04)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M550 0 Q545 30, 555 60 Q560 80, 548 105" stroke="rgba(119,127,92,0.04)" strokeWidth="0.8" strokeLinecap="round" fill="none" />

          {/* Scattered understory leaves */}
          <path d="M210 180 Q228 162, 238 180 Q244 198, 224 202 Q206 196, 210 180Z" fill="rgba(119,127,92,0.06)" />
          <path d="M1220 160 Q1238 144, 1246 162 Q1250 178, 1232 182 Q1216 176, 1220 160Z" fill="rgba(119,127,92,0.05)" />
          <path d="M730 120 Q745 106, 752 122 Q756 136, 740 138 Q726 134, 730 120Z" fill="rgba(119,127,92,0.04)" />
          <path d="M390 350 Q405 336, 412 352 Q416 366, 400 368 Q386 364, 390 350Z" fill="rgba(119,127,92,0.04)" />
          <path d="M1060 380 Q1075 366, 1082 382 Q1086 396, 1070 398 Q1056 394, 1060 380Z" fill="rgba(119,127,92,0.04)" />
          <path d="M160 550 Q175 538, 182 554 Q186 566, 170 568 Q158 564, 160 550Z" fill="rgba(119,127,92,0.03)" />
          <path d="M1280 520 Q1295 508, 1300 524 Q1304 536, 1288 538 Q1276 534, 1280 520Z" fill="rgba(119,127,92,0.03)" />
        </svg>

        {/* Second layer — offset rhythm for organic asynchrony */}
        <svg
          className="absolute inset-0 w-full h-full breathe-d"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Light-ray strips — elongated vertical light filtering through */}
          <path d="M0 60 Q10 200, 5 400 Q0 600, 8 800" stroke="rgba(170,180,130,0.04)" strokeWidth="40" strokeLinecap="round" fill="none" />
          <path d="M0 120 Q5 300, 2 500 Q0 650, 6 800" stroke="rgba(170,180,130,0.03)" strokeWidth="25" strokeLinecap="round" fill="none" />
          <path d="M1440 80 Q1430 250, 1435 450 Q1440 650, 1432 800" stroke="rgba(170,180,130,0.035)" strokeWidth="35" strokeLinecap="round" fill="none" />
          <path d="M480 0 Q475 180, 482 400 Q488 600, 478 800" stroke="rgba(170,180,130,0.025)" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M960 0 Q965 200, 958 450 Q952 650, 962 800" stroke="rgba(170,180,130,0.02)" strokeWidth="18" strokeLinecap="round" fill="none" />

          {/* Extra vine accents */}
          <path d="M600 0 Q595 100, 608 200 Q618 300, 605 400" stroke="rgba(119,127,92,0.04)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M880 0 Q885 90, 872 180 Q862 270, 878 360" stroke="rgba(119,127,92,0.035)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  /* ─── 3. FOREST-FLOOR — Scattered horizontal leaf-litter & ground-cover ───
     Biophilic cue: "Material Connection with Nature" — warm earth tones emerge.
     Horizontal shapes suggest being at ground level, looking at the forest floor.
     Shapes transition from vertical (above) to horizontal (here). */
  if (variant === 'forest-floor') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Subtle warm gradient overlay — earth tones filtering in */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(156,97,70,0.015)] via-transparent to-[rgba(44,36,28,0.02)]" />

        {/* Ground-cover SVG — horizontal organic patterns */}
        <svg
          className="absolute inset-0 w-full h-full breathe-b"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Horizontal ground-cover waves — like moss/fern edges */}
          <path d="M0 150 Q180 130, 360 155 Q540 180, 720 148 Q900 118, 1080 145 Q1260 170, 1440 140" stroke="rgba(119,127,92,0.06)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M0 350 Q200 330, 400 355 Q600 380, 800 348 Q1000 318, 1200 350 Q1350 368, 1440 342" stroke="rgba(119,127,92,0.05)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M0 550 Q240 535, 480 558 Q720 580, 960 548 Q1200 518, 1440 545" stroke="rgba(119,127,92,0.04)" strokeWidth="0.8" strokeLinecap="round" fill="none" />

          {/* Scattered leaf-litter — small ellipses at varied rotations */}
          <ellipse cx="200" cy="200" rx="28" ry="9" transform="rotate(25 200 200)" fill="rgba(119,127,92,0.04)" />
          <ellipse cx="450" cy="120" rx="22" ry="7" transform="rotate(-15 450 120)" fill="rgba(156,97,70,0.035)" />
          <ellipse cx="750" cy="280" rx="32" ry="10" transform="rotate(40 750 280)" fill="rgba(119,127,92,0.04)" />
          <ellipse cx="1050" cy="180" rx="25" ry="8" transform="rotate(-30 1050 180)" fill="rgba(119,127,92,0.035)" />
          <ellipse cx="1300" cy="320" rx="30" ry="9" transform="rotate(55 1300 320)" fill="rgba(156,97,70,0.03)" />
          <ellipse cx="100" cy="420" rx="26" ry="8" transform="rotate(10 100 420)" fill="rgba(119,127,92,0.03)" />
          <ellipse cx="580" cy="480" rx="24" ry="7" transform="rotate(-45 580 480)" fill="rgba(163,155,130,0.03)" />
          <ellipse cx="900" cy="400" rx="28" ry="9" transform="rotate(20 900 400)" fill="rgba(119,127,92,0.035)" />
          <ellipse cx="1200" cy="520" rx="22" ry="7" transform="rotate(-60 1200 520)" fill="rgba(156,97,70,0.03)" />
          <ellipse cx="350" cy="620" rx="30" ry="10" transform="rotate(35 350 620)" fill="rgba(119,127,92,0.03)" />
          <ellipse cx="680" cy="680" rx="26" ry="8" transform="rotate(-20 680 680)" fill="rgba(163,155,130,0.025)" />
          <ellipse cx="1100" cy="650" rx="28" ry="9" transform="rotate(50 1100 650)" fill="rgba(119,127,92,0.025)" />

          {/* Small twig accents */}
          <line x1="300" y1="160" x2="345" y2="172" stroke="rgba(44,36,28,0.03)" strokeWidth="0.8" />
          <line x1="820" y1="240" x2="860" y2="255" stroke="rgba(44,36,28,0.025)" strokeWidth="0.7" />
          <line x1="620" y1="360" x2="655" y2="370" stroke="rgba(44,36,28,0.025)" strokeWidth="0.8" />
          <line x1="1000" y1="440" x2="1030" y2="448" stroke="rgba(44,36,28,0.02)" strokeWidth="0.7" />
          <line x1="180" y1="560" x2="218" y2="572" stroke="rgba(44,36,28,0.02)" strokeWidth="0.7" />
        </svg>

        {/* Second layer — offset rhythm */}
        <svg
          className="absolute inset-0 w-full h-full breathe-e"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Warm-toned scattered leaves */}
          <ellipse cx="280" cy="320" rx="20" ry="6" transform="rotate(65 280 320)" fill="rgba(156,97,70,0.025)" />
          <ellipse cx="620" cy="200" rx="24" ry="8" transform="rotate(-40 620 200)" fill="rgba(163,155,130,0.02)" />
          <ellipse cx="950" cy="560" rx="26" ry="8" transform="rotate(30 950 560)" fill="rgba(156,97,70,0.02)" />
          <ellipse cx="1350" cy="200" rx="22" ry="7" transform="rotate(-55 1350 200)" fill="rgba(119,127,92,0.025)" />
          <ellipse cx="80" cy="680" rx="24" ry="8" transform="rotate(15 80 680)" fill="rgba(163,155,130,0.02)" />
          <ellipse cx="480" cy="540" rx="20" ry="7" transform="rotate(-25 480 540)" fill="rgba(119,127,92,0.02)" />
        </svg>

        {/* Subtle warm bokeh spots — must be OUTSIDE <svg> (HTML div invalid inside SVG) */}
        <div className="absolute breathe-d" style={{ top: '20%', left: '10%', width: '30vw', height: '30vw', maxWidth: 280, maxHeight: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,155,130,0.06) 0%, rgba(163,155,130,0) 65%)' }} />
        <div className="absolute breathe-a" style={{ top: '50%', right: '5%', width: '35vw', height: '35vw', maxWidth: 320, maxHeight: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,97,70,0.04) 0%, rgba(156,97,70,0) 65%)' }} />
      </div>
    );
  }

  /* ─── 4. SOIL / MYCELIUM — Interconnected network beneath the surface ───
     Biophilic cue: "Connection with Nature" — the living network underground.
     Warm sienna/tan tones. Network patterns evoke mycelium/root connections.
     Psychological effect: feeling connected to something larger, grounding. */
  if (variant === 'soil') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Warm sienna-tinted gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(156,97,70,0.02)] via-[rgba(44,36,28,0.015)] to-[rgba(40,49,6,0.025)]" />

        {/* Mycelium network SVG */}
        <svg
          className="absolute inset-0 w-full h-full breathe-d"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Primary network curves — interconnected flowing paths */}
          <path d="M100 200 Q250 170, 400 220 Q550 270, 700 210 Q850 150, 1000 200 Q1150 250, 1300 190" stroke="rgba(156,97,70,0.06)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M50 350 Q200 320, 380 370 Q560 420, 740 360 Q920 300, 1100 350 Q1280 400, 1400 340" stroke="rgba(156,97,70,0.05)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M200 100 Q320 140, 450 110 Q580 80, 720 120 Q860 160, 1000 110" stroke="rgba(119,127,92,0.04)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M150 480 Q300 450, 480 490 Q660 530, 840 480 Q1020 430, 1200 470 Q1320 500, 1400 460" stroke="rgba(119,127,92,0.035)" strokeWidth="0.7" strokeLinecap="round" fill="none" />

          {/* Cross-connections — diagonal links between main paths */}
          <path d="M400 220 Q420 300, 380 370" stroke="rgba(156,97,70,0.04)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
          <path d="M700 210 Q720 290, 740 360" stroke="rgba(156,97,70,0.035)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          <path d="M1000 200 Q1020 280, 1100 350" stroke="rgba(156,97,70,0.03)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          <path d="M250 170 Q280 140, 320 140" stroke="rgba(119,127,92,0.03)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          <path d="M580 80 Q620 100, 660 120" stroke="rgba(119,127,92,0.025)" strokeWidth="0.6" strokeLinecap="round" fill="none" />

          {/* Node points — where connections meet (living intersections) */}
          <circle cx="400" cy="220" r="3" fill="rgba(156,97,70,0.06)" />
          <circle cx="700" cy="210" r="3.5" fill="rgba(156,97,70,0.05)" />
          <circle cx="1000" cy="200" r="3" fill="rgba(156,97,70,0.05)" />
          <circle cx="380" cy="370" r="2.5" fill="rgba(156,97,70,0.04)" />
          <circle cx="740" cy="360" r="3" fill="rgba(156,97,70,0.04)" />
          <circle cx="1100" cy="350" r="2.5" fill="rgba(156,97,70,0.035)" />
          <circle cx="480" cy="110" r="2.5" fill="rgba(119,127,92,0.035)" />
          <circle cx="720" cy="120" r="3" fill="rgba(119,127,92,0.03)" />
          <circle cx="480" cy="490" r="2.5" fill="rgba(119,127,92,0.03)" />
          <circle cx="840" cy="480" r="3" fill="rgba(119,127,92,0.03)" />
          <circle cx="1200" cy="470" r="2.5" fill="rgba(119,127,92,0.025)" />

          {/* Secondary fine network threads */}
          <path d="M150 250 Q200 230, 260 250 Q320 270, 370 245" stroke="rgba(163,155,130,0.03)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M800 280 Q860 260, 920 285 Q980 310, 1050 280" stroke="rgba(163,155,130,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M300 400 Q360 385, 420 405 Q480 425, 540 400" stroke="rgba(163,155,130,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M900 420 Q960 400, 1020 425 Q1080 445, 1140 420" stroke="rgba(163,155,130,0.02)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
        </svg>

        {/* Warm radial gradient accents */}
        <div className="absolute breathe-a" style={{ top: '30%', left: '15%', width: '40vw', height: '40vw', maxWidth: 350, maxHeight: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,97,70,0.06) 0%, rgba(156,97,70,0) 65%)' }} />
        <div className="absolute breathe-c" style={{ bottom: '10%', right: '10%', width: '35vw', height: '35vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.05) 0%, rgba(119,127,92,0) 65%)' }} />
      </div>
    );
  }

  /* ─── 5. ROOTS — Deep underground, branching downward patterns ───
     Biophilic cue: "Grounding" — deep earth tones, downward branching.
     Psychological effect: feeling rooted, stable, secure (prospect-refuge theory).
     Inverted branching from top suggests descending into the earth. */
  if (variant === 'roots') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Root branching SVG — inverted tree from top, branching downward */}
        <svg
          className="absolute inset-0 w-full h-full breathe-b"
          viewBox="0 0 1440 500"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main central root — thick, branching downward */}
          <path d="M720 0 Q710 50, 730 110 Q748 170, 722 240 Q708 290, 728 350 Q742 400, 725 460 Q718 490, 730 500" stroke="rgba(119,127,92,0.12)" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Primary branches — from main root */}
          <path d="M730 110 Q680 145, 630 170 Q580 195, 540 180" stroke="rgba(119,127,92,0.09)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M730 110 Q780 140, 830 165 Q880 188, 930 172" stroke="rgba(119,127,92,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M722 240 Q660 272, 600 295 Q540 318, 490 302" stroke="rgba(119,127,92,0.07)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M722 240 Q790 268, 850 290 Q910 312, 960 298" stroke="rgba(119,127,92,0.065)" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Secondary branches */}
          <path d="M630 170 Q600 200, 565 225 Q530 248, 500 238" stroke="rgba(119,127,92,0.05)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M630 170 Q650 210, 640 255 Q632 290, 615 310" stroke="rgba(119,127,92,0.045)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M830 165 Q860 195, 885 230 Q910 260, 935 248" stroke="rgba(119,127,92,0.045)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M830 165 Q810 200, 818 245 Q824 280, 810 305" stroke="rgba(119,127,92,0.04)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M600 295 Q570 320, 545 350" stroke="rgba(119,127,92,0.035)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M850 290 Q880 315, 910 340" stroke="rgba(119,127,92,0.03)" strokeWidth="0.8" strokeLinecap="round" fill="none" />

          {/* Tertiary root hairs — very fine */}
          <path d="M540 180 Q520 200, 500 225" stroke="rgba(119,127,92,0.03)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          <path d="M540 180 Q560 210, 565 240" stroke="rgba(119,127,92,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M930 172 Q950 195, 968 222" stroke="rgba(119,127,92,0.03)" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          <path d="M930 172 Q910 198, 905 228" stroke="rgba(119,127,92,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M490 302 Q470 325, 455 355" stroke="rgba(119,127,92,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />
          <path d="M960 298 Q980 320, 995 348" stroke="rgba(119,127,92,0.025)" strokeWidth="0.5" strokeLinecap="round" fill="none" />

          {/* Far-side lateral roots */}
          <path d="M240 0 Q245 60, 235 130 Q228 190, 242 260 Q250 310, 238 370" stroke="rgba(119,127,92,0.05)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M235 130 Q200 155, 165 175 Q130 195, 100 185" stroke="rgba(119,127,92,0.035)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M235 130 Q270 160, 305 180" stroke="rgba(119,127,92,0.03)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M1200 0 Q1195 55, 1208 120 Q1218 185, 1202 250 Q1195 300, 1210 360" stroke="rgba(119,127,92,0.045)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M1208 120 Q1240 148, 1275 168 Q1310 188, 1345 178" stroke="rgba(119,127,92,0.03)" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M1208 120 Q1175 152, 1140 172" stroke="rgba(119,127,92,0.025)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
        </svg>

        {/* Earth-toned radial gradient warmth */}
        <div className="absolute breathe-d" style={{ top: '10%', left: '25%', width: '50vw', height: '50vw', maxWidth: 450, maxHeight: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.06) 0%, rgba(119,127,92,0) 65%)' }} />
        <div className="absolute breathe-a" style={{ bottom: '5%', right: '20%', width: '40vw', height: '40vw', maxWidth: 350, maxHeight: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,97,70,0.04) 0%, rgba(156,97,70,0) 60%)' }} />
      </div>
    );
  }

  /* ─── FALLBACK: DARK — Minimal breathing glows for dark sections ─── */
  if (variant === 'dark') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute breathe-b" style={{ top: '10%', left: '5%', width: '40vw', height: '40vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.12) 0%, rgba(119,127,92,0) 70%)' }} />
        <div className="absolute breathe-c" style={{ top: '40%', right: '5%', width: '50vw', height: '50vw', maxWidth: 400, maxHeight: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,102,64,0.08) 0%, rgba(90,102,64,0) 70%)' }} />
      </div>
    );
  }

  /* ─── FALLBACK: LIGHT — Subtle breathing glows for light sections ─── */
  if (variant === 'light') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute breathe-b" style={{ top: '20%', right: '10%', width: '45vw', height: '45vw', maxWidth: 350, maxHeight: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)' }} />
        <div className="absolute breathe-a" style={{ bottom: '10%', left: '5%', width: '35vw', height: '35vw', maxWidth: 250, maxHeight: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,155,130,0.06) 0%, rgba(163,155,130,0) 70%)' }} />
      </div>
    );
  }

  /* ─── FALLBACK: SAGE — Minimal subtle sage glows ─── */
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute breathe-b" style={{ top: '10%', right: '10%', width: '40vw', height: '40vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)' }} />
      <div className="absolute breathe-c" style={{ bottom: '20%', left: '5%', width: '30vw', height: '30vw', maxWidth: 220, maxHeight: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(119,127,92,0.06) 0%, rgba(119,127,92,0) 70%)' }} />
    </div>
  );
}

/**
 * Floating leaf decoration — CSS-only animation, hidden on mobile
 */
export function FloatingLeaf({ className = '', size = 'md', color = 'sage' }: { className?: string; size?: 'sm' | 'md' | 'lg'; color?: 'sage' | 'dark' | 'sienna' }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const colorMap = { sage: 'rgba(119,127,92,0.12)', dark: 'rgba(40,49,6,0.12)', sienna: 'rgba(156,97,70,0.12)' };
  const s = sizeMap[size];
  const c = colorMap[color];

  return (
    <div
      className={`pointer-events-none select-none hidden md:block animate-drift ${className}`}
      aria-hidden="true"
    >
      <svg width={s} height={s} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z"
          fill={c}
        />
      </svg>
    </div>
  );
}

/**
 * Organic branch decoration — hidden on mobile
 */
export function OrganicBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none select-none hidden md:block ${className}`}
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 200 Q55 160, 50 120 Q42 70, 65 30 Q75 10, 80 5"
          stroke="#777F5C"
          strokeWidth="1"
          opacity="0.15"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M65 30 Q80 15, 95 20 Q105 30, 90 40 Q75 48, 65 30Z"
          fill="#777F5C"
          opacity="0.08"
        />
        <path
          d="M50 120 Q35 108, 28 115 Q22 125, 38 128 Q48 130, 50 120Z"
          fill="#777F5C"
          opacity="0.06"
        />
      </svg>
    </div>
  );
}