'use client';

import { motion } from 'framer-motion';

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

  /* ─── 1. HERO — Forest Canopy viewed from below ─── */
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* Layer 1: Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* Layer 2: Abstract canopy — organic foliage masses with branch structure */}
        <svg
          className="absolute inset-0 w-full h-full breathe-a"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large crown — top-left */}
          <path
            d="M80 30 Q150 -20, 260 15 Q340 -30, 430 25 Q520 -10, 600 50
               Q670 25, 720 85 Q770 65, 760 125 Q745 180, 700 215
               Q730 255, 685 290 Q710 330, 655 360 Q620 395, 545 378
               Q505 410, 440 385 Q380 420, 310 390 Q245 425, 185 385
               Q125 415, 85 365 Q35 390, 15 340 Q-20 305, 0 260
               Q-30 225, 10 190 Q-15 150, 25 115 Q5 75, 50 48 Q60 20, 80 30Z"
            fill="rgba(72,90,38,0.55)"
          />
          <path
            d="M160 80 Q220 50, 300 85 Q355 55, 405 95
               Q460 70, 495 115 Q535 95, 540 145
               Q570 175, 535 210 Q555 245, 515 268
               Q490 298, 445 280 Q410 305, 365 282
               Q315 310, 265 280 Q220 302, 185 270
               Q145 288, 125 250 Q95 268, 82 235
               Q55 215, 72 185 Q48 155, 75 130
               Q58 100, 90 85 Q115 60, 160 80Z"
            fill="rgba(95,115,50,0.35)"
          />
          {/* Large crown — top-right */}
          <path
            d="M750 40 Q820 5, 920 35 Q1000 0, 1080 40 Q1150 15, 1220 65
               Q1280 45, 1320 95 Q1360 80, 1355 130 Q1345 175, 1305 205
               Q1330 240, 1290 270 Q1310 305, 1260 330 Q1225 360, 1155 345
               Q1115 375, 1050 350 Q990 380, 930 350
               Q870 378, 815 345 Q765 370, 735 330
               Q695 350, 675 310 Q645 285, 660 250
               Q635 220, 665 190 Q645 158, 680 128
               Q665 95, 700 70 Q720 42, 750 40Z"
            fill="rgba(72,90,38,0.50)"
          />
          <path
            d="M830 90 Q890 60, 960 92 Q1010 62, 1060 98
               Q1110 75, 1140 118 Q1175 100, 1170 148
               Q1195 178, 1165 208 Q1180 240, 1145 258
               Q1120 285, 1078 270 Q1045 292, 1005 272
               Q960 295, 918 268 Q878 288, 848 258
               Q815 272, 800 242 Q775 228, 790 198
               Q768 172, 795 148 Q778 118, 810 98
               Q830 75, 830 90Z"
            fill="rgba(95,115,50,0.30)"
          />
          {/* Mid-canopy — left */}
          <path
            d="M40 280 Q100 250, 175 285 Q230 258, 285 295
               Q340 270, 380 310 Q420 290, 425 335
               Q448 365, 418 395 Q440 425, 405 448
               Q378 475, 328 460 Q292 482, 248 458
               Q205 478, 165 448 Q125 468, 95 435
               Q60 452, 38 418 Q12 392, 28 358
               Q8 328, 35 305 Q22 278, 40 280Z"
            fill="rgba(75,92,40,0.38)"
          />
          {/* Mid-canopy — right */}
          <path
            d="M1020 300 Q1075 272, 1140 305 Q1190 278, 1240 312
               Q1290 288, 1325 325 Q1360 308, 1362 350
               Q1380 378, 1352 405 Q1370 435, 1338 455
               Q1312 480, 1265 465 Q1230 488, 1188 462
               Q1145 485, 1108 455 Q1070 475, 1040 442
               Q1008 460, 988 428 Q965 408, 978 378
               Q958 350, 985 328 Q968 302, 1020 300Z"
            fill="rgba(75,92,40,0.35)"
          />
          {/* Extra depth — center-top */}
          <path
            d="M550 50 Q610 20, 680 55 Q730 30, 780 65 Q830 45, 850 85
               Q880 70, 878 110 Q865 145, 835 168
               Q855 195, 820 215 Q800 240, 755 228
               Q720 248, 680 225 Q635 248, 595 220
               Q555 240, 530 210 Q505 225, 495 198
               Q475 180, 490 155 Q472 132, 498 112
               Q485 85, 515 68 Q530 48, 550 50Z"
            fill="rgba(80,98,42,0.25)"
          />
        </svg>

        {/* Branches & leaf tips — crisp, static */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M200 0 Q175 90, 210 190 Q245 290, 200 400 Q175 470, 210 540" stroke="rgba(130,155,72,0.45)" strokeWidth="4" strokeLinecap="round" />
          <path d="M210 190 Q285 165, 350 200" stroke="rgba(130,155,72,0.35)" strokeWidth="3" strokeLinecap="round" />
          <path d="M200 400 Q135 375, 85 410" stroke="rgba(130,155,72,0.28)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M350 200 Q382 178, 405 198" stroke="rgba(130,155,72,0.20)" strokeWidth="2" strokeLinecap="round" />
          <path d="M1220 0 Q1240 100, 1200 210 Q1170 310, 1210 420 Q1235 490, 1200 560" stroke="rgba(130,155,72,0.42)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M1200 210 Q1125 188, 1075 220" stroke="rgba(130,155,72,0.30)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M1210 420 Q1275 398, 1320 432" stroke="rgba(130,155,72,0.22)" strokeWidth="2" strokeLinecap="round" />
          <path d="M720 0 Q710 70, 740 150 Q760 220, 730 290" stroke="rgba(130,155,72,0.32)" strokeWidth="3" strokeLinecap="round" />
          <path d="M740 150 Q815 130, 870 168" stroke="rgba(130,155,72,0.22)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M460 0 Q448 65, 470 140" stroke="rgba(130,155,72,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M980 0 Q990 80, 965 170 Q948 230, 975 300" stroke="rgba(130,155,72,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Leaf-tip accents */}
          <path d="M130 140 Q168 90, 182 138 Q205 112, 195 165 Q158 158, 130 140Z" fill="rgba(140,165,75,0.45)" />
          <path d="M620 60 Q658 20, 670 68 Q695 45, 682 98 Q648 90, 620 60Z" fill="rgba(140,165,75,0.42)" />
          <path d="M790 55 Q828 18, 840 65 Q862 42, 852 92 Q820 84, 790 55Z" fill="rgba(140,165,75,0.38)" />
          <path d="M1200 100 Q1238 62, 1248 108 Q1270 85, 1260 135 Q1230 128, 1200 100Z" fill="rgba(140,165,75,0.38)" />
          <path d="M350 420 Q385 385, 395 428 Q418 408, 410 452 Q380 444, 350 420Z" fill="rgba(130,155,68,0.35)" />
          <path d="M1100 400 Q1135 368, 1145 410 Q1168 390, 1158 432 Q1128 424, 1100 400Z" fill="rgba(130,155,68,0.32)" />
        </svg>

        {/* Second foliage layer — offset breathing rhythm */}
        <svg
          className="absolute inset-0 w-full h-full breathe-b"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 450 Q155 425, 215 455 Q265 430, 310 465
               Q355 445, 380 480 Q405 465, 408 500
               Q425 525, 400 548 Q418 572, 388 590
               Q360 612, 315 598 Q278 618, 238 592
               Q195 612, 160 582 Q125 600, 105 572
               Q78 555, 90 528 Q68 508, 88 485
               Q72 462, 100 450Z"
            fill="rgba(80,98,42,0.22)"
          />
          <path
            d="M1050 180 Q1100 155, 1155 185 Q1200 162, 1240 195
               Q1280 175, 1300 210 Q1325 198, 1322 235
               Q1340 260, 1315 282 Q1330 308, 1300 325
               Q1275 348, 1232 335 Q1200 355, 1160 330
               Q1120 352, 1088 322 Q1055 342, 1035 312
               Q1010 295, 1022 268 Q1005 245, 1028 225
               Q1012 198, 1050 180Z"
            fill="rgba(80,98,42,0.20)"
          />
        </svg>

        {/* Layer 3: Dappled bokeh light — radial gradients in canopy openings */}
        <div className="absolute breathe-c" style={{ top: '5%', left: '30%', width: '30vw', height: '30vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,215,155,0.42) 0%, rgba(170,185,125,0.20) 40%, rgba(140,155,95,0) 70%)' }} />
        <div className="absolute breathe-a" style={{ top: '28%', left: '25%', width: '40vw', height: '40vw', maxWidth: 440, maxHeight: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(175,190,135,0.35) 0%, rgba(145,160,105,0.16) 42%, rgba(119,127,92,0) 72%)' }} />
        <div className="absolute breathe-b" style={{ top: '12%', right: '8%', width: '28vw', height: '28vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,148,100,0.30) 0%, rgba(156,97,70,0.12) 42%, rgba(119,127,92,0) 70%)' }} />
        <div className="absolute breathe-b" style={{ bottom: '5%', left: '15%', width: '55vw', height: '55vw', maxWidth: 560, maxHeight: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,168,120,0.25) 0%, rgba(128,138,92,0.10) 45%, rgba(100,110,72,0) 75%)' }} />
        <div className="absolute breathe-c" style={{ bottom: '10%', right: '2%', width: '38vw', height: '38vw', maxWidth: 380, maxHeight: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(115,168,128,0.28) 0%, rgba(88,138,98,0.10) 42%, rgba(74,122,90,0) 70%)' }} />
        <div className="absolute breathe-a" style={{ top: '50%', left: '-8%', width: '30vw', height: '30vw', maxWidth: 290, maxHeight: 290, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,165,118,0.22) 0%, rgba(128,138,92,0.08) 45%, rgba(100,110,72,0) 72%)' }} />

        {/* Layer 4: Floating leaf accents (desktop) */}
        <motion.div className="absolute hidden md:block" style={{ top: '15%', left: '10%', width: 100, height: 100 }} animate={{ y: [0, -12, 0], rotate: [0, 4, -2, 0], opacity: [0.1, 0.18, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}>
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#777F5C" opacity="0.3" />
          </svg>
        </motion.div>
        <motion.div className="absolute hidden md:block" style={{ top: '55%', right: '8%', width: 70, height: 70 }} animate={{ y: [0, 10, -6, 0], rotate: [0, -3, 5, 0], opacity: [0.08, 0.14, 0.08] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}>
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#4a7a5a" opacity="0.25" />
          </svg>
        </motion.div>
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

          {/* Subtle warm bokeh spots */}
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '30vw', height: '30vw', maxWidth: 280, maxHeight: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,155,130,0.06) 0%, rgba(163,155,130,0) 65%)' }} />
          <div style={{ position: 'absolute', top: '50%', right: '5%', width: '35vw', height: '35vw', maxWidth: 320, maxHeight: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,97,70,0.04) 0%, rgba(156,97,70,0) 65%)' }} />
        </svg>
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