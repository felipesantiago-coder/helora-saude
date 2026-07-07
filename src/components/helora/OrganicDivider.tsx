interface OrganicDividerProps {
  variant?: 'sage' | 'o' | 'leaf';
  className?: string;
}

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
          {/* Multi-layered organic flowing curves with leaf-like movements */}
          <path
            d="M0 50 Q120 85, 240 65 Q400 35, 560 55 Q720 75, 880 45 Q1040 15, 1200 40 Q1350 65, 1440 35"
            stroke="#777F5C"
            strokeWidth="1"
            fill="none"
            opacity="0.15"
          />
          <path
            d="M0 55 Q180 30, 360 50 Q540 70, 720 40 Q900 10, 1080 35 Q1260 60, 1440 45"
            stroke="#9C6146"
            strokeWidth="0.8"
            fill="none"
            opacity="0.1"
          />
          {/* Small leaf accent in the center */}
          <path
            d="M710 20 Q730 10, 740 25 Q745 40, 725 45 Q705 40, 710 20Z"
            fill="#777F5C"
            opacity="0.08"
          />
        </svg>
      </div>
    );
  }

  /* variant === 'sage' — default organic flowing wave divider */
  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        {/* Primary flowing organic curve */}
        <path
          d="M0 50 Q180 15, 360 40 Q540 65, 720 35 Q900 5, 1080 30 Q1260 55, 1440 25"
          stroke="rgba(119, 127, 92, 0.2)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary softer curve */}
        <path
          d="M0 45 Q240 75, 480 50 Q720 25, 960 55 Q1200 80, 1440 45"
          stroke="rgba(156, 97, 70, 0.08)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        {/* Subtle leaf accent */}
        <path
          d="M360 30 Q375 15, 385 28 Q390 40, 370 42 Q355 38, 360 30Z"
          fill="rgba(119, 127, 92, 0.1)"
        />
        <path
          d="M1080 20 Q1095 8, 1103 22 Q1108 35, 1090 37 Q1075 33, 1080 20Z"
          fill="rgba(119, 127, 92, 0.07)"
        />
      </svg>
    </div>
  );
}