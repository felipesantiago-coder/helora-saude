interface OrganicDividerProps {
  className?: string;
}

export function OrganicDivider({ className = '' }: OrganicDividerProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 organic-o-divider my-12 md:my-16 ${className}`}>
      <span className="organic-o">O</span>
    </div>
  );
}