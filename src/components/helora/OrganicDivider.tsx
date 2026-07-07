interface OrganicDividerProps {
  variant?: 'sage' | 'o';
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

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C240 80, 480 80, 720 40 C960 0, 1200 0, 1440 40 L1440 80 L0 80 Z"
          fill="rgba(119, 127, 92, 0.06)"
        />
      </svg>
    </div>
  );
}