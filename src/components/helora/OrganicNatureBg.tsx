'use client';

import { motion } from 'framer-motion';

interface OrganicNatureBgProps {
  variant?: 'hero' | 'sage' | 'light' | 'dark';
  className?: string;
}

/**
 * Organic nature background — living forest canopy viewed from below.
 *
 * Layer system:
 *   1. Dark gradient base (shadows / gaps between foliage)
 *   2. Canopy SVG layer — organic leaf masses (lighter = catching light)
 *      with branch structure and pointed leaf accents. Subtle CSS blur
 *      gives a painterly, impressionistic quality.
 *   3. Bokeh radial-gradient circles (brightest light in canopy openings)
 *   4. Floating leaf accents (subtle motion)
 *
 * Color logic: on dark green base, canopy shapes must be LIGHTER
 * (sunlit foliage). Dark areas = gaps/shadows showing the base.
 *
 * Animations: scale-only breathing, opacity baked into fills/gradients.
 * fill-mode: both + cubic-bezier(0.45,0.05,0.55,0.95) for smoothness.
 */
export function OrganicNatureBg({ variant = 'sage', className = '' }: OrganicNatureBgProps) {
  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        {/* ── Layer 1: Dark gradient base ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2605] via-[#283106] to-[#2a3a0a]" />

        {/* ── Layer 2: Abstract canopy — NO blur, sharp organic forms ──
            Two SVG layers: foliage masses (breathing) + branches/tips (static).
            High enough contrast to be readable as organic canopy shapes.
            The dark base shows through as gaps between illuminated foliage. */}

        {/* Foliage masses — painterly organic blobs */}
        <svg
          className="absolute inset-0 w-full h-full breathe-a"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large crown — top-left, dense canopy */}
          <path
            d="M80 30 Q150 -20, 260 15 Q340 -30, 430 25 Q520 -10, 600 50
               Q670 25, 720 85 Q770 65, 760 125 Q745 180, 700 215
               Q730 255, 685 290 Q710 330, 655 360 Q620 395, 545 378
               Q505 410, 440 385 Q380 420, 310 390 Q245 425, 185 385
               Q125 415, 85 365 Q35 390, 15 340 Q-20 305, 0 260
               Q-30 225, 10 190 Q-15 150, 25 115 Q5 75, 50 48 Q60 20, 80 30Z"
            fill="rgba(72,90,38,0.55)"
          />
          {/* Inner sunlit layer */}
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

        {/* Branches & leaf tips — crisp, sharp, no animation */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main branch — left */}
          <path d="M200 0 Q175 90, 210 190 Q245 290, 200 400 Q175 470, 210 540"
            stroke="rgba(130,155,72,0.45)" strokeWidth="4" strokeLinecap="round" />
          <path d="M210 190 Q285 165, 350 200" stroke="rgba(130,155,72,0.35)" strokeWidth="3" strokeLinecap="round" />
          <path d="M200 400 Q135 375, 85 410" stroke="rgba(130,155,72,0.28)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M350 200 Q382 178, 405 198" stroke="rgba(130,155,72,0.20)" strokeWidth="2" strokeLinecap="round" />

          {/* Main branch — right */}
          <path d="M1220 0 Q1240 100, 1200 210 Q1170 310, 1210 420 Q1235 490, 1200 560"
            stroke="rgba(130,155,72,0.42)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M1200 210 Q1125 188, 1075 220" stroke="rgba(130,155,72,0.30)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M1210 420 Q1275 398, 1320 432" stroke="rgba(130,155,72,0.22)" strokeWidth="2" strokeLinecap="round" />

          {/* Secondary branches — center */}
          <path d="M720 0 Q710 70, 740 150 Q760 220, 730 290" stroke="rgba(130,155,72,0.32)" strokeWidth="3" strokeLinecap="round" />
          <path d="M740 150 Q815 130, 870 168" stroke="rgba(130,155,72,0.22)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M460 0 Q448 65, 470 140" stroke="rgba(130,155,72,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M980 0 Q990 80, 965 170 Q948 230, 975 300" stroke="rgba(130,155,72,0.25)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Twig details */}
          <path d="M350 200 Q385 182, 415 205 Q445 190, 458 218" stroke="rgba(130,155,72,0.18)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1075 220 Q1048 205, 1018 228" stroke="rgba(130,155,72,0.15)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M870 168 Q895 152, 915 170" stroke="rgba(130,155,72,0.14)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Pointed leaf-tip accents */}
          <path d="M130 140 Q168 90, 182 138 Q205 112, 195 165 Q158 158, 130 140Z" fill="rgba(140,165,75,0.45)" />
          <path d="M620 60 Q658 20, 670 68 Q695 45, 682 98 Q648 90, 620 60Z" fill="rgba(140,165,75,0.42)" />
          <path d="M790 55 Q828 18, 840 65 Q862 42, 852 92 Q820 84, 790 55Z" fill="rgba(140,165,75,0.38)" />
          <path d="M1200 100 Q1238 62, 1248 108 Q1270 85, 1260 135 Q1230 128, 1200 100Z" fill="rgba(140,165,75,0.38)" />
          <path d="M350 420 Q385 385, 395 428 Q418 408, 410 452 Q380 444, 350 420Z" fill="rgba(130,155,68,0.35)" />
          <path d="M1100 400 Q1135 368, 1145 410 Q1168 390, 1158 432 Q1128 424, 1100 400Z" fill="rgba(130,155,68,0.32)" />
          <path d="M470 180 Q502 152, 512 190 Q532 172, 525 210 Q498 202, 470 180Z" fill="rgba(130,155,68,0.32)" />
          <path d="M900 180 Q932 150, 942 190 Q962 170, 955 210 Q928 202, 900 180Z" fill="rgba(130,155,68,0.28)" />
          <path d="M250 350 Q275 328, 285 360 Q302 345, 295 378 Q270 370, 250 350Z" fill="rgba(120,145,62,0.28)" />
          <path d="M1150 340 Q1178 315, 1188 350 Q1205 335, 1198 370 Q1172 362, 1150 340Z" fill="rgba(120,145,62,0.25)" />
          <path d="M55 220 Q78 195, 88 225 Q105 210, 100 242 Q78 235, 55 220Z" fill="rgba(120,145,62,0.25)" />
          <path d="M1350 180 Q1375 158, 1382 188 Q1398 172, 1392 205 Q1368 198, 1350 180Z" fill="rgba(120,145,62,0.22)" />
        </svg>

        {/* Second foliage layer — offset rhythm, breathing */}
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

        {/* ── Layer 3: Dappled bokeh light — brightest spots in canopy openings ── */}

        {/* Upper-center opening — brightest direct light */}
        <div
          className="absolute breathe-c"
          style={{
            top: '5%',
            left: '30%',
            width: '30vw',
            height: '30vw',
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,215,155,0.42) 0%, rgba(170,185,125,0.20) 40%, rgba(140,155,95,0) 70%)',
          }}
        />

        {/* Center gap — main light shaft */}
        <div
          className="absolute breathe-a"
          style={{
            top: '28%',
            left: '25%',
            width: '40vw',
            height: '40vw',
            maxWidth: 440,
            maxHeight: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(175,190,135,0.35) 0%, rgba(145,160,105,0.16) 42%, rgba(119,127,92,0) 72%)',
          }}
        />

        {/* Right gap — warm sienna light */}
        <div
          className="absolute breathe-b"
          style={{
            top: '12%',
            right: '8%',
            width: '28vw',
            height: '28vw',
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,148,100,0.30) 0%, rgba(156,97,70,0.12) 42%, rgba(119,127,92,0) 70%)',
          }}
        />

        {/* Lower center — ambient diffused light */}
        <div
          className="absolute breathe-b"
          style={{
            bottom: '5%',
            left: '15%',
            width: '55vw',
            height: '55vw',
            maxWidth: 560,
            maxHeight: 560,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,168,120,0.25) 0%, rgba(128,138,92,0.10) 45%, rgba(100,110,72,0) 75%)',
          }}
        />

        {/* Cool green accent — lower right */}
        <div
          className="absolute breathe-c"
          style={{
            bottom: '10%',
            right: '2%',
            width: '38vw',
            height: '38vw',
            maxWidth: 380,
            maxHeight: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(115,168,128,0.28) 0%, rgba(88,138,98,0.10) 42%, rgba(74,122,90,0) 70%)',
          }}
        />

        {/* Left edge soft light */}
        <div
          className="absolute breathe-a"
          style={{
            top: '50%',
            left: '-8%',
            width: '30vw',
            height: '30vw',
            maxWidth: 290,
            maxHeight: 290,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,165,118,0.22) 0%, rgba(128,138,92,0.08) 45%, rgba(100,110,72,0) 72%)',
          }}
        />

        {/* ── Layer 4: Floating leaf accents (desktop only) ── */}
        <motion.div
          className="absolute hidden md:block"
          style={{ top: '15%', left: '10%', width: 100, height: 100 }}
          animate={{ y: [0, -12, 0], rotate: [0, 4, -2, 0], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#777F5C" opacity="0.3" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute hidden md:block"
          style={{ top: '55%', right: '8%', width: 70, height: 70 }}
          animate={{ y: [0, 10, -6, 0], rotate: [0, -3, 5, 0], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M30 5 Q52 18, 48 40 Q44 56, 25 55 Q6 54, 8 35 Q10 16, 30 5Z" fill="#4a7a5a" opacity="0.25" />
          </svg>
        </motion.div>
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div
          className="absolute breathe-b"
          style={{
            top: '10%',
            left: '5%',
            width: '40vw',
            height: '40vw',
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(119,127,92,0.12) 0%, rgba(119,127,92,0) 70%)',
          }}
        />
        <div
          className="absolute breathe-c"
          style={{
            top: '40%',
            right: '5%',
            width: '50vw',
            height: '50vw',
            maxWidth: 400,
            maxHeight: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(90,102,64,0.08) 0%, rgba(90,102,64,0) 70%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
        <div
          className="absolute breathe-b"
          style={{
            top: '20%',
            right: '10%',
            width: '45vw',
            height: '45vw',
            maxWidth: 350,
            maxHeight: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)',
          }}
        />
        <div
          className="absolute breathe-a"
          style={{
            bottom: '10%',
            left: '5%',
            width: '35vw',
            height: '35vw',
            maxWidth: 250,
            maxHeight: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(163,155,130,0.06) 0%, rgba(163,155,130,0) 70%)',
          }}
        />
      </div>
    );
  }

  /* variant === 'sage' */
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute breathe-b"
        style={{
          top: '10%',
          right: '10%',
          width: '40vw',
          height: '40vw',
          maxWidth: 300,
          maxHeight: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,127,92,0.08) 0%, rgba(119,127,92,0) 70%)',
        }}
      />
      <div
        className="absolute breathe-c"
        style={{
          bottom: '20%',
          left: '5%',
          width: '30vw',
          height: '30vw',
          maxWidth: 220,
          maxHeight: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(119,127,92,0.06) 0%, rgba(119,127,92,0) 70%)',
        }}
      />
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