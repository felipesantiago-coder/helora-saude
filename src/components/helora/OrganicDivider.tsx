interface OrganicDividerProps {
  variant?: 'sage' | 'o' | 'leaf';
  className?: string;
}

/**
 * Organic dividers that reinforce the forest canopy-to-roots descent.
 *
 * "leaf" variant: Vine-like hanging elements (understory transition)
 *   — Vertical emphasis, small drooping curves, leaf buds
 *
 * "sage" variant: Ground-cover transition (understory → forest floor)
 *   — Horizontal emphasis, mossy curves, earth-tone accents
 *
 * "o" variant: Brand divider (unchanged)
 */
export function OrganicDivider({ variant = 'sage', className = '' }: OrganicDividerProps) {
  if (variant === 'o') {
    return (
      <div className={`max-w-4xl mx-auto px-4 organic-o-divider my-12 md:my-16 ${className}`}>
        <span className="organic-o">O</span>
      </div>
    );
  }

  if (variant === 'leaf') {
    return (
      <div className={`w-full ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Vine-like hanging curves — vertical drooping forms */}
          <path
            d="M320 0 Q325 30, 315 55 Q308 72, 320 88"
            stroke="rgba(119,127,92,0.12)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M710 0 Q715 25, 705 50 Q698 68, 712 85"
            stroke="rgba(119,127,92,0.10)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M1100 0 Q1105 28, 1095 52 Q1088 70, 1102 86"
            stroke="rgba(119,127,92,0.09)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Subtle flowing connection line */}
          <path
            d="M0 50 Q120 85, 240 65 Q400 35, 560 55 Q720 75, 880 45 Q1040 15, 1200 40 Q1350 65, 1440 35"
            stroke="rgba(119,127,92,0.10)"
            strokeWidth="0.8"
            fill="none"
          />
          {/* Small leaf buds at vine tips */}
          <path
            d="M320 88 Q330 78, 335 90 Q338 98, 324 100 Q314 96, 320 88Z"
            fill="rgba(119,127,92,0.08)"
          />
          <path
            d="M712 85 Q722 76, 726 88 Q728 96, 716 98 Q706 94, 712 85Z"
            fill="rgba(119,127,92,0.07)"
          />
          <path
            d="M1102 86 Q1112 77, 1116 89 Q1118 97, 1106 98 Q1096 94, 1102 86Z"
            fill="rgba(119,127,92,0.06)"
          />
        </svg>
      </div>
    );
  }

  /* variant === 'sage' — ground-cover transition (understory → forest floor) */
  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        {/* Horizontal ground-cover curves — mossy/fern-like */}
        <path
          d="M0 50 Q180 15, 360 40 Q540 65, 720 35 Q900 5, 1080 30 Q1260 55, 1440 25"
          stroke="rgba(119, 127, 92, 0.15)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Warmer secondary curve — earth tones emerging */}
        <path
          d="M0 45 Q240 75, 480 50 Q720 25, 960 55 Q1200 80, 1440 45"
          stroke="rgba(156, 97, 70, 0.06)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Scattered small ground-cover leaf shapes */}
        <path
          d="M360 30 Q375 18, 385 30 Q390 42, 372 44 Q358 40, 360 30Z"
          fill="rgba(119, 127, 92, 0.07)"
        />
        <path
          d="M720 20 Q732 10, 740 22 Q744 34, 728 36 Q716 32, 720 20Z"
          fill="rgba(119, 127, 92, 0.06)"
        />
        <path
          d="M1080 28 Q1092 18, 1098 30 Q1102 40, 1088 42 Q1076 38, 1080 28Z"
          fill="rgba(156, 97, 70, 0.05)"
        />
        {/* Subtle horizontal twig accent */}
        <line x1="200" y1="48" x2="260" y2="44" stroke="rgba(44,36,28,0.03)" strokeWidth="0.6" />
        <line x1="900" y1="42" x2="950" y2="38" stroke="rgba(44,36,28,0.025)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}